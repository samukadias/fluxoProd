require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');

// Database & Infrastructure
const db = require('./db');
const initDb = require('./migrations/init');
const seedUsers = require('./seeds/users');

// Middleware
const { authenticateToken, authorizeAction } = require('./middleware/auth');
const auditTrail = require('./middleware/audit');

// Helpers
const { createCrudRoutes } = require('./helpers/crud');

// Routes
const authRoutes = require('./routes/auth');
const demandRoutes = require('./routes/demands');
const reopeningRoutes = require('./routes/reopenings');
const { router: notificationRoutes, generateExpiringContractNotifications } = require('./routes/notifications');
const activityRoutes = require('./routes/activity');
const metricsRoutes = require('./routes/metrics');

// Services
const backupService = require('./services/backupService');

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

// CORS - Allow all origins for this internal network application
app.use(cors({
    origin: '*', // Allow all origins to connect
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: '10mb' }));

// Handle JSON parsing errors
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON in request body.' });
    }
    next(err);
});

// ========================================
// PUBLIC ROUTES (no auth required)
// ========================================
app.use('/auth', authRoutes);

app.post('/contracts/:id/generate-attestations', async (req, res) => {
    const contractId = req.params.id;
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Get the Contract details
        const contractRes = await client.query('SELECT * FROM finance_contracts WHERE id = $1', [contractId]);
        if (contractRes.rows.length === 0) {
            throw new Error('Contrato financeiro não encontrado');
        }

        const contract = contractRes.rows[0];

        // Get generic contract info which holds the dates and values
        // Note: The UI for finance passes the ID from `finance_contracts`. 
        // We must find the corresponding row in `contracts` using the common `pd_number`.
        // The main table might store this in `pd_number`.
        const pdNumber = contract.pd_number;
        console.log(`[Generate Schedule] Buscando contrato mestre com PD: ${pdNumber}`);
        const genericContractRes = await client.query('SELECT * FROM contracts WHERE pd_number = $1 OR contrato_cliente = $1', [pdNumber]);
        const contractDetails = genericContractRes.rows[0] || {};

        console.log(`[Generate Schedule] Contrato Mestre Encontrado? ${!!genericContractRes.rows[0]}. Data Inicio: ${contractDetails.data_inicio_efetividade}, Valor: ${contractDetails.valor_contrato}`);


        // Coalesce standard or legacy column names
        let cStartDate = contractDetails.start_date || contractDetails.data_inicio_efetividade;
        let cEndDate = contractDetails.end_date || contractDetails.data_fim_efetividade;
        let cTotalValue = contractDetails.total_value || contractDetails.valor_contrato || 0;

        // Fallback to deadline_contracts if the main contracts table doesn't have the dates
        if (!cStartDate || !cEndDate) {
            console.log(`[Generate Schedule] Datas não encontradas na contracts. Tentando na deadline_contracts...`);
            const legacyContractRes = await client.query('SELECT * FROM deadline_contracts WHERE contrato = $1', [pdNumber]);
            const legacyDetails = legacyContractRes.rows[0];

            if (legacyDetails) {
                console.log(`[Generate Schedule] Encontrado na deadline_contracts. Data Inicio: ${legacyDetails.data_inicio_efetividade}`);
                cStartDate = legacyDetails.data_inicio_efetividade;
                cEndDate = legacyDetails.data_fim_efetividade;
                cTotalValue = legacyDetails.valor_contrato || 0;
            }
        }

        if (!cStartDate || !cEndDate) {
            throw new Error('O contrato não possui data de início ou fim cadastradas na base geral de Contratos.');
        }

        const startDate = new Date(cStartDate);
        const endDate = new Date(cEndDate);
        let totalValue = parseFloat(cTotalValue) || 0;

        if (totalValue <= 0) {
            throw new Error('O contrato não possui um Valor de Contrato válido para divisão.');
        }

        // 2. Calculate the months
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();

        // Inclusive count (month 1 to month 12 is 12 elapsed changes + 1? Usually standard diff is fine just adding 1 to cover the edges if start/end in same month)
        // A standard approach for 'number of installments' is just the exact month diff + 1 depending on precise dates.
        const numInstallments = Math.max(1, months + 1);
        const installmentValue = (totalValue / numInstallments).toFixed(2);

        // 3. Insert draft attestations
        const inserted = [];
        for (let i = 0; i < numInstallments; i++) {
            // Calculate current month's reference
            const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            // Format to YYYY-MM
            const refMonth = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

            const insertQuery = `
                INSERT INTO monthly_attestations (
                    contract_id, client_name, pd_number, responsible_analyst, 
                    reference_month, billed_amount, paid_amount
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const values = [
                contractId,
                contract.client_name,
                contract.pd_number,
                contract.responsible_analyst,
                refMonth,
                installmentValue,
                0 // paid is 0 for future drafts
            ];

            const result = await client.query(insertQuery, values);
            inserted.push(result.rows[0]);
        }

        await client.query('COMMIT');
        res.status(200).json({
            message: `Cronograma gerado: ${numInstallments} parcelas de ${installmentValue}`,
            attestations: inserted
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[Generate Attestations Error]:', err.message);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// ========================================
// PROTECTED ROUTES (JWT required)
// ========================================
app.use(authenticateToken);
app.use(authorizeAction);

// Custom routes (must come BEFORE generic CRUD routes)
app.use('/demands', demandRoutes);

// Entity creation with user account sync
const handleEntityWithUserCreation = async (req, res, tableName, role) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const { name, email, password } = req.body;

        // Create specific entity
        const entityResult = await client.query(
            `INSERT INTO ${tableName} (name, email) VALUES($1, $2) RETURNING *`,
            [name, email]
        );

        // Create or update user
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0 && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                [name, email, hashedPassword, role]
            );
        } else if (userCheck.rows.length > 0 && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query(
                'UPDATE users SET password = $1, role = $2 WHERE email = $3',
                [hashedPassword, role, email]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(entityResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[ENTITY CREATION ERROR]:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

app.post('/analysts', (req, res) => handleEntityWithUserCreation(req, res, 'analysts', 'analyst'));
app.post('/requesters', (req, res) => handleEntityWithUserCreation(req, res, 'requesters', 'requester'));

// Notifications
app.use('/notifications', notificationRoutes);

// Activity Log
app.use('/activity-log', activityRoutes);

// Reopening reasons (gestor CRUD)
app.use('/', reopeningRoutes);

// Demand sub-routes: /:id/reopenings, /:id/reopen, /:id/redeliver
app.use('/demands', reopeningRoutes);

// ========================================
// CUSTOM ROUTES
// ========================================



// ========================================
// GENERIC CRUD ROUTES (with audit trail)
// ========================================
const crudEntities = [
    ['users', 'users'],
    ['demands', 'demands'],
    ['status_history', 'status_history'],
    ['stage_history', 'stage_history'],
    ['finance_contracts', 'finance_contracts'],
    ['contracts', 'contracts'],
    ['deadline_contracts', 'deadline_contracts'],
    ['clients', 'clients'],
    ['analysts', 'analysts'],
    ['cycles', 'cycles'],
    ['requesters', 'requesters'],
    ['holidays', 'holidays'],
    ['attestations', 'monthly_attestations'],
    ['termos_confirmacao', 'confirmation_terms'],
];

for (const [resource, table] of crudEntities) {
    // Apply audit trail to write operations
    app.post(`/${resource}`, auditTrail(resource));
    app.put(`/${resource}/:id`, auditTrail(resource));
    app.delete(`/${resource}/:id`, auditTrail(resource));

    createCrudRoutes(app, resource, table);
}

// ========================================
// SERVER START
// ========================================
const port = process.env.PORT || 3000;

const start = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await initDb();
            console.log("✅ Database initialized successfully");
            break;
        } catch (error) {
            console.error(`❌ Database connection failed: ${error.message}`);
            retries -= 1;
            if (retries === 0) {
                console.error("❌ Max retries reached. Exiting...");
                process.exit(1);
            }
            console.log(`⏳ Retrying in 5 seconds... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    try {
        await seedUsers();
    } catch (seedError) {
        console.error(`⚠️ Warning: Failed to seed users: ${seedError.message}`);
    }

    app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
    });

    // Daily cron: generate expiring contract notifications at 8am
    cron.schedule('0 8 * * *', async () => {
        console.log('[CRON] Generating expiring contract notifications...');
        await generateExpiringContractNotifications();
    });

    // Backup service: runs at 13:00, 18:00, 23:00 daily (local + network)
    backupService.init();
};

start();
