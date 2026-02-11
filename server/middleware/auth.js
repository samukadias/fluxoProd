const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fluxoprod_secret_key_change_in_production';
const JWT_EXPIRES_IN = '8h';

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
        allowed_modules: user.allowed_modules,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header and attaches user to req
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = { generateToken, authenticateToken, JWT_SECRET };
