require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

// ========================================
// PERSISTENT LOGGER
// ========================================
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');
const MAX_LOG_BYTES = 5 * 1024 * 1024; // 5 MB — rotate when exceeded

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function writeLog(level, message) {
    const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    // Console mirror
    if (level === 'ERROR') process.stderr.write(line);
    else process.stdout.write(line);
    // File write (rotate if needed)
    try {
        if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_BYTES) {
            fs.renameSync(LOG_FILE, LOG_FILE + '.old');
        }
        fs.appendFileSync(LOG_FILE, line);
    } catch (_) { /* never crash because of logging */ }
}

// ========================================
// GLOBAL ERROR HANDLERS (prevent silent crashes)
// ========================================
process.on('uncaughtException', (err) => {
    writeLog('ERROR', `uncaughtException: ${err.stack || err.message}`);
    process.exit(1); // exit so the OS / PM2 can restart
});

process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? reason.stack : String(reason);
    writeLog('ERROR', `unhandledRejection: ${msg}`);
    // Do NOT exit — unhandled promise rejections are usually recoverable
});

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
const bottleneckRoutes = require('./routes/bottlenecks');
const { router: notificationRoutes, generateExpiringContractNotifications } = require('./routes/notifications');
const activityRoutes = require('./routes/activity');
const metricsRoutes = require('./routes/metrics');
const adminRoutes = require('./routes/admin');


// Services
const backupService = require('./services/backupService');

const compression = require('compression');
const backendPort = process.env.PORT || 5002;
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

const app = express();
app.set('trust proxy', 1);

// ========================================
// SENTRY INITIALIZATION
// ========================================
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
    console.log('[Sentry] Initialized automatically.');
}

// ========================================
// MIDDLEWARE
// ========================================

// Sentry request handler must be the first middleware on the app
if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}

// Add compression immediately to compress all subsequent responses
app.use(compression());

// CORS - Restrict to configured origin or LAN subnets (internal network application)
const allowedOriginEnv = process.env.ALLOWED_ORIGIN; // Ex: "http://10.2.9.91" in .env
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server and same-host requests (no origin header)
        if (!origin) return callback(null, true);
        // Allow if explicitly configured
        if (allowedOriginEnv && origin.startsWith(allowedOriginEnv)) return callback(null, true);
        // Allow any LAN subnet (192.168.x.x, 10.x.x.x, 172.16-31.x.x, localhost)
        const isLan = /^https?:\/\/(localhost|127\.0\.0\.1|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(origin);
        if (isLan) return callback(null, true);
        writeLog('WARN', `CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
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

// Rate Limiting: prevent brute-force attacks on the login endpoint
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 failed attempts per IP per window (reduced from 20)
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    skipSuccessfulRequests: true, // Only count failed attempts
});

app.use('/auth', loginLimiter, authRoutes);

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

        if (totalValue < 0) {
            throw new Error('O valor do contrato não pode ser negativo.');
        }

        // 2. Calculate the months
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();

        // Inclusive count (month 1 to month 12 is 12 elapsed changes + 1? Usually standard diff is fine just adding 1 to cover the edges if start/end in same month)
        // A standard approach for 'number of installments' is just the exact month diff + 1 depending on precise dates.
        const numInstallments = Math.max(1, months + 1);
        const installmentValue = (totalValue / numInstallments).toFixed(2);

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
                0, // billed_amount sempre começa em zero — preenchido manualmente ao faturar
                0  // paid_amount sempre zero para parcelas futuras
            ];

            const result = await client.query(insertQuery, values);
            inserted.push(result.rows[0]);
        }

        await client.query('COMMIT');
        res.status(200).json({
            message: `Cronograma gerado: ${numInstallments} parcelas criadas`,
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
app.use('/admin', adminRoutes);

// ========================================
// CVAC BASE SPREADSHEET IMPORT (authenticated)
// ========================================
app.post('/finance_contracts/import-base-cvac', async (req, res) => {
    const client = await db.connect();
    try {
        const rows = Array.isArray(req.body) ? req.body : [];
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Nenhuma linha recebida para importar.' });
        }

        await client.query('BEGIN');

        let created_contracts = 0;
        let reused_contracts = 0;
        let created_attestations = 0;
        let merged_attestations = 0;
        const errors = [];

        // Cache de contratos já resolvidos nesta importação (pd_number → contract_id)
        const contractCache = {};

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const lineNum = i + 1;

            try {
                const pd_number = row.pd_number?.toString().trim();
                const client_name = row.client_name?.toString().trim() || '';
                const responsible_analyst = row.responsible_analyst?.toString().trim() || '';
                const reference_month = row.reference_month?.toString().trim();
                const esp_number = row.esp_number?.toString().trim() || '';

                if (!pd_number) {
                    errors.push(`Linha ${lineNum}: Número do contrato (coluna C) está vazio — ignorada.`);
                    continue;
                }

                if (!reference_month) {
                    errors.push(`Linha ${lineNum}: Mês de referência (coluna AA) está vazio — ignorada.`);
                    continue;
                }

                // ── 1. Buscar contrato no cache ou no banco ──────────────────
                let contract_id = contractCache[pd_number];

                if (!contract_id) {
                    const contractRes = await client.query(
                        'SELECT id FROM finance_contracts WHERE pd_number = $1 LIMIT 1',
                        [pd_number]
                    );

                    if (contractRes.rows.length > 0) {
                        contract_id = contractRes.rows[0].id;
                        reused_contracts++;
                    } else {
                        // Criar novo contrato
                        const insertContract = await client.query(
                            `INSERT INTO finance_contracts (client_name, pd_number, responsible_analyst)
                             VALUES ($1, $2, $3) RETURNING id`,
                            [client_name, pd_number, responsible_analyst]
                        );
                        contract_id = insertContract.rows[0].id;
                        created_contracts++;
                    }

                    contractCache[pd_number] = contract_id;
                }

                // ── 2. Preparar valores processados ──────────────────────────
                const parseNum = (v) => {
                    if (v === null || v === undefined || v === '') return null;
                    if (typeof v === 'number') return isNaN(v) ? null : v;
                    const cleaned = String(v).replace(/[^\d.,-]/g, '').replace(',', '.');
                    const parsed = parseFloat(cleaned);
                    return isNaN(parsed) ? null : parsed;
                };

                const parseDate = (v) => {
                    if (!v) return null;
                    if (typeof v === 'number') {
                        const d = new Date(Math.round((v - 25569) * 86400 * 1000));
                        return d.toISOString().split('T')[0];
                    }
                    const s = String(v).trim();
                    if (!s) return null;
                    const dmyMatch = s.match(/^(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})$/);
                    if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
                    const d = new Date(s);
                    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
                };

                const val_sei_send_area = row.sei_send_area ? String(row.sei_send_area).trim() : null;
                const val_sei_process_number = row.sei_process_number ? String(row.sei_process_number).trim() : null;
                const val_measurement_value = parseNum(row.measurement_value);
                const val_report_send_date = parseDate(row.report_send_date);
                const val_attestation_return_date = parseDate(row.attestation_return_date);
                const val_invoice_send_to_client_date = parseDate(row.invoice_send_to_client_date);
                const val_nfe_sharepoint_date = parseDate(row.nfe_sharepoint_date);
                const val_invoice_number = row.invoice_number ? String(row.invoice_number).trim() : null;
                const val_nfe_issue_date = parseDate(row.nfe_issue_date);
                const val_billed_amount = parseNum(row.billed_amount);
                const val_invoice_send_date = parseDate(row.invoice_send_date);
                const val_observations = row.observations ? String(row.observations).trim() : null;

                // ── 3. Verificar duplicata e Mesclar ou Inserir ──────────────
                const dupCheck = await client.query(
                    `SELECT id FROM monthly_attestations
                     WHERE contract_id = $1 AND esp_number = $2 AND reference_month = $3
                     LIMIT 1`,
                    [contract_id, esp_number, reference_month]
                );

                if (dupCheck.rows.length > 0) {
                    // Update existente (Mesclar), respeitando o que já tem no banco (COALESCE com o novo valor priorizado)
                    // Mas se o valor da planilha for null, tentamos preservar o banco.
                    // Para isso, faremos COALESCE($X, campo) onde $X é o valor da planilha. Se $X for null, mantemos.
                    const existing_id = dupCheck.rows[0].id;
                    await client.query(
                        `UPDATE monthly_attestations SET
                            sei_send_area = COALESCE($1, sei_send_area),
                            sei_process_number = COALESCE($2, sei_process_number),
                            measurement_value = COALESCE($3, measurement_value),
                            report_send_date = COALESCE($4, report_send_date),
                            attestation_return_date = COALESCE($5, attestation_return_date),
                            invoice_send_to_client_date = COALESCE($6, invoice_send_to_client_date),
                            nfe_sharepoint_date = COALESCE($7, nfe_sharepoint_date),
                            invoice_number = COALESCE($8, invoice_number),
                            nfe_issue_date = COALESCE($9, nfe_issue_date),
                            billed_amount = COALESCE($10, billed_amount),
                            paid_amount = COALESCE($11, paid_amount),
                            invoice_send_date = COALESCE($12, invoice_send_date),
                            observations = COALESCE($13, observations),
                            client_name = COALESCE($14, client_name),
                            responsible_analyst = COALESCE($15, responsible_analyst),
                            updated_at = CURRENT_TIMESTAMP
                         WHERE id = $16`,
                        [
                            val_sei_send_area, val_sei_process_number, val_measurement_value,
                            val_report_send_date, val_attestation_return_date, val_invoice_send_to_client_date,
                            val_nfe_sharepoint_date, val_invoice_number, val_nfe_issue_date,
                            val_billed_amount, val_billed_amount, val_invoice_send_date,
                            val_observations, 
                            client_name || null, responsible_analyst || null,
                            existing_id
                        ]
                    );
                    merged_attestations++;
                } else {
                    // Inserir nova atestação
                    await client.query(
                        `INSERT INTO monthly_attestations (
                            contract_id, client_name, pd_number, responsible_analyst,
                            esp_number, reference_month,
                            sei_send_area, sei_process_number,
                            measurement_value,
                            report_send_date, attestation_return_date, invoice_send_to_client_date,
                            nfe_sharepoint_date, invoice_number, nfe_issue_date,
                            billed_amount, paid_amount,
                            invoice_send_date, observations
                        ) VALUES (
                            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
                        )`,
                        [
                            contract_id,
                            client_name         || null,
                            pd_number           || null,
                            responsible_analyst || null,
                            esp_number          || null,
                            reference_month,
                            val_sei_send_area,
                            val_sei_process_number,
                            val_measurement_value,
                            val_report_send_date,
                            val_attestation_return_date,
                            val_invoice_send_to_client_date,
                            val_nfe_sharepoint_date,
                            val_invoice_number,
                            val_nfe_issue_date,
                            val_billed_amount,
                            val_billed_amount,
                            val_invoice_send_date,
                            val_observations,
                        ]
                    );
                    created_attestations++;
                }

            } catch (rowErr) {
                errors.push(`Linha ${lineNum}: ${rowErr.message}`);
            }
        }

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Importação concluída',
            created_contracts,
            reused_contracts,
            created_attestations,
            merged_attestations,
            errors,
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('[Import BASE CVAC Error]:', err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});


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

// Bottleneck options (gestor CRUD)
app.use('/', bottleneckRoutes);

// Metrics
app.use('/metrics', metricsRoutes);

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
    ['demand_services', 'demand_services'],
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
            writeLog('INFO', 'Database initialized successfully');
            break;
        } catch (error) {
            writeLog('ERROR', `Database connection failed: ${error.message}`);
            retries -= 1;
            if (retries === 0) {
                writeLog('ERROR', 'Max retries reached. Exiting...');
                process.exit(1);
            }
            writeLog('WARN', `Retrying in 5 seconds... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    try {
        await seedUsers();
    } catch (seedError) {
        console.error(`⚠️ Warning: Failed to seed users: ${seedError.message}`);
    }

    app.listen(port, () => {
        writeLog('INFO', `Server running on port ${port}`);
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
