const express = require('express');
const db = require('../db');
const NodeCache = require('node-cache');

const router = express.Router();
// Create a cache with a 5-minute standard TTL (Time To Live)
const metricsCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * GET /metrics/cdpc
 * High-performance aggregation for CDPC Dashboard
 * Supports Query Params: month, year, cycle_ids, artifact
 */
router.get('/cdpc', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    // Generate a unique cache key based on the query parameters so different filters don't mix
    const cacheKey = `cdpc_${JSON.stringify(req.query)}`;
    const cachedData = metricsCache.get(cacheKey);

    if (cachedData) {
        console.log(`[CACHE HIT] Delivering CDPC metrics for key: ${cacheKey}`);
        return res.json(cachedData);
    }

    const client = await db.connect();
    try {
        const { month, year, cycle_ids, artifact } = req.query;

        const isAllYears = year === 'all';
        // Validate and parse year/month to prevent SQL injection via interpolation
        const rawYear = (year && !isAllYears) ? parseInt(year, 10) : new Date().getFullYear();
        const rawMonth = month ? parseInt(month, 10) : null;

        if (year && !isAllYears && (isNaN(rawYear) || rawYear < 2000 || rawYear > 2100)) {
            return res.status(400).json({ error: 'Invalid year parameter.' });
        }
        if (rawMonth !== null && (isNaN(rawMonth) || rawMonth < 1 || rawMonth > 12)) {
            return res.status(400).json({ error: 'Invalid month parameter. Must be between 1 and 12.' });
        }

        const currentYear = rawYear;
        const currentMonth = rawMonth;

        // Base WHERE clause for parameterized filtering on general queries
        let baseWhere = '1=1';
        let values = [];
        let paramsCount = 1;

        if (cycle_ids) {
            // Parses '1,2,3' string into [1, 2, 3] array
            const idArray = cycle_ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            if (idArray.length > 0) {
                baseWhere += ` AND cycle_id = ANY($${paramsCount}::int[])`;
                values.push(idArray);
                paramsCount++;
            }
        }
        if (artifact) {
            // artifact can be OO, Kit, etc.
            baseWhere += ` AND artifact ILIKE $${paramsCount}`;
            values.push(`%${artifact}%`);
            paramsCount++;
        }

        // Handle optional month filtering
        const expectedDateFilter = isAllYears
            ? (currentMonth ? `EXTRACT(MONTH FROM COALESCE(qualification_date, created_date)) = ${currentMonth}` : '1=1')
            : (currentMonth
                ? `EXTRACT(YEAR FROM COALESCE(qualification_date, created_date)) = ${currentYear} AND EXTRACT(MONTH FROM COALESCE(qualification_date, created_date)) = ${currentMonth}`
                : `EXTRACT(YEAR FROM COALESCE(qualification_date, created_date)) = ${currentYear}`);

        const deliveryDateFilter = isAllYears
            ? (currentMonth ? `EXTRACT(MONTH FROM delivery_date) = ${currentMonth}` : '1=1')
            : (currentMonth
                ? `EXTRACT(YEAR FROM delivery_date) = ${currentYear} AND EXTRACT(MONTH FROM delivery_date) = ${currentMonth}`
                : `EXTRACT(YEAR FROM delivery_date) = ${currentYear}`);

        const getCancelledDateFilter = (alias = '') => {
            const prefix = alias ? `${alias}.` : 'demands.';
            const cancelDateExpr = `COALESCE((SELECT MAX(changed_at) FROM status_history sh WHERE sh.demand_id = ${prefix}id AND sh.to_status = 'CANCELADA'), ${prefix}delivery_date, ${prefix}created_date)`;
            if (isAllYears) {
                return currentMonth
                    ? `EXTRACT(MONTH FROM ${cancelDateExpr}) = ${currentMonth}`
                    : '1=1';
            }
            return currentMonth
                ? `EXTRACT(YEAR FROM ${cancelDateExpr}) = ${currentYear} AND EXTRACT(MONTH FROM ${cancelDateExpr}) = ${currentMonth}`
                : `EXTRACT(YEAR FROM ${cancelDateExpr}) = ${currentYear}`;
        };

        const getCancelledYearFilter = (alias = '') => {
            if (isAllYears) return '1=1';
            const prefix = alias ? `${alias}.` : 'demands.';
            const cancelDateExpr = `COALESCE((SELECT MAX(changed_at) FROM status_history sh WHERE sh.demand_id = ${prefix}id AND sh.to_status = 'CANCELADA'), ${prefix}delivery_date, ${prefix}created_date)`;
            return `EXTRACT(YEAR FROM ${cancelDateExpr}) = ${currentYear}`;
        };

        const queries = {
            // Existing ones + Em Tratativa
            backlogCount: `SELECT COUNT(*) FROM demands WHERE status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL') AND ${baseWhere}`,
            emTratativa: `SELECT COUNT(*) FROM demands WHERE status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA', 'PENDENTE TRIAGEM', 'TRIAGEM NÃO ELEGÍVEL') AND ${baseWhere}`,

            // Monthly/Period Input
            entriesThisMonth: `SELECT COUNT(*) FROM demands WHERE ${expectedDateFilter} AND ${baseWhere}`,

            // Yearly Input
            entriesThisYear: isAllYears 
                ? `SELECT COUNT(*) FROM demands WHERE 1=1 AND ${baseWhere}`
                : `SELECT COUNT(*) FROM demands WHERE EXTRACT(YEAR FROM COALESCE(qualification_date, created_date)) = ${currentYear} AND ${baseWhere}`,

            // Reopenings in Month/Period
            reopenedThisMonth: `
                SELECT COUNT(*) FROM demand_reopenings dr 
                JOIN demands d ON dr.demand_id = d.id 
                WHERE (${isAllYears
                    ? (currentMonth ? `EXTRACT(MONTH FROM dr.reopened_at) = ${currentMonth}` : '1=1')
                    : (currentMonth 
                        ? `EXTRACT(YEAR FROM dr.reopened_at) = ${currentYear} AND EXTRACT(MONTH FROM dr.reopened_at) = ${currentMonth}`
                        : `EXTRACT(YEAR FROM dr.reopened_at) = ${currentYear}`)})
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
            `,

            // Reopenings in Year
            reopenedThisYear: `
                SELECT COUNT(*) FROM demand_reopenings dr 
                JOIN demands d ON dr.demand_id = d.id 
                WHERE ${isAllYears ? '1=1' : `EXTRACT(YEAR FROM dr.reopened_at) = ${currentYear}`}
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
            `,

            // Monthly/Period Delivery (Qty, Value, SLA)
            deliveredThisMonth: `
                SELECT 
                    COUNT(*) as count, 
                    SUM(value::numeric) as total_value,
                    AVG(
                        EXTRACT(EPOCH FROM (COALESCE(delivery_date, NOW()) - COALESCE(qualification_date, created_date))) / 86400.0 - (COALESCE(frozen_time_minutes, 0) / 1440.0)
                    ) as avg_sla_days
                FROM demands 
                WHERE status = 'ENTREGUE' 
                AND ${deliveryDateFilter}
                AND ${baseWhere}
            `,

            // prioritizations on the specific month/period
            prioritizedThisMonth: `
                SELECT 
                    COUNT(*) as count
                FROM demands d
                WHERE status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL') 
                AND weight IN (0, 1)
                AND ${expectedDateFilter.replace(/qualification_date/g, 'd.qualification_date').replace(/created_date/g, 'd.created_date')}
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
            `,

            // Top Prioritized Clients in the month/period
            topPrioritizedClientsThisMonth: `
                SELECT c.name, COUNT(d.id) as count
                FROM demands d
                JOIN clients c ON d.client_id = c.id
                WHERE d.status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL') 
                AND d.weight IN (0, 1)
                AND ${expectedDateFilter.replace(/qualification_date/g, 'd.qualification_date').replace(/created_date/g, 'd.created_date')}
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
                GROUP BY c.id, c.name
                ORDER BY count DESC
            `,

            // Cancellations in the period
            cancelledThisMonth: `SELECT COUNT(*) FROM demands WHERE status = 'CANCELADA' AND ${getCancelledDateFilter()} AND ${baseWhere}`,
            cancelledThisYear: `SELECT COUNT(*) FROM demands WHERE status = 'CANCELADA' AND ${getCancelledYearFilter()} AND ${baseWhere}`,

            // Yearly Delivery Total (Qty, Value, SLA)
            deliveredThisYear: `
                SELECT 
                    COUNT(*) as count,
                    SUM(value::numeric) as total_value,
                    AVG(
                        EXTRACT(EPOCH FROM (COALESCE(delivery_date, NOW()) - COALESCE(qualification_date, created_date))) / 86400.0 - (COALESCE(frozen_time_minutes, 0) / 1440.0)
                    ) as avg_sla_days,
                    COUNT(NULLIF(value::numeric, 0)) as valued_count
                FROM demands 
                WHERE status = 'ENTREGUE' 
                AND ${isAllYears ? '1=1' : `EXTRACT(YEAR FROM delivery_date) = ${currentYear}`}
                AND ${baseWhere}
            `,

            // Kept for backward compat with top clients view
            topClients: `
                SELECT c.name, COUNT(d.id) as count
                FROM demands d
                JOIN clients c ON d.client_id = c.id
                WHERE d.status NOT IN ('ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL')
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
                GROUP BY c.id, c.name
                ORDER BY count DESC
                LIMIT 5
            `,

            currentlyReopened: `
                SELECT DISTINCT d.id, d.product, d.client_id, d.delivery_date, d.status, c.name as client_name,
                       dr.reopened_at, dr.reason_label
                FROM demands d 
                JOIN demand_reopenings dr ON dr.demand_id = d.id AND dr.redelivered_at IS NULL
                LEFT JOIN clients c ON d.client_id = c.id
                WHERE ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
            `,
            cancelledByExecutive: `
                SELECT u.id, COALESCE(u.name, 'Não Informado') as name, COUNT(d.id) as count
                FROM demands d
                LEFT JOIN users u ON d.requester_id = u.id
                WHERE d.status = 'CANCELADA'
                AND ${getCancelledDateFilter('d')}
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
                GROUP BY u.id, u.name
                ORDER BY count DESC
                LIMIT 10
            `,
            reopeningsByReason: `
                SELECT dr.reason_label as name, COUNT(dr.id) as count
                FROM demand_reopenings dr
                JOIN demands d ON dr.demand_id = d.id
                WHERE (${isAllYears
                    ? (currentMonth ? `EXTRACT(MONTH FROM dr.reopened_at) = ${currentMonth}` : '1=1')
                    : (currentMonth 
                        ? `EXTRACT(YEAR FROM dr.reopened_at) = ${currentYear} AND EXTRACT(MONTH FROM dr.reopened_at) = ${currentMonth}`
                        : `EXTRACT(YEAR FROM dr.reopened_at) = ${currentYear}`)})
                AND ${baseWhere.replace(/cycle_id/g, 'd.cycle_id').replace(/artifact/g, 'd.artifact')}
                GROUP BY dr.reason_label
                ORDER BY count DESC
            `
        };

        const [
            backlogRes, emTratativaRes, entriesMonthRes, entriesYearRes,
            reopenedMonthRes, reopenedYearRes,
            deliveredMonthRes, prioritizedMonthRes, topPrioritizedClientsRes,
            cancelledMonthRes, cancelledYearRes, deliveredYearRes, topClientsRes, 
            reopenedRes, cancelledByExecutiveRes, reopeningsByReasonRes
        ] = await Promise.all([
            client.query(queries.backlogCount, values),
            client.query(queries.emTratativa, values),
            client.query(queries.entriesThisMonth, values),
            client.query(queries.entriesThisYear, values),
            client.query(queries.reopenedThisMonth, values),
            client.query(queries.reopenedThisYear, values),
            client.query(queries.deliveredThisMonth, values),
            client.query(queries.prioritizedThisMonth, values),
            client.query(queries.topPrioritizedClientsThisMonth, values),
            client.query(queries.cancelledThisMonth, values),
            client.query(queries.cancelledThisYear, values),
            client.query(queries.deliveredThisYear, values),
            client.query(queries.topClients, values),
            client.query(queries.currentlyReopened, values),
            client.query(queries.cancelledByExecutive, values),
            client.query(queries.reopeningsByReason, values)
        ]);

        const responsePayload = {
            // Core
            backlog: parseInt(backlogRes.rows[0].count),
            emTratativa: parseInt(emTratativaRes.rows[0].count),

            // Entries
            entriesThisMonth: parseInt(entriesMonthRes.rows[0].count),
            entriesThisYear: parseInt(entriesYearRes.rows[0].count),

            // Reopenings
            reopenedThisMonth: parseInt(reopenedMonthRes.rows[0].count),
            reopenedThisYear: parseInt(reopenedYearRes.rows[0].count),

            // Deliveries in Month
            deliveredThisMonth: parseInt(deliveredMonthRes.rows[0].count),
            valueThisMonth: parseFloat(deliveredMonthRes.rows[0].total_value || 0),
            slaThisMonth: parseFloat(deliveredMonthRes.rows[0].avg_sla_days || 0),

            // Deliveries in Year
            deliveredThisYear: parseInt(deliveredYearRes.rows[0].count),
            valueThisYear: parseFloat(deliveredYearRes.rows[0].total_value || 0),
            slaThisYear: parseFloat(deliveredYearRes.rows[0].avg_sla_days || 0),
            valuedDemandsCount: parseInt(deliveredYearRes.rows[0].valued_count || 0),

            // Priority
            highPriorityThisMonth: parseInt(prioritizedMonthRes.rows[0].count),
            topPrioritizedClientsThisMonth: topPrioritizedClientsRes.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),

            // Cancellation
            cancelledThisMonth: parseInt(cancelledMonthRes.rows[0].count),
            cancelledThisYear: parseInt(cancelledYearRes.rows[0].count),

            // Base UI blocks
            topClients: topClientsRes.rows.map(r => ({ name: r.name, count: parseInt(r.count) })),
            currentlyReopened: reopenedRes.rows,
            cancelledByExecutive: cancelledByExecutiveRes.rows.map(r => ({ id: r.id, name: r.name, count: parseInt(r.count) })),
            reopeningsByReason: reopeningsByReasonRes.rows.map(r => ({ name: r.name, count: parseInt(r.count) }))
        };

        // Salvar no cache
        metricsCache.set(cacheKey, responsePayload);

        res.json(responsePayload);
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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const cacheKey = `cocr_${JSON.stringify(req.query)}`;
    const cachedData = metricsCache.get(cacheKey);

    if (cachedData) {
        console.log(`[CACHE HIT] Delivering COCR metrics for key: ${cacheKey}`);
        return res.json(cachedData);
    }

    // Note: the time filters on COCR only filter the volumes (aditamentos e contratos renovados no mês).
    // The total pipeline/caixa values are global totals independent of the month filter unless specified by exact requirement.
    const client = await db.connect();
    try {
        const { month, year } = req.query;

        const rawYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const rawMonth = month ? parseInt(month, 10) : null;

        const currentYear = rawYear;
        const currentMonth = rawMonth;

        // Mês atual é usado para aditamentos e relatórios de métrica. Usa created_at como proxy para data de referência se houver
        // Como o contrato tem status Ativo, as medições de volume no período geralmente não dependem fortemente da aba a nao ser por renovação
        const dateFilterAditamento = currentMonth
            ? `AND EXTRACT(YEAR FROM created_at) = ${currentYear} AND EXTRACT(MONTH FROM created_at) = ${currentMonth}`
            : `AND EXTRACT(YEAR FROM created_at) = ${currentYear}`;

        const dateFilterAssinatura = currentMonth
            ? `AND EXTRACT(YEAR FROM created_at) = ${currentYear} AND EXTRACT(MONTH FROM created_at) = ${currentMonth}`
            : `AND EXTRACT(YEAR FROM created_at) = ${currentYear}`;

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
                ${dateFilterAditamento}
            `,
            assinaturas: `
                SELECT COUNT(*) as count, SUM(valor_contrato) as total_value 
                FROM contracts 
                WHERE status ILIKE 'Ativo' 
                AND (etapa ILIKE '9.%' OR etapa ILIKE '9 %' OR etapa ILIKE '%assinatura%')
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

        const responsePayload = {
            totalContracts: parseInt(totalsRes.rows[0].total_count || 0),
            globalValue: parseFloat(totalsRes.rows[0].global_value || 0),
            aditamentosMonthCount: parseInt(aditamentosRes.rows[0].count || 0),
            aditamentosMonthValue: parseFloat(aditamentosRes.rows[0].total_value || 0),
            aguardandoAssinaturaCount: parseInt(assinaturasRes.rows[0].count || 0),
            aguardandoAssinaturaValue: parseFloat(assinaturasRes.rows[0].total_value || 0),
            expiringContracts
        };

        // Salvar no cache
        metricsCache.set(cacheKey, responsePayload);

        res.json(responsePayload);
    } catch (err) {
        console.error("Error fetching COCR metrics:", err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});


/**
 * GET /metrics/weekly
 * Weekly tracking metrics for CDPC — compares current week vs previous week.
 * Week boundary: Monday 00:00 → Sunday 23:59 (America/Sao_Paulo, stored as UTC in DB).
 * Supports optional ?analyst_id= filter.
 */
router.get('/weekly', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const { analyst_id } = req.query;
    const cacheKey = `weekly_${analyst_id || 'all'}`;
    const cached = metricsCache.get(cacheKey);
    if (cached) return res.json(cached);

    const client = await db.connect();
    try {
        // ── Week boundaries (ISO Mon-Sun, stored UTC in DB) ──────────────────
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun … 6=Sat
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const thisMonday = new Date(now);
        thisMonday.setDate(now.getDate() + diffToMonday);
        thisMonday.setHours(0, 0, 0, 0);

        const thisSunday = new Date(thisMonday);
        thisSunday.setDate(thisMonday.getDate() + 6);
        thisSunday.setHours(23, 59, 59, 999);

        const lastMonday = new Date(thisMonday);
        lastMonday.setDate(thisMonday.getDate() - 7);
        const lastSunday = new Date(thisMonday);
        lastSunday.setDate(thisMonday.getDate() - 1);
        lastSunday.setHours(23, 59, 59, 999);

        const analystFilter = analyst_id ? `AND analyst_id = '${analyst_id}'` : '';

        // ── Active demand sets per week ──────────────────────────────────────
        // A demand is "active" in a given week if it was NOT in a closed status
        // at the END of that week. We reconstruct this from status_history.
        // For simplicity: demand counts are from current snapshot (this week)
        // and we reconstruct last week's active set from status_history.

        const CLOSED_STATUSES = "('ENTREGUE','CANCELADA','CONGELADA','TRIAGEM NÃO ELEGÍVEL')";

        // Current active demands
        const activeNowRes = await client.query(`
            SELECT id, weight, stage, status FROM demands
            WHERE status NOT IN ${CLOSED_STATUSES} ${analystFilter}
        `);

        // Last week active: demands where last known status before lastSunday was NOT closed
        // We join with status_history to find status at end of last week
        const lastWeekActiveRes = await client.query(`
            WITH last_status_before_sunday AS (
                SELECT DISTINCT ON (sh.demand_id) 
                    sh.demand_id, sh.to_status
                FROM status_history sh
                JOIN demands d ON d.id = sh.demand_id
                WHERE sh.changed_at <= $1
                ${analyst_id ? `AND d.analyst_id = '${analyst_id}'` : ''}
                ORDER BY sh.demand_id, sh.changed_at DESC
            )
            SELECT ls.demand_id, ls.to_status,
                   d.weight, d.stage
            FROM last_status_before_sunday ls
            JOIN demands d ON d.id = ls.demand_id
            WHERE ls.to_status NOT IN ${CLOSED_STATUSES}
        `, [lastSunday]);

        // Demands with NO status history yet (created before any history) — include them as active last week if active now
        // (conservative: count current active demands that have no history entries before lastSunday)

        const activeNow = activeNowRes.rows;
        const activeLastWeek = lastWeekActiveRes.rows;

        // ── Stage reconstruction for last week ───────────────────────────────
        // For demands active last week, find which stage they were in at lastSunday
        // Using stage_history: the entry where entered_at <= lastSunday AND (exited_at > lastSunday OR exited_at IS NULL)
        const stageLastWeekRes = await client.query(`
            SELECT sh.demand_id, sh.stage
            FROM stage_history sh
            JOIN demands d ON d.id = sh.demand_id
            WHERE sh.entered_at <= $1
              AND (sh.exited_at > $1 OR sh.exited_at IS NULL)
              ${analyst_id ? `AND d.analyst_id = '${analyst_id}'` : ''}
        `, [lastSunday]);

        const stageLastWeekMap = {};
        stageLastWeekRes.rows.forEach(r => { stageLastWeekMap[r.demand_id] = r.stage; });

        // ── Stage evolution this week ─────────────────────────────────────────
        const stageEvolutionRes = await client.query(`
            SELECT sh.demand_id,
                   FIRST_VALUE(sh.stage) OVER (PARTITION BY sh.demand_id ORDER BY sh.entered_at ASC) AS first_stage,
                   LAST_VALUE(sh.stage)  OVER (PARTITION BY sh.demand_id ORDER BY sh.entered_at ASC
                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_stage
            FROM stage_history sh
            JOIN demands d ON d.id = sh.demand_id
            WHERE sh.entered_at BETWEEN $1 AND $2
            ${analyst_id ? `AND d.analyst_id = '${analyst_id}'` : ''}
        `, [thisMonday, thisSunday]);

        const STAGE_ORDER = ['Triagem', 'Qualificação', 'PO', 'OO', 'RT', 'ESP'];
        const stageIdx = s => STAGE_ORDER.indexOf(s);

        const evolutionSet = new Set();
        const regressionSet = new Set();
        const seenEvolution = new Set();

        stageEvolutionRes.rows.forEach(r => {
            if (seenEvolution.has(r.demand_id)) return;
            seenEvolution.add(r.demand_id);
            const diff = stageIdx(r.last_stage) - stageIdx(r.first_stage);
            if (diff > 0) evolutionSet.add(r.demand_id);
            if (diff < 0) regressionSet.add(r.demand_id);
        });

        // Active demands with NO stage movement this week
        const activeIds = new Set(activeNow.map(d => d.id));
        const movedIds = new Set([...evolutionSet, ...regressionSet]);
        const noEvolutionCount = [...activeIds].filter(id => !movedIds.has(id)).length;

        // ── Status history events this week ──────────────────────────────────
        const weekEventsRes = await client.query(`
            SELECT sh.demand_id, sh.from_status, sh.to_status, sh.changed_at
            FROM status_history sh
            JOIN demands d ON d.id = sh.demand_id
            WHERE sh.changed_at BETWEEN $1 AND $2
            ${analyst_id ? `AND d.analyst_id = '${analyst_id}'` : ''}
        `, [thisMonday, thisSunday]);

        const entranceIds = new Set();
        const reaberturaIds = new Set();
        const cancelamentoIds = new Set();
        const entregueIds = new Set();

        weekEventsRes.rows.forEach(r => {
            // Entradas: became active from a null/closed state or first assignment
            if (!r.from_status && r.to_status && !['ENTREGUE','CANCELADA','CONGELADA','TRIAGEM NÃO ELEGÍVEL'].includes(r.to_status)) {
                entranceIds.add(r.demand_id);
            }
            // Reaberturas: from ENTREGUE back to active
            if (r.from_status === 'ENTREGUE' && !['ENTREGUE','CANCELADA'].includes(r.to_status)) {
                reaberturaIds.add(r.demand_id);
            }
            if (r.to_status === 'CANCELADA') cancelamentoIds.add(r.demand_id);
            if (r.to_status === 'ENTREGUE') entregueIds.add(r.demand_id);
        });

        // Also count demands created this week (no prior status history = brand new)
        const newDemandsRes = await client.query(`
            SELECT id FROM demands
            WHERE created_date BETWEEN $1 AND $2
            ${analyst_id ? `AND analyst_id = '${analyst_id}'` : ''}
        `, [thisMonday, thisSunday]);
        newDemandsRes.rows.forEach(r => entranceIds.add(r.id));

        // ── Priority counts ───────────────────────────────────────────────────
        const countByWeight = (rows) => {
            const result = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
            rows.forEach(r => {
                const w = r.weight ?? 4;
                if (result[w] !== undefined) result[w]++;
            });
            return result;
        };

        const countByStage = (rows, stageMap = null) => {
            const result = {};
            STAGE_ORDER.forEach(s => result[s] = 0);
            rows.forEach(r => {
                const stage = stageMap ? stageMap[r.demand_id] : r.stage;
                if (stage && result[stage] !== undefined) result[stage]++;
            });
            return result;
        };

        const response = {
            weeks: {
                current: {
                    label: `${thisMonday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
                    total: activeNow.length,
                    byPriority: countByWeight(activeNow),
                    byStage: countByStage(activeNow),
                    entradas: entranceIds.size,
                    reaberturas: reaberturaIds.size,
                    cancelamentos: cancelamentoIds.size,
                    entregues: entregueIds.size,
                    comEvolucao: evolutionSet.size,
                    semEvolucao: noEvolutionCount,
                    comRegressao: regressionSet.size,
                },
                previous: {
                    label: `${lastMonday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
                    total: activeLastWeek.length,
                    byPriority: countByWeight(activeLastWeek),
                    byStage: countByStage(activeLastWeek, stageLastWeekMap),
                    entradas: null,
                    reaberturas: null,
                    cancelamentos: null,
                    entregues: null,
                    comEvolucao: null,
                    semEvolucao: null,
                    comRegressao: null,
                }
            }
        };

        metricsCache.set(cacheKey, response, 300);
        res.json(response);
    } catch (err) {
        console.error('[metrics/weekly] Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

module.exports = router;

