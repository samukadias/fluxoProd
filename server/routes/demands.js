const express = require('express');
const db = require('../db');
const { handleError } = require('../helpers/crud');

const router = express.Router();

/**
 * GET /demands/metadata/active-roles
 * Returns distinct user IDs assigned to each role across all demands
 */
router.get('/metadata/active-roles', async (req, res) => {
    let client;
    try {
        client = await db.connect();
        const [analystRes, supportRes, archRes, reqRes] = await Promise.all([
            client.query('SELECT DISTINCT analyst_id FROM demands WHERE analyst_id IS NOT NULL'),
            client.query('SELECT DISTINCT support_analyst_id FROM demands WHERE support_analyst_id IS NOT NULL'),
            client.query('SELECT DISTINCT architect_support_analyst_id FROM demands WHERE architect_support_analyst_id IS NOT NULL'),
            client.query('SELECT DISTINCT requester_id FROM demands WHERE requester_id IS NOT NULL')
        ]);
        
        res.json({
            analyst_id: analystRes.rows.map(r => String(r.analyst_id)),
            support_analyst_id: supportRes.rows.map(r => String(r.support_analyst_id)),
            architect_support_analyst_id: archRes.rows.map(r => String(r.architect_support_analyst_id)),
            executive_id: reqRes.rows.map(r => String(r.requester_id))
        });
    } catch (err) {
        handleError(err, res, 'Fetch active roles metadata');
    } finally {
        if (client) client.release();
    }
});

/**
 * PUT /demands/:id
 * Custom update route that tracks stage and status history changes.
 */
// Allowed fields for update (prevents SQL injection and crashes from unknown fields)
const UPDATABLE_FIELDS = [
    'demand_number', 'product', 'artifact', 'value', 'weight',
    'margem_bruta', 'margem_liquida',
    'qualification_date', 'expected_delivery_date', 'delivery_date',
    'status', 'client_id', 'cycle_id', 'stage',
    'analyst_id', 'requester_id', 'support_analyst_id',
    'architect_support_analyst_id', 'product_type', 'demand_types'
];

router.put('/:id', async (req, res) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const body = { ...req.body };
        // Strip unknown/non-allowed fields and convert empty strings to null
        Object.keys(body).forEach(key => {
            if (!UPDATABLE_FIELDS.includes(key)) {
                delete body[key];
            } else if (body[key] === '') {
                body[key] = null;
            } else if (typeof body[key] === 'object' && body[key] !== null) {
                // Ensure arrays and objects are stringified for JSONB columns!
                body[key] = JSON.stringify(body[key]);
            }
        });

        const keys = Object.keys(body);
        const values = Object.values(body);

        if (keys.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No fields to update' });
        }

        const { stage, status } = body;

        // Fetch current state
        const currentRes = await client.query('SELECT stage, status FROM demands WHERE id = $1', [req.params.id]);
        const currentDemand = currentRes.rows[0];

        if (!currentDemand) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Demand not found' });
        }

        const oldStage = currentDemand.stage;
        const oldStatus = currentDemand.status;

        // STAGE HISTORY LOGIC
        if (stage && stage !== oldStage) {
            const now = new Date();
            await client.query(`
                UPDATE stage_history
                SET exited_at = $1, duration_minutes = EXTRACT(EPOCH FROM ($1 - entered_at))/60
                WHERE demand_id = $2 AND stage = $3 AND exited_at IS NULL
            `, [now, req.params.id, oldStage]);

            await client.query(`
                INSERT INTO stage_history (demand_id, stage, entered_at)
                VALUES ($1, $2, $3)
            `, [req.params.id, stage, now]);
        } else if (!oldStage && stage) {
            await client.query(`
                INSERT INTO stage_history (demand_id, stage, entered_at)
                VALUES ($1, $2, NOW())
            `, [req.params.id, stage]);
        }

        // STATUS HISTORY LOGIC
        const newStatusNorm = status ? status.trim().toUpperCase() : null;
        const oldStatusNorm = oldStatus ? oldStatus.trim().toUpperCase() : null;

        if (newStatusNorm && newStatusNorm !== oldStatusNorm) {
            const now = new Date();
            const changedBy = req.user ? req.user.name || req.user.email : 'System';

            // Calculate time spent in previous status
            let timeInPreviousMinutes = null;
            const lastHistoryRes = await client.query(
                'SELECT changed_at FROM status_history WHERE demand_id = $1 ORDER BY changed_at DESC LIMIT 1',
                [req.params.id]
            );
            if (lastHistoryRes.rows.length > 0) {
                const lastChangedAt = new Date(lastHistoryRes.rows[0].changed_at);
                timeInPreviousMinutes = Math.round((now - lastChangedAt) / 60000);
            } else {
                // First status change — use demand created_date as reference
                const demandRes = await client.query(
                    'SELECT created_date FROM demands WHERE id = $1',
                    [req.params.id]
                );
                if (demandRes.rows[0]?.created_date) {
                    const createdAt = new Date(demandRes.rows[0].created_date);
                    timeInPreviousMinutes = Math.round((now - createdAt) / 60000);
                }
            }

            await client.query(`
                INSERT INTO status_history (demand_id, from_status, to_status, changed_at, time_in_previous_status_minutes, changed_by)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [req.params.id, oldStatus, status, now, timeInPreviousMinutes, changedBy]);
        }

        // Update the demand
        const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
        const query = `UPDATE demands SET ${setClause} WHERE id = $1 RETURNING *`;

        const result = await client.query(query, [req.params.id, ...values]);

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        handleError(err, res, 'Update demand');
    } finally {
        client.release();
    }
});

/**
 * DELETE /demands/:id/history
 * Clear status history for a demand
 */
router.delete('/:id/history', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM status_history WHERE demand_id = $1', [req.params.id]);
        res.json({ message: 'History cleared successfully', count: result.rowCount });
    } catch (err) {
        handleError(err, res, 'Clear history');
    }
});

/**
 * DELETE /demands/:id
 * Delete a demand and all related records (cascade)
 */
router.delete('/:id', async (req, res) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM status_history WHERE demand_id = $1', [req.params.id]);
        await client.query('DELETE FROM stage_history WHERE demand_id = $1', [req.params.id]);
        await client.query("DELETE FROM activity_log WHERE entity = 'demands' AND entity_id = $1", [String(req.params.id)]);

        const result = await client.query('DELETE FROM demands WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Demand not found' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        handleError(err, res, 'Delete demand');
    } finally {
        client.release();
    }
});


/**
 * GET /demands/:id/annotations
 * List all annotations for a demand
 */
router.get('/:id/annotations', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM demand_annotations WHERE demand_id = $1 ORDER BY created_at DESC',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        handleError(err, res, 'Fetch annotations');
    }
});

/**
 * POST /demands/:id/annotations
 * Add a new annotation
 */
router.post('/:id/annotations', async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const userId = req.user?.id;
        let userName = req.user?.name || req.user?.full_name;

        // Se o nome não estiver no token, busca no banco para garantir a identificação correta
        if (!userName && userId) {
            const userRes = await db.query('SELECT name FROM users WHERE id = $1', [userId]);
            if (userRes.rows.length > 0) {
                userName = userRes.rows[0].name;
            }
        }
        
        if (!userName) userName = req.user?.email || 'Usuário';

        const result = await db.query(
            `INSERT INTO demand_annotations (demand_id, user_id, user_name, text)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.params.id, userId, userName, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleError(err, res, 'Add annotation');
    }
});

/**
 * DELETE /demands/annotations/:id
 * Delete an annotation (Admin only)
 */
router.delete('/annotations/:id', async (req, res) => {
    // Permission check: only admin
    if (req.user?.role !== 'admin' && req.user?.profile_type !== 'admin') {
        return res.status(403).json({ error: 'Only administrators can delete annotations' });
    }

    try {
        const result = await db.query(
            'DELETE FROM demand_annotations WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Annotation not found' });
        }

        res.json({ message: 'Annotation deleted successfully' });
    } catch (err) {
        handleError(err, res, 'Delete annotation');
    }
});

module.exports = router;
