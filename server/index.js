const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function for CRUD operations
const createCrudRoutes = (resource, tableName) => {
    // List
    app.get(`/${resource}`, async (req, res) => {
        try {
            const { sort, ...filters } = req.query;
            let query = `SELECT * FROM ${tableName}`;
            const values = [];

            if (Object.keys(filters).length > 0) {
                const clauses = Object.keys(filters).map((key, i) => `${key} = $${i + 1}`);
                query += ` WHERE ${clauses.join(' AND ')}`;
                values.push(...Object.values(filters));
            }

            if (sort) {
                const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
                const field = sort.startsWith('-') ? sort.substring(1) : sort;
                query += ` ORDER BY ${field} ${direction}`;
            }

            const result = await db.query(query, values);
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
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);

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
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);

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
        role VARCHAR(50)
      )
    `);

        // Demands Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS demands (
        id SERIAL PRIMARY KEY,
        product VARCHAR(255),
        demand_number VARCHAR(50),
        status VARCHAR(50),
        artifact VARCHAR(100),
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
        last_frozen_at TIMESTAMP
      )
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

        // Analysts
        await db.query(`
      CREATE TABLE IF NOT EXISTS analysts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255)
      )
    `);

        // Clients
        await db.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
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

        // SEED DATA
        const users = [
            { name: 'Gestor Fluxo', email: 'gestor@fluxo.com', password: '123', role: 'manager' },
            { name: 'Ana Responsável', email: 'responsavel@fluxo.com', password: '123', role: 'analyst' },
            { name: 'João Solicitante', email: 'solicitante@fluxo.com', password: '123', role: 'requester' }
        ];

        for (const user of users) {
            const exists = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
            if (exists.rows.length === 0) {
                await db.query(
                    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
                    [user.name, user.email, user.password, user.role]
                );
                console.log(`Created user: ${user.name}`);

                // Sync with domain tables
                if (user.role === 'analyst') {
                    await db.query('INSERT INTO analysts (name, email) VALUES ($1, $2)', [user.name, user.email]);
                }
                if (user.role === 'requester') {
                    await db.query('INSERT INTO requesters (name, email) VALUES ($1, $2)', [user.name, user.email]);
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
        const entityQuery = `INSERT INTO ${tableName} (name, email) VALUES ($1, $2) RETURNING *`;
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

// Routes
createCrudRoutes('demands', 'demands');
createCrudRoutes('status_history', 'status_history');
createCrudRoutes('analysts', 'analysts');
createCrudRoutes('clients', 'clients');
createCrudRoutes('cycles', 'cycles');
createCrudRoutes('requesters', 'requesters');
createCrudRoutes('holidays', 'holidays');
createCrudRoutes('users', 'users'); // Allow listing users

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
    console.log(`Server running on port ${PORT}`);
});
