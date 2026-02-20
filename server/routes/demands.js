const express = require('express');
const db = require('../db');
const { handleError } = require('../helpers/crud');

const router = express.Router();

/**
 * PUT /demands/:id
 * Custom update route that tracks stage and status history changes.
 */
router.put('/:id', async (req, res) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const body = { ...req.body };
        Object.keys(body).forEach(key => {
            if (body[key] === '') body[key] = null;
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

module.exports = router;
