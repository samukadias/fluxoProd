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
const { authenticateToken } = require('./middleware/auth');
const auditTrail = require('./middleware/audit');

// Helpers
const { createCrudRoutes } = require('./helpers/crud');

// Routes
const authRoutes = require('./routes/auth');
const demandRoutes = require('./routes/demands');
const { router: notificationRoutes, generateExpiringContractNotifications } = require('./routes/notifications');
const activityRoutes = require('./routes/activity');

// Services
const backupService = require('./services/backupService');

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

// CORS - restricted to known origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

// Also allow LAN access
if (process.env.LAN_ORIGIN) {
    allowedOrigins.push(process.env.LAN_ORIGIN);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.) or from allowed list
        if (!origin || allowedOrigins.some(o => origin.startsWith(o.replace(/:\d+$/, '')))) {
            callback(null, true);
        } else {
            callback(null, true); // In dev, allow all; in production tighten this
        }
    },
    exposedHeaders: ['X-Total-Count'],
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

// ========================================
// PROTECTED ROUTES (JWT required)
// ========================================
app.use(authenticateToken);

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
    await initDb();
    await seedUsers();

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
