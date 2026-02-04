const express = require('express');
const cors = require('cors');
const db = require('./db');
// Import Modules
const financeiroRoutes = require('./src/modules/financeiro/routes');
const prazosRoutes = require('./src/modules/prazos/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function for CRUD operations
const createCrudRoutes = (resource, tableName) => {
    // List
    app.get(`/${resource}`, async (req, res) => {
        try {
            const { sort, page, limit, ...filters } = req.query;
            let query = `SELECT * FROM ${tableName}`;
            let countQuery = `SELECT COUNT(*) FROM ${tableName}`;
            const values = [];

            if (Object.keys(filters).length > 0) {
                const clauses = Object.keys(filters).map((key, i) => `${key} = $${i + 1}`);
                const whereClause = ` WHERE ${clauses.join(' AND ')}`;
                query += whereClause;
                countQuery += whereClause;
                values.push(...Object.values(filters));
            }

            if (sort) {
                const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
                const field = sort.startsWith('-') ? sort.substring(1) : sort;
                query += ` ORDER BY ${field} ${direction}`;
            }

            // Pagination
            if (page && limit) {
                const limitVal = parseInt(limit);
                const offsetVal = (parseInt(page) - 1) * limitVal;
                query += ` LIMIT ${limitVal} OFFSET ${offsetVal}`;
            }

            // Get total count
            const countResult = await db.query(countQuery, values);
            const totalCount = parseInt(countResult.rows[0].count);

            const result = await db.query(query, values);

            // Send total count in header
            res.setHeader('X-Total-Count', totalCount);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    // Get one
    app.get(`/${resource}/:id`, async (req, res) => {
        try {
            const result = await db.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
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
            console.error(err);
            res.status(500).json({ error: err.message });
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
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    // Delete
    app.delete(`/${resource}/:id`, async (req, res) => {
        try {
            const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
};

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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_modules TEXT[] DEFAULT '{flow}';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(50); -- Nova coluna de departamento
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_type VARCHAR(50); -- Para diferenciar Gestor/Analista explicitamente se necessario
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
                contract_id INTEGER REFERENCES contracts(id),
                client_name VARCHAR(255),
                pd_number VARCHAR(50),
                responsible_analyst VARCHAR(255),
                esp_number VARCHAR(50),
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

// Custom DELETE for demands to handle Cascade manually (since DB might lack ON DELETE CASCADE)
app.delete('/demands/:id', async (req, res) => {
    try {
        await db.query('BEGIN');
        // 1. Delete dependent history
        await db.query('DELETE FROM status_history WHERE demand_id = $1', [req.params.id]);
        // 2. Delete the demand
        const result = await db.query('DELETE FROM demands WHERE id = $1 RETURNING *', [req.params.id]);

        await db.query('COMMIT');

        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully w/ cascade' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Delete demand error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Routes
// Note: Custom routes must define BEFORE generic createCrudRoutes if they overlap, 
// BUT createCrudRoutes registers routes immediately. So we must place this custom route BEFORE calling createCrudRoutes('demands') below.
// Actually Express matches in order. So we are good placing it here above.
createCrudRoutes('demands', 'demands');
createCrudRoutes('status_history', 'status_history');
createCrudRoutes('analysts', 'analysts');
createCrudRoutes('clients', 'clients');
createCrudRoutes('cycles', 'cycles');
createCrudRoutes('requesters', 'requesters');
createCrudRoutes('holidays', 'holidays');
createCrudRoutes('users', 'users'); // Allow listing users
createCrudRoutes('contracts', 'contracts'); // Legado - manter para compatibilidade
createCrudRoutes('finance_contracts', 'finance_contracts'); // Módulo Financeiro
createCrudRoutes('deadline_contracts', 'deadline_contracts'); // Módulo Prazos
createCrudRoutes('invoices', 'invoices');
createCrudRoutes('monthly_attestations', 'monthly_attestations');
createCrudRoutes('clients', 'clients');
createCrudRoutes('analysts', 'analysts');
createCrudRoutes('termos_confirmacao', 'termos_confirmacao');

// Register Module Routes
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/prazos', prazosRoutes);

// Auth Routes
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/auth/me', (req, res) => {
    res.status(401).json({ error: 'Not implemented, use local state' });
});

// Email Mock
app.post('/integrations/email', (req, res) => {
    console.log('Sending email:', req.body);
    res.json({ success: true, message: 'Email sent (mock)' });
});

app.listen(PORT, async () => {
    await initDb();
    console.log(`Server running on port ${PORT} `);
});
