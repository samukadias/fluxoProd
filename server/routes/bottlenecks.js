const express = require('express');
const db = require('../db');
const { handleError } = require('../helpers/crud');

const router = express.Router();

// Helper: verifica se usuário tem papel de gestor ou superior
const isManager = (user) =>
    user && ['manager', 'admin', 'gestor'].includes(user.role);

// ============================================================
// OPÇÕES DE GARGALO — CRUD (gestor+)
// ============================================================

/**
 * GET /bottleneck-options
 * Lista opções ativas (todos os papéis)
 */
router.get('/bottleneck-options', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM demand_bottleneck_options WHERE active = TRUE ORDER BY label ASC`
        );
        res.json(result.rows);
    } catch (err) {
        handleError(err, res, 'List bottleneck options');
    }
});

/**
 * GET /bottleneck-options/all
 * Lista todas as opções incluindo inativas (gestor+)
 */
router.get('/bottleneck-options/all', async (req, res) => {
    if (!isManager(req.user)) {
        return res.status(403).json({ error: 'Acesso negado. Apenas gestores podem gerenciar gargalos.' });
    }
    try {
        const result = await db.query(
            `SELECT * FROM demand_bottleneck_options ORDER BY active DESC, label ASC`
        );
        res.json(result.rows);
    } catch (err) {
        handleError(err, res, 'List all bottleneck options');
    }
});

/**
 * POST /bottleneck-options
 * Cria nova opção de gargalo (gestor+)
 */
router.post('/bottleneck-options', async (req, res) => {
    if (!isManager(req.user)) {
        return res.status(403).json({ error: 'Acesso negado. Apenas gestores podem criar gargalos.' });
    }
    const { label } = req.body;
    if (!label || !label.trim()) {
        return res.status(400).json({ error: 'O campo "label" é obrigatório.' });
    }
    try {
        const result = await db.query(
            `INSERT INTO demand_bottleneck_options (label, created_by) VALUES ($1, $2) RETURNING *`,
            [label.trim(), req.user.name || req.user.email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleError(err, res, 'Create bottleneck option');
    }
});

/**
 * PUT /bottleneck-options/:id
 * Edita opção de gargalo (gestor+)
 */
router.put('/bottleneck-options/:id', async (req, res) => {
    if (!isManager(req.user)) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    const { label, active } = req.body;
    try {
        const fields = [];
        const values = [];
        let idx = 1;
        if (label !== undefined) { fields.push(`label = $${idx++}`); values.push(label.trim()); }
        if (active !== undefined) { fields.push(`active = $${idx++}`); values.push(active); }
        if (fields.length === 0) return res.status(400).json({ error: 'No fields to update.' });

        values.push(req.params.id);
        const result = await db.query(
            `UPDATE demand_bottleneck_options SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
            values
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Gargalo não encontrado.' });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(err, res, 'Update bottleneck option');
    }
});

/**
 * DELETE /bottleneck-options/:id
 * Desativa opção de gargalo (soft delete) (gestor+)
 */
router.delete('/bottleneck-options/:id', async (req, res) => {
    if (!isManager(req.user)) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    try {
        const result = await db.query(
            `UPDATE demand_bottleneck_options SET active = FALSE WHERE id = $1 RETURNING *`,
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Gargalo não encontrado.' });
        res.json({ message: 'Gargalo desativado com sucesso.' });
    } catch (err) {
        handleError(err, res, 'Deactivate bottleneck option');
    }
});

module.exports = router;
