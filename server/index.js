const express = require('express');
const cors = require('cors');
const db = require('./db');
const cron = require('node-cron');
const fs = require('fs'); // Added for debugging

// Global Error Handler for Crash Debugging
process.on('uncaughtException', (err) => {
    try {
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] CRASH: ${err.stack}\n`);
    } catch (e) {
        console.error('Failed to write crash log', e);
    }
    process.exit(1);
});

fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Server starting...\n`);

// Import Modules
const financeiroRoutes = require('./src/modules/financeiro/routes');
const prazosRoutes = require('./src/modules/prazos/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// JSON parsing error handler (P2 Security)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next(err);
});


// Whitelist of allowed sort fields per table (SQL Injection Protection)
const ALLOWED_SORT_FIELDS = {
    demands: ['id', 'demand_number', 'product', 'status', 'artifact', 'complexity', 'created_date', 'qualification_date', 'expected_delivery_date', 'delivery_date', 'stage'],
    clients: ['id', 'name', 'sigla', 'created_at'],
    analysts: ['id', 'name', 'email', 'created_at'],
    users: ['id', 'name', 'email', 'role', 'department'],
    monthly_attestations: ['id', 'reference_month', 'client_name', 'pd_number', 'responsible_analyst', 'report_generation_date'],
    status_history: ['id', 'demand_id', 'changed_at', 'from_status', 'to_status'],
    stage_history: ['id', 'demand_id', 'stage', 'entered_at', 'exited_at', 'duration_minutes'],
    finance_contracts: ['id', 'client_name', 'pd_number', 'responsible_analyst', 'created_at'],
    deadline_contracts: ['id', 'cliente', 'contrato', 'data_inicio_efetividade', 'data_fim_efetividade', 'status'],
    cycles: ['id', 'name'],
    requesters: ['id', 'name', 'email'],
    holidays: ['id', 'date', 'name'],
    attestations: ['id', 'reference_month', 'client_name', 'pd_number'],
    confirmation_terms: ['id', 'created_at', 'updated_at', 'numero_tc', 'contrato_associado_pd'],
    contracts: ['id', 'cliente', 'contrato', 'data_inicio_efetividade', 'data_fim_efetividade', 'status', 'created_at'],
};

// Validation Middleware (P2 Security)
const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;

    if (page !== undefined) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({ error: 'Invalid page number. Must be positive integer.' });
        }
        if (pageNum > 10000) {
            return res.status(400).json({ error: 'Page number too large. Maximum is 10000.' });
        }
        req.query.page = pageNum;
    }

    if (limit !== undefined) {
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum < 1) {
            return res.status(400).json({ error: 'Invalid limit. Must be positive integer.' });
        }
        if (limitNum > 1000) {
            return res.status(400).json({ error: 'Limit too large. Maximum is 1000.' });
        }
        req.query.limit = limitNum;
    }

    next();
};

// Error Handler Utility (P2 Security - Sanitize errors in production)
const handleError = (err, res, context = 'Operation') => {
    console.error(`[ERROR ${context}]:`, err);

    const isDev = process.env.NODE_ENV !== 'production';
    const message = isDev ? err.message : `${context} failed`;

    res.status(500).json({
        error: message,
        ...(isDev && { stack: err.stack })
    });
};

// Helper function for CRUD operations
const createCrudRoutes = (resource, tableName) => {
    // List
    app.get(`/${resource}`, validatePagination, async (req, res) => {
        try {
            const { sort, page, limit, ...filters } = req.query;
            let query = `SELECT * FROM ${tableName}`;
            let countQuery = `SELECT COUNT(*) FROM ${tableName}`;
            const values = [];
            const whereConditions = [];

            // Special logic for Demands
            if (tableName === 'demands') {
                // Status filtering
                if (filters.status === 'active') {
                    whereConditions.push(`status NOT IN ('ENTREGUE', 'CANCELADA')`);
                    delete filters.status;
                } else if (filters.status === 'all') {
                    delete filters.status;
                }

                // Search filtering (Fuzzy search)
                if (filters.search) {
                    const searchParamIndex = values.length + 1;
                    whereConditions.push(`(product ILIKE $${searchParamIndex} OR demand_number ILIKE $${searchParamIndex})`);
                    values.push(`%${filters.search}%`);
                }

                // Always delete search to prevent it from being treated as a column
                delete filters.search;
            } else {
                if (filters.status === 'all') delete filters.status;
            }

            // Clean up 'all' from other filters
            Object.keys(filters).forEach(key => {
                if (filters[key] === 'all') delete filters[key];
            });

            // Generic filters
            Object.keys(filters).forEach((key) => {
                const paramIndex = values.length + 1;
                whereConditions.push(`${key} = $${paramIndex}`);
                values.push(filters[key]);
            });

            if (whereConditions.length > 0) {
                const whereClause = ` WHERE ${whereConditions.join(' AND ')}`;
                query += whereClause;
                countQuery += whereClause;
            }

            if (sort) {
                const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
                const field = sort.startsWith('-') ? sort.substring(1) : sort;

                // SQL Injection Protection: Validate field against whitelist
                const allowedFields = ALLOWED_SORT_FIELDS[tableName] || [];
                if (!allowedFields.includes(field)) {
                    return res.status(400).json({
                        error: `Invalid sort field: "${field}". Allowed fields: ${allowedFields.join(', ')}`
                    });
                }

                query += ` ORDER BY ${field} ${direction}`;
            }

            // Pagination
            if (page && limit) {
                const limitVal = parseInt(limit);
                const offsetVal = (parseInt(page) - 1) * limitVal;
                query += ` LIMIT ${limitVal} OFFSET ${offsetVal}`;
            }

            // Only run count query if pagination is requested (P3 Optimization)
            if (page && limit) {
                const countResult = await db.query(countQuery, values);
                const totalCount = parseInt(countResult.rows[0].count);
                res.setHeader('X-Total-Count', totalCount);
            }

            const result = await db.query(query, values);
            res.json(result.rows);
        } catch (err) {
            handleError(err, res, `List ${resource}`);
        }
    });

    // Get one
    app.get(`/${resource}/:id`, async (req, res) => {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            handleError(err, res, `Get ${resource}`);
        }
    });

    // Create
    app.post(`/${resource}`, async (req, res) => {
        try {
            const body = { ...req.body };
            // Sanitização básica: strings vazias viram null para não dar erro em campos numéricos/data
            Object.keys(body).forEach(key => {
                if (body[key] === '') body[key] = null;
            });

            const keys = Object.keys(body);
            const values = Object.values(body);

            // Basic ID generation if not provided (Postgres usually handles this with SERIAL/UUID, but ensuring it)
            // Actually, we'll let Postgres handle ID if it's serial/generated.

            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;

            const result = await db.query(query, values);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            handleError(err, res, `Create ${resource}`);
        }
    });

    // Update
    app.put(`/${resource}/:id`, async (req, res) => {
        try {
            const body = { ...req.body };
            // Sanitização básica
            Object.keys(body).forEach(key => {
                if (body[key] === '') body[key] = null;
            });

            const keys = Object.keys(body);
            const values = Object.values(body);

            if (keys.length === 0) return res.status(400).json({ error: 'No fields to update' });

            const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
            const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`;

            const result = await db.query(query, [req.params.id, ...values]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            handleError(err, res, `Update ${resource}`);
        }
    });

    // Delete
    app.delete(`/${resource}/:id`, async (req, res) => {
        try {
            const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            handleError(err, res, `Delete ${resource}`);
        }
    });
};

// Mock Auth Route for Development/LAN
app.get('/auth/me', async (req, res) => {
    try {
        // Return a default manager user to unblock frontend
        // In real prod, this would decode JWT
        const user = await db.query("SELECT * FROM users WHERE email = 'gestor@fluxo.com'");
        if (user.rows.length > 0) {
            res.json(user.rows[0]);
        } else {
            // Fallback if seed didn't run
            res.json({ id: 1, name: 'Gestor Fluxo', email: 'gestor@fluxo.com', role: 'manager', department: 'GOR' });
        }
    } catch (e) {
        console.error('Auth Me Error:', e);
        res.status(500).json({ error: 'Auth failed' });
    }
});

// Initialize Database Tables
const initDb = async () => {
    try {
        // Users Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        department VARCHAR(50),
        allowed_modules TEXT[] DEFAULT '{flow}'
      )
    `);

        // Contracts (New Core Table)
        await db.query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id SERIAL PRIMARY KEY,
        contract_number VARCHAR(50) UNIQUE NOT NULL,
        object TEXT,
        company_name VARCHAR(255),
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        total_value DECIMAL(15, 2),
        current_balance DECIMAL(15, 2),
        status VARCHAR(50) DEFAULT 'active'
      )
    `);

        // Confirmation Terms (Added for Prazos Module)
        await db.query(`
            CREATE TABLE IF NOT EXISTS confirmation_terms (
                id SERIAL PRIMARY KEY,
                contrato_associado_pd VARCHAR(255),
                valor_total DECIMAL(15, 2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Analysts
        await db.query(`
      CREATE TABLE IF NOT EXISTS analysts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        email VARCHAR(255)
      )
    `);

        // Clients
        await db.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        sigla VARCHAR(50),
        active BOOLEAN DEFAULT TRUE
      )
    `);

        // Demands Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS demands (
        id SERIAL PRIMARY KEY,
        product VARCHAR(255),
        demand_number VARCHAR(50),
        status VARCHAR(50),
        artifact VARCHAR(255),
        complexity VARCHAR(50),
        weight INTEGER,
        client_id INTEGER,
        analyst_id INTEGER,
        cycle_id INTEGER,
        requester_id INTEGER,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        qualification_date TIMESTAMP,
        expected_delivery_date TIMESTAMP,
        delivery_date TIMESTAMP,
        observation TEXT,
        frozen_time_minutes INTEGER DEFAULT 0,
        last_frozen_at TIMESTAMP,
        support_analyst_id INTEGER,
        delivery_date_change_reason TEXT,
        contract_id INTEGER REFERENCES contracts(id)
      );
      
      -- Migrations for existing tables
      ALTER TABLE demands ADD COLUMN IF NOT EXISTS support_analyst_id INTEGER;
      ALTER TABLE demands ADD COLUMN IF NOT EXISTS stage VARCHAR(50); -- Nova coluna de Etapas CDPC
      ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_modules TEXT[] DEFAULT '{flow}';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_type VARCHAR(50);
      ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE analysts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

        // Status History
        await db.query(`
      CREATE TABLE IF NOT EXISTS status_history (
        id SERIAL PRIMARY KEY,
        demand_id INTEGER REFERENCES demands(id),
        from_status VARCHAR(50),
        to_status VARCHAR(50),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_in_previous_status_minutes INTEGER,
        changed_by VARCHAR(255)
      )
    `);

        // Stage History (New CDPC Flow)
        await db.query(`
      CREATE TABLE IF NOT EXISTS stage_history (
        id SERIAL PRIMARY KEY,
        demand_id INTEGER REFERENCES demands(id),
        stage VARCHAR(50),
        entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        exited_at TIMESTAMP,
        duration_minutes INTEGER,
        changed_by VARCHAR(255)
      )
    `);



        // Cycles
        await db.query(`
      CREATE TABLE IF NOT EXISTS cycles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      )
    `);

        // Requesters
        await db.query(`
      CREATE TABLE IF NOT EXISTS requesters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255)
      )
    `);

        // Holidays
        await db.query(`
      CREATE TABLE IF NOT EXISTS holidays (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP,
        name VARCHAR(255)
      )
    `);




        // Add Legacy Columns Separately (Prazos Module)
        const legacyCols = [
            'ADD COLUMN IF NOT EXISTS analista_responsavel VARCHAR(255)',
            'ADD COLUMN IF NOT EXISTS cliente VARCHAR(255)',
            'ADD COLUMN IF NOT EXISTS grupo_cliente VARCHAR(255)',
            'ADD COLUMN IF NOT EXISTS contrato VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS termo VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS status_vencimento VARCHAR(50)',
            'ADD COLUMN IF NOT EXISTS data_inicio_efetividade TIMESTAMP',
            'ADD COLUMN IF NOT EXISTS data_fim_efetividade TIMESTAMP',
            'ADD COLUMN IF NOT EXISTS data_limite_andamento TIMESTAMP',
            'ADD COLUMN IF NOT EXISTS valor_contrato DECIMAL(15, 2)',
            'ADD COLUMN IF NOT EXISTS valor_faturado DECIMAL(15, 2)',
            'ADD COLUMN IF NOT EXISTS valor_cancelado DECIMAL(15, 2)',
            'ADD COLUMN IF NOT EXISTS valor_a_faturar DECIMAL(15, 2)',
            'ADD COLUMN IF NOT EXISTS valor_novo_contrato DECIMAL(15, 2)',
            'ADD COLUMN IF NOT EXISTS tipo_tratativa VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS tipo_aditamento VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS etapa TEXT',
            'ADD COLUMN IF NOT EXISTS objeto TEXT',
            'ADD COLUMN IF NOT EXISTS secao_responsavel VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS observacao TEXT',
            'ADD COLUMN IF NOT EXISTS numero_processo_sei_nosso VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS numero_processo_sei_cliente VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS contrato_cliente VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS contrato_anterior VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS numero_pnpp_crm VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS sei VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS contrato_novo VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS termo_novo VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS created_by VARCHAR(255)'
        ];

        for (const col of legacyCols) {
            try {
                await db.query(`ALTER TABLE contracts ${col}`);
            } catch (e) { console.log('Column already exists or error:', e.message); }
        }

        // Fix contract_number to be nullable (for Prazos module compatibility)
        try {
            await db.query(`ALTER TABLE contracts ALTER COLUMN contract_number DROP NOT NULL`);
            console.log('contract_number is now nullable');
        } catch (e) {
            console.log('contract_number already nullable or error:', e.message);
        }

        // Add Finance Module Columns to Contracts
        const financeCols = [
            'ADD COLUMN IF NOT EXISTS client_name VARCHAR(255)',
            'ADD COLUMN IF NOT EXISTS responsible_analyst VARCHAR(255)',
            'ADD COLUMN IF NOT EXISTS pd_number VARCHAR(50)',
            'ADD COLUMN IF NOT EXISTS sei_process_number VARCHAR(50)',
            'ADD COLUMN IF NOT EXISTS sei_send_area VARCHAR(100)',
            'ADD COLUMN IF NOT EXISTS esps JSONB DEFAULT \'[]\'',
            'ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        ];

        for (const col of financeCols) {
            try {
                await db.query(`ALTER TABLE contracts ${col}`);
            } catch (e) { console.log('Finance col error:', e.message); }
        }

        // ========================================
        // TABELAS SEPARADAS PARA MÓDULOS
        // ========================================

        // Tabela de Contratos Financeiros (Módulo Financeiro)
        await db.query(`
            CREATE TABLE IF NOT EXISTS finance_contracts (
                id SERIAL PRIMARY KEY,
                client_name VARCHAR(255) NOT NULL,
                pd_number VARCHAR(50) NOT NULL,
                responsible_analyst VARCHAR(255),
                sei_process_number VARCHAR(50),
                sei_send_area VARCHAR(100),
                esps JSONB DEFAULT '[]',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de Contratos de Prazos (Módulo Prazos)
        await db.query(`
            CREATE TABLE IF NOT EXISTS deadline_contracts (
                id SERIAL PRIMARY KEY,
                analista_responsavel VARCHAR(255),
                cliente VARCHAR(255),
                grupo_cliente VARCHAR(255),
                contrato VARCHAR(255),
                termo VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Ativo',
                status_vencimento VARCHAR(50),
                data_inicio_efetividade TIMESTAMP,
                data_fim_efetividade TIMESTAMP,
                data_limite_andamento TIMESTAMP,
                valor_contrato DECIMAL(15, 2),
                valor_faturado DECIMAL(15, 2),
                valor_cancelado DECIMAL(15, 2),
                valor_a_faturar DECIMAL(15, 2),
                valor_novo_contrato DECIMAL(15, 2),
                objeto TEXT,
                tipo_tratativa VARCHAR(255),
                tipo_aditamento VARCHAR(255),
                etapa TEXT,
                secao_responsavel VARCHAR(255),
                observacao TEXT,
                numero_processo_sei_nosso VARCHAR(255),
                numero_processo_sei_cliente VARCHAR(255),
                contrato_cliente VARCHAR(255),
                contrato_anterior VARCHAR(255),
                numero_pnpp_crm VARCHAR(255),
                sei VARCHAR(255),
                contrato_novo VARCHAR(255),
                termo_novo VARCHAR(255),
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Tabelas separadas criadas: finance_contracts e deadline_contracts');

        // ========================================
        // MIGRAÇÃO DE DADOS (LEGADO -> NOVAS TABELAS)
        // ========================================
        try {
            // Verificar se as novas tabelas estão vazias antes de migrar
            const financeCount = await db.query('SELECT COUNT(*) FROM finance_contracts');
            const deadlineCount = await db.query('SELECT COUNT(*) FROM deadline_contracts');

            if (parseInt(financeCount.rows[0].count) === 0) {
                console.log('🔄 Migrando dados para finance_contracts...');
                await db.query(`
                    INSERT INTO finance_contracts (
                        client_name, pd_number, responsible_analyst, 
                        sei_process_number, sei_send_area, esps, created_at
                    )
                    SELECT 
                        COALESCE(client_name, company_name, 'Sem Cliente'), 
                        COALESCE(pd_number, contract_number, 'Sem PD'),
                        COALESCE(responsible_analyst, analista_responsavel),
                        sei_process_number, sei_send_area, esps, created_at
                    FROM contracts 
                    WHERE client_name IS NOT NULL OR pd_number IS NOT NULL OR esps IS NOT NULL
                `);
                console.log('✅ Migração para finance_contracts concluída');
            }

            if (parseInt(deadlineCount.rows[0].count) === 0) {
                console.log('🔄 Migrando dados para deadline_contracts...');
                await db.query(`
                    INSERT INTO deadline_contracts (
                        analista_responsavel, cliente, grupo_cliente, contrato, termo,
                        status, status_vencimento, data_inicio_efetividade, data_fim_efetividade,
                        data_limite_andamento, valor_contrato, valor_faturado, valor_cancelado,
                        valor_a_faturar, valor_novo_contrato, objeto, tipo_tratativa,
                        tipo_aditamento, etapa, secao_responsavel, observacao,
                        numero_processo_sei_nosso, numero_processo_sei_cliente,
                        contrato_cliente, contrato_anterior, numero_pnpp_crm, sei,
                        contrato_novo, termo_novo, created_by, created_at
                    )
                    SELECT 
                        analista_responsavel, cliente, grupo_cliente, contrato, termo,
                        status, status_vencimento, data_inicio_efetividade, data_fim_efetividade,
                        data_limite_andamento, valor_contrato, valor_faturado, valor_cancelado,
                        valor_a_faturar, valor_novo_contrato, objeto, tipo_tratativa,
                        tipo_aditamento, etapa, secao_responsavel, observacao,
                        numero_processo_sei_nosso, numero_processo_sei_cliente,
                        contrato_cliente, contrato_anterior, numero_pnpp_crm, sei,
                        contrato_novo, termo_novo, created_by, created_at
                    FROM contracts
                    WHERE contrato IS NOT NULL OR cliente IS NOT NULL
                `);
                console.log('✅ Migração para deadline_contracts concluída');
            }
        } catch (migrationErr) {
            console.error('⚠️ Erro durante migração:', migrationErr.message);
        }

        // Monthly Attestations (Finance Module)
        await db.query(`
            CREATE TABLE IF NOT EXISTS monthly_attestations (
                id SERIAL PRIMARY KEY,
                contract_id INTEGER REFERENCES finance_contracts(id),
                client_name VARCHAR(255),
                pd_number VARCHAR(50),
                responsible_analyst VARCHAR(255),
                esp_number VARCHAR(50),
                sei_process_number VARCHAR(50), 
                sei_send_area VARCHAR(100),
                reference_month VARCHAR(10),
                report_generation_date DATE,
                report_send_date DATE,
                attestation_return_date DATE,
                invoice_send_to_client_date DATE,
                invoice_number VARCHAR(50),
                billed_amount DECIMAL(15, 2),
                paid_amount DECIMAL(15, 2),
                invoice_send_date DATE,
                observations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration for existing table
        const attestationCols = [
            'ADD COLUMN IF NOT EXISTS sei_process_number VARCHAR(50)',
            'ADD COLUMN IF NOT EXISTS sei_send_area VARCHAR(100)'
        ];

        for (const col of attestationCols) {
            try {
                await db.query(`ALTER TABLE monthly_attestations ${col}`);
            } catch (e) {
                console.log('Attestation col error:', e.message);
            }
        }

        // Clients (Finance Module)
        await db.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Analysts (Finance Module)
        await db.query(`
            CREATE TABLE IF NOT EXISTS analysts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Termos Confirmacao (Prazos/Legacy Module)
        await db.query(`
            CREATE TABLE IF NOT EXISTS termos_confirmacao (
                id SERIAL PRIMARY KEY,
                numero_tc VARCHAR(50),
                contrato_associado_pd VARCHAR(50),
                numero_processo VARCHAR(50),
                data_inicio_vigencia TIMESTAMP,
                data_fim_vigencia TIMESTAMP,
                valor_total DECIMAL(15, 2),
                objeto TEXT,
                area_demandante VARCHAR(100),
                fiscal_contrato VARCHAR(255),
                gestor_contrato VARCHAR(255),
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP
            )
        `);




        // Invoices (New Finance Module)
        await db.query(`
      CREATE TABLE IF NOT EXISTS invoices(
            id SERIAL PRIMARY KEY,
            contract_id INTEGER REFERENCES contracts(id),
            invoice_number VARCHAR(50),
            amount DECIMAL(15, 2),
            issue_date TIMESTAMP,
            status VARCHAR(50)
        )
    `);

        // SEED DATA - ATUALIZADO COM NOVOS PERFIS
        const seedUsers = [
            // GOR (Gerencia Geral)
            { name: 'Gerente Geral', email: 'gerente_gor@fluxo.com', password: '123', role: 'manager', department: 'GOR', allowed_modules: ['flow', 'finance', 'contracts'] },

            // COCR (Antigo Prazos)
            { name: 'Gestor COCR', email: 'gestor_cocr@fluxo.com', password: '123', role: 'manager', department: 'COCR', allowed_modules: ['contracts'] },
            { name: 'Analista COCR', email: 'analista_cocr@fluxo.com', password: '123', role: 'analyst', department: 'COCR', allowed_modules: ['contracts'] },
            { name: 'Cliente COCR', email: 'cliente_cocr@fluxo.com', password: '123', role: 'client', department: 'COCR', allowed_modules: ['contracts'] }, // Novo role client

            // CDPC (Antigo Fluxo)
            { name: 'Gestor CDPC', email: 'gestor_cdpc@fluxo.com', password: '123', role: 'manager', department: 'CDPC', allowed_modules: ['flow'] },
            { name: 'Analista CDPC', email: 'analista_cdpc@fluxo.com', password: '123', role: 'analyst', department: 'CDPC', allowed_modules: ['flow'] },
            { name: 'Solicitante CDPC', email: 'solicitante_cdpc@fluxo.com', password: '123', role: 'requester', department: 'CDPC', allowed_modules: ['flow'] },

            // CVAC (Antigo Financeiro)
            { name: 'Gestor CVAC', email: 'gestor_cvac@fluxo.com', password: '123', role: 'manager', department: 'CVAC', allowed_modules: ['finance'] },
            { name: 'Analista CVAC', email: 'analista_cvac@fluxo.com', password: '123', role: 'analyst', department: 'CVAC', allowed_modules: ['finance'] },

            // Legacy/Compatibilidade
            { name: 'Gestor Fluxo', email: 'gestor@fluxo.com', password: '123', role: 'manager', department: 'GOR', allowed_modules: ['flow', 'finance', 'contracts'] },
        ];

        for (const user of seedUsers) {
            const exists = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
            if (exists.rows.length === 0) {
                await db.query(
                    'INSERT INTO users (name, email, password, role, department, allowed_modules) VALUES ($1, $2, $3, $4, $5, $6)',
                    [user.name, user.email, user.password, user.role, user.department, user.allowed_modules]
                );
                console.log(`Created user: ${user.name} (${user.department})`);

                // Sync with domain tables
                if (user.role === 'analyst') {
                    await db.query('INSERT INTO analysts (name, email) VALUES ($1, $2)', [user.name, user.email]);
                }
                if (user.role === 'requester') {
                    await db.query('INSERT INTO requesters (name, email) VALUES ($1, $2)', [user.name, user.email]);
                }
                if (user.role === 'client') {
                    await db.query('INSERT INTO clients (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [user.name]);
                }
            }
        }

        console.log('Database tables and seed data initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

// Custom Routes for Entities with User Account creation
const handleEntityWithUserCreation = async (req, res, tableName, role) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { name, email, password, active } = req.body;
        console.log('Handling entity creation:', { tableName, role, body: req.body });

        // 1. Create specific entity
        const entityQuery = `INSERT INTO ${tableName} (name, email) VALUES($1, $2) RETURNING * `;
        const entityResult = await client.query(entityQuery, [name, email]);

        // 2. Create or Update User
        // Check if user exists
        const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userCheck.rows.length === 0 && password) {
            // Create new user
            await client.query(
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                [name, email, password, role]
            );
        } else if (userCheck.rows.length > 0 && password) {
            // Update existing user password/role if needed
            await client.query(
                'UPDATE users SET password = $1, role = $2 WHERE email = $3',
                [password, role, email]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(entityResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
};

app.post('/analysts', (req, res) => handleEntityWithUserCreation(req, res, 'analysts', 'analyst'));
app.post('/requesters', (req, res) => handleEntityWithUserCreation(req, res, 'requesters', 'requester'));
// app.post('/clients', (req, res) => handleEntityWithUserCreation(req, res, 'clients', 'client')); // Removed: Clients are companies, not users. Use generic CRUD.

// Clear status history for a demand
app.delete('/demands/:id/history', async (req, res) => {
    try {
        console.log(`[DELETE HISTORY] Clearing history for demand ${req.params.id}`);
        const result = await db.query('DELETE FROM status_history WHERE demand_id = $1', [req.params.id]);
        console.log(`[DELETE HISTORY] Deleted ${result.rowCount} rows`);
        res.json({ message: 'History cleared successfully', count: result.rowCount });
    } catch (err) {
        console.error('Clear history error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Routes
// Custom route for demands UPDATE (must come BEFORE createCrudRoutes)
// This handles stage and status history tracking
app.put('/demands/:id', async (req, res) => {
    const client = await db.connect(); // Get connection from pool for transaction

    try {
        await client.query('BEGIN'); // Start transaction (P3 - Data Consistency)

        const body = { ...req.body };
        // Sanitização básica
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

        // Debug logging (P3 - Conditional logging)
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
            console.log(`[PUT /demands/${req.params.id}] Body:`, JSON.stringify(body));
        }

        // Fetch current state once (using transaction client)
        const currentRes = await client.query('SELECT stage, status FROM demands WHERE id = $1', [req.params.id]);
        const currentDemand = currentRes.rows[0];

        if (!currentDemand) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Demand not found' });
        }

        const oldStage = currentDemand.stage;
        const oldStatus = currentDemand.status;

        if (isDev) {
            console.log(`[DEBUG] Status Check: New='${status}', Old='${oldStatus}' | Different? ${status && status !== oldStatus}`);
        }

        // STAGE HISTORY LOGIC
        if (stage && stage !== oldStage) {
            const now = new Date();
            // Close previous stage history
            await client.query(`
                UPDATE stage_history 
                SET exited_at = $1, duration_minutes = EXTRACT(EPOCH FROM ($1 - entered_at))/60 
                WHERE demand_id = $2 AND stage = $3 AND exited_at IS NULL
           `, [now, req.params.id, oldStage]);

            // Start new stage history
            await client.query(`
                INSERT INTO stage_history (demand_id, stage, entered_at)
                VALUES ($1, $2, $3)
           `, [req.params.id, stage, now]);
        } else if (!oldStage && stage) {
            // First stage set
            await client.query(`
                INSERT INTO stage_history (demand_id, stage, entered_at)
                VALUES ($1, $2, NOW())
           `, [req.params.id, stage]);
        }

        // STATUS HISTORY LOGIC
        // Only insert if status is provided AND DIFFERENT from old status (Normalizing to avoid case/trim issues)
        const newStatusNorm = status ? status.trim().toUpperCase() : null;
        const oldStatusNorm = oldStatus ? oldStatus.trim().toUpperCase() : null;

        if (newStatusNorm && newStatusNorm !== oldStatusNorm) {
            const now = new Date();
            // Insert into status_history
            await client.query(`
                INSERT INTO status_history (demand_id, from_status, to_status, changed_at, changed_by)
                VALUES ($1, $2, $3, $4, $5)
             `, [req.params.id, oldStatus, status, now, 'System']);
        }

        // Update the demand
        const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
        const query = `UPDATE demands SET ${setClause} WHERE id = $1 RETURNING *`;

        const result = await client.query(query, [req.params.id, ...values]);

        await client.query('COMMIT'); // Commit all changes if successful
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on any error
        handleError(err, res, 'Update demand');
    } finally {
        client.release(); // Always release connection back to pool
    }
});

createCrudRoutes('users', 'users');
createCrudRoutes('demands', 'demands');
createCrudRoutes('status_history', 'status_history');
createCrudRoutes('stage_history', 'stage_history'); // Adicionado
createCrudRoutes('finance_contracts', 'finance_contracts');
createCrudRoutes('contracts', 'contracts'); // Added to support legacy endpoint if needed
createCrudRoutes('deadline_contracts', 'deadline_contracts');
createCrudRoutes('clients', 'clients');
createCrudRoutes('analysts', 'analysts');
createCrudRoutes('cycles', 'cycles');
createCrudRoutes('requesters', 'requesters');
createCrudRoutes('holidays', 'holidays');
createCrudRoutes('attestations', 'monthly_attestations'); // Route 'attestations' maps to table 'monthly_attestations'
createCrudRoutes('termos_confirmacao', 'confirmation_terms'); // Added missing route


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Start backup routine
    cron.schedule('0 23 * * *', () => {
        console.log('Running daily backup...');
        // Implement backup logic here
    });
});


