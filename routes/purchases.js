// ROUTES/purchases.js
const express = require('express');
const purchasesRouter = express.Router();
const purchasesDbOperations = require('../cruds/purchases');

purchasesRouter.post('/', async (req, res) => {
    try {
        const { user_id, book_id } = req.body;
        const result = await purchasesDbOperations.createPurchase(user_id, book_id);
        res.status(201).json(result);
    } catch (e) {
        console.error('POST Error:', e);
        res.status(500).json({ error: 'Failed to create purchase' });
    }
});

purchasesRouter.get('/', async (req, res) => {
    try {
        const purchases = await purchasesDbOperations.getAllPurchases();
        res.json(purchases);
    } catch (e) {
        console.error('GET All Error:', e);
        res.status(500).json({ error: 'Failed to retrieve purchases' });
    }
});

purchasesRouter.get('/:id', async (req, res) => {
    try {
        const purchase = await purchasesDbOperations.getPurchaseById(req.params.id);
        purchase ? res.json(purchase) : res.status(404).json({ error: 'Purchase not found' });
    } catch (e) {
        console.error('GET By ID Error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

purchasesRouter.delete('/:id', async (req, res) => {
    try {
        const result = await purchasesDbOperations.deletePurchase(req.params.id);
        result.affectedRows > 0 
            ? res.json({ message: 'Purchase deleted successfully' })
            : res.status(404).json({ error: 'Purchase not found' });
    } catch (e) {
        console.error('DELETE Error:', e);
        res.status(500).json({ error: 'Failed to delete purchase' });
    }
});

module.exports = purchasesRouter;