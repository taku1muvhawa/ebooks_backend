// ROUTES/authorDashboard.js
const express = require('express');
const authorDashRouter = express.Router();
const dashboardDb = require('../cruds/authorDashboard');

authorDashRouter.get('/stats/:user_id', async (req, res) => {
    try {
        const stats = await dashboardDb.getAuthorStats(req.params.user_id);
        res.json(stats);
    } catch (e) {
        console.error('GET Stats Error:', e);
        res.status(500).json({ error: 'Failed to load dashboard stats' });
    }
});

authorDashRouter.get('/check/channel/:user_id', async (req, res) => {
    try {
        const stats = await dashboardDb.checkChannel(req.params.user_id);
        res.json(stats);
    } catch (e) {
        console.error('GET Stats Error:', e);
        res.status(500).json({ error: 'Failed to load dashboard stats' });
    }
});

module.exports = authorDashRouter;