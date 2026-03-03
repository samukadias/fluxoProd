const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 * GET /metrics/cdpc
 * High-performance aggregation for CDPC Dashboard
 */
router.get('/cdpc', async (req, res) => {
    const client = await db.connect();
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 1-12 in Postgres EXTRACT

        const queries = {
            backlogCount: `SELECT COUNT(*) FROM demands WHERE status NOT IN ('ENTREGUE', 'CANCELADA')`,
            entriesThisMonth: `SELECT COUNT(*) FROM demands WHERE EXTRACT(YEAR FROM COALESCE(qualification_date, created_date)) = $1 AND EXTRACT(MONTH FROM COALESCE(qualification_date, created_date)) = $2`,
            deliveredThisMonth: `SELECT COUNT(*) FROM demands WHERE status = 'ENTREGUE' AND EXTRACT(YEAR FROM delivery_date) = $1 AND EXTRACT(MONTH FROM delivery_date) = $2`,
            highPriority: `SELECT COUNT(*) FROM demands WHERE status NOT IN ('ENTREGUE', 'CANCELADA') AND artifact ILIKE 'proposta' AND weight IN (0, 1)`,
            deliveredThisYear: `SELECT COUNT(*) FROM demands WHERE status = 'ENTREGUE' AND EXTRACT(YEAR FROM delivery_date) = $1`,
            valueThisYearObj: `SELECT SUM(value::numeric) as total_value, COUNT(NULLIF(value::numeric, 0)) as total_count FROM demands WHERE EXTRACT(YEAR FROM created_date) = $1 AND value::numeric > 0`,
            topClients: `
                SELECT c.name, COUNT(d.id) as count
                FROM demands d
                JOIN clients c ON d.client_id = c.id
                WHERE d.status NOT IN ('ENTREGUE', 'CANCELADA')
                GROUP BY c.id, c.name
                ORDER BY count DESC
                LIMIT 5
            `,
            currentlyReopened: `
                SELECT d.id, d.product, d.client_id, d.delivery_date, c.name as client_name 
                FROM demands d 
                LEFT JOIN clients c ON d.client_id = c.id
                WHERE d.status = 'REABERTA'
            `
        };

        const [
            backlogRes, entriesRes, deliveredMonthRes, highPriorityRes, deliveredYearRes, valueYearRes, topClientsRes, reopenedRes
        ] = await Promise.all([
            client.query(queries.backlogCount),
            client.query(queries.entriesThisMonth, [currentYear, currentMonth]),
            client.query(queries.deliveredThisMonth, [currentYear, currentMonth]),
            client.query(queries.highPriority),
            client.query(queries.deliveredThisYear, [currentYear]),
            client.query(queries.valueThisYearObj, [currentYear]),
            client.query(queries.topClients),
            client.query(queries.currentlyReopened)
        ]);

        res.json({
            backlog: parseInt(backlogRes.rows[0].count),
            entriesThisMonth: parseInt(entriesRes.rows[0].count),
            deliveredThisMonth: parseInt(deliveredMonthRes.rows[0].count),
            highPriority: parseInt(highPriorityRes.rows[0].count),
            deliveredThisYear: parseInt(deliveredYearRes.rows[0].count),
            valueThisYear: parseFloat(valueYearRes.rows[0].total_value || 0),
            valuedDemandsCount: parseInt(valueYearRes.rows[0].total_count || 0),
            topClients: topClientsRes.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
            currentlyReopened: reopenedRes.rows
        });
    } catch (err) {
        console.error("Error fetching CDPC metrics:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

/**
 * GET /metrics/cocr
 * High-performance aggregation for COCR Dashboard
 */
router.get('/cocr', async (req, res) => {
    const client = await db.connect();
    try {
        const queries = {
            totals: `SELECT COUNT(*) as total_count, SUM(valor_contrato) as global_value FROM contracts WHERE status ILIKE 'Ativo'`,
            aditamentos: `
                SELECT COUNT(*) as count, SUM(valor_aditamento) as total_value 
                FROM contracts 
                WHERE status ILIKE 'Ativo' 
                AND (
                    tipo_tratativa ILIKE '%adit%' OR 
                    etapa ILIKE '%adit%' OR 
                    (tipo_aditamento IS NOT NULL AND TRIM(tipo_aditamento) != '')
                )
            `,
            assinaturas: `
                SELECT COUNT(*) as count, SUM(valor_contrato) as total_value 
                FROM contracts 
                WHERE status ILIKE 'Ativo' 
                AND tipo_tratativa ILIKE '%prorroga%' 
                AND (etapa ILIKE '9.%' OR etapa ILIKE '9 %')
            `,
            expiring: `
                SELECT contrato, cliente, termo, data_fim_efetividade, 
                EXTRACT(DAY FROM (data_fim_efetividade - NOW())) as days_left
                FROM contracts
                WHERE status ILIKE 'Ativo'
                AND data_fim_efetividade IS NOT NULL
                AND data_fim_efetividade <= NOW() + INTERVAL '90 days'
                ORDER BY data_fim_efetividade ASC
            `
        };

        const [totalsRes, aditamentosRes, assinaturasRes, expiringRes] = await Promise.all([
            client.query(queries.totals),
            client.query(queries.aditamentos),
            client.query(queries.assinaturas),
            client.query(queries.expiring)
        ]);

        const expiringContracts = expiringRes.rows.map(r => {
            const daysLeft = parseInt(r.days_left);
            let statusLabel = 'Monitoramento';
            let statusStyle = 'bg-slate-100 text-slate-700';
            if (daysLeft <= 0) {
                statusLabel = 'Vencido';
                statusStyle = 'bg-rose-600 text-white';
            } else if (daysLeft <= 30) {
                statusLabel = 'Urgente';
                statusStyle = 'bg-rose-500 text-white';
            } else if (daysLeft <= 60) {
                statusLabel = 'Atenção';
                statusStyle = 'bg-amber-500 text-white';
            }

            return {
                name: `${r.contrato} - ${r.cliente}`,
                daysLeft,
                statusLabel,
                statusStyle,
                term: r.termo
            };
        });

        res.json({
            totalContracts: parseInt(totalsRes.rows[0].total_count || 0),
            globalValue: parseFloat(totalsRes.rows[0].global_value || 0),
            aditamentosMonthCount: parseInt(aditamentosRes.rows[0].count || 0),
            aditamentosMonthValue: parseFloat(aditamentosRes.rows[0].total_value || 0),
            aguardandoAssinaturaCount: parseInt(assinaturasRes.rows[0].count || 0),
            aguardandoAssinaturaValue: parseFloat(assinaturasRes.rows[0].total_value || 0),
            expiringContracts
        });
    } catch (err) {
        console.error("Error fetching COCR metrics:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
