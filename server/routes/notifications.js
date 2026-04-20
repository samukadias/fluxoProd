const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * GET /notifications
 * Get notifications for the current authenticated user
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, unread_only } = req.query;

        let query = 'SELECT * FROM notifications WHERE user_id = $1';
        const values = [userId];

        if (unread_only === 'true') {
            query += ' AND read = FALSE';
        }

        query += ' ORDER BY created_at DESC LIMIT $2';
        values.push(parseInt(limit));

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('[NOTIFICATIONS ERROR]:', err.message);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

/**
 * GET /notifications/unread-count
 * Get count of unread notifications for authenticated user
 */
router.get('/unread-count', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = FALSE',
            [userId]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error('[NOTIFICATIONS COUNT ERROR]:', err.message);
        res.status(500).json({ error: 'Failed to fetch count.' });
    }
});

/**
 * PUT /notifications/:id/read
 * Mark a notification as read
 */
router.put('/:id/read', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            'UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('[NOTIFICATION READ ERROR]:', err.message);
        res.status(500).json({ error: 'Failed to update notification.' });
    }
});

/**
 * PUT /notifications/mark-all-read
 * Mark all notifications as read for authenticated user
 */
router.put('/mark-all-read', async (req, res) => {
    try {
        const userId = req.user.id;
        await db.query(
            'UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE',
            [userId]
        );
        res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
        console.error('[NOTIFICATION MARK ALL ERROR]:', err.message);
        res.status(500).json({ error: 'Failed to mark all as read.' });
    }
});

/**
 * Generate notifications for expiring contracts.
 * Called by cron job in main server.
 */
const generateExpiringContractNotifications = async () => {
    try {
        // Find contracts expiring in 30, 60, 90 days
        const intervals = [
            { days: 30, type: 'contract_expiring_30' },
            { days: 60, type: 'contract_expiring_60' },
            { days: 90, type: 'contract_expiring_90' },
        ];

        // Get managers and relevant users
        const managers = await db.query(
            "SELECT id FROM users WHERE role IN ('manager', 'admin') AND (department IN ('GOR', 'COCR') OR allowed_modules @> '{contracts}')"
        );

        for (const { days, type } of intervals) {
            const contracts = await db.query(`
                SELECT id, cliente, contrato, data_fim_efetividade
                FROM archive_prazos_contracts
                WHERE data_fim_efetividade BETWEEN NOW() AND NOW() + INTERVAL '${days} days'
                AND status = 'Ativo'
            `);

            for (const contract of contracts.rows) {
                for (const manager of managers.rows) {
                    // Check if notification already exists for this contract + user + type
                    const existing = await db.query(
                        'SELECT id FROM notifications WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3 AND type = $4',
                        [manager.id, 'deadline_contract', contract.id, type]
                    );

                    if (existing.rows.length === 0) {
                        await db.query(
                            `INSERT INTO notifications (user_id, type, title, message, entity_type, entity_id)
                             VALUES ($1, $2, $3, $4, $5, $6)`,
                            [
                                manager.id,
                                type,
                                `Contrato vencendo em ${days} dias`,
                                `O contrato ${contract.contrato} do cliente ${contract.cliente} vence em ${new Date(contract.data_fim_efetividade).toLocaleDateString('pt-BR')}.`,
                                'deadline_contract',
                                contract.id
                            ]
                        );
                    }
                }
            }
        }

        // Also check for overdue demands: notify the responsible analyst AND CDPC managers
        // Single JOIN query — avoids N+1
        const overdueResult = await db.query(`
            SELECT 
                d.id as demand_id,
                d.product,
                d.expected_delivery_date,
                u.id as user_id
            FROM demands d
            JOIN analysts a ON d.analyst_id = a.id
            JOIN users u ON LOWER(u.email) = LOWER(a.email)
            WHERE d.expected_delivery_date < NOW()
            AND d.status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA')
        `);

        // Get CDPC managers to also receive overdue alerts
        const cdpcManagers = await db.query(
            "SELECT id FROM users WHERE role IN ('manager', 'admin') AND department = 'CDPC'"
        );

        for (const row of overdueResult.rows) {
            const recipientIds = new Set([row.user_id]);
            cdpcManagers.rows.forEach(m => recipientIds.add(m.id));

            const dueDate = new Date(row.expected_delivery_date).toLocaleDateString('pt-BR');

            for (const recipientId of recipientIds) {
                // Avoid duplicate: only one notification per demand per user per day
                const existing = await db.query(
                    `SELECT id FROM notifications 
                     WHERE user_id = $1 AND entity_type = 'demand' AND entity_id = $2 
                     AND type = 'demand_overdue'
                     AND created_at > NOW() - INTERVAL '24 hours'`,
                    [recipientId, row.demand_id]
                );
                if (existing.rows.length === 0) {
                    await db.query(
                        `INSERT INTO notifications (user_id, type, title, message, entity_type, entity_id)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            recipientId,
                            'demand_overdue',
                            '⚠️ Demanda com prazo vencido',
                            `A demanda "${row.product}" está atrasada desde ${dueDate}. Atualize o status ou justifique o atraso.`,
                            'demand',
                            row.demand_id
                        ]
                    );
                }
            }
        }

        console.log(`[CRON] Notificações processadas: ${overdueResult.rows.length} demandas atrasadas verificadas.`);
    } catch (err) {
        console.error('[NOTIFICATION CRON ERROR]:', err.message);
    }
};

module.exports = { router, generateExpiringContractNotifications };

