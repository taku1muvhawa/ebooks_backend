// ROUTES/wishlist.js
const express = require('express');
const wishlistRouter = express.Router();
const wishlistDbOperations = require('../cruds/wishlist');

wishlistRouter.post('/', async (req, res) => {
    try {
        const { user_id, book_id } = req.body;
        const result = await wishlistDbOperations.createWishlist(user_id, book_id);
        res.status(201).json(result);
    } catch (e) {
        console.error('POST Error:', e);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

wishlistRouter.get('/', async (req, res) => {
    try {
        const wishlist = await wishlistDbOperations.getAllWishlists();
        res.json(wishlist);
    } catch (e) {
        console.error('GET All Error:', e);
        res.status(500).json({ error: 'Failed to retrieve wishlist' });
    }
});

wishlistRouter.get('/:id', async (req, res) => {
    try {
        const wishlistItems = await wishlistDbOperations.getWishlistById(req.params.id);
        wishlistItems.length > 0 
            ? res.json(wishlistItems) 
            : res.status(404).json({ error: 'No wishlist items found' });
    } catch (e) {
        console.error('GET By ID Error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

wishlistRouter.delete('/:id', async (req, res) => {
    try {
        const result = await wishlistDbOperations.deleteWishlist(req.params.id);
        result.affectedRows > 0 
            ? res.json({ message: 'Wishlist item deleted successfully' })
            : res.status(404).json({ error: 'Wishlist item not found' });
    } catch (e) {
        console.error('DELETE Error:', e);
        res.status(500).json({ error: 'Failed to delete wishlist item' });
    }
});

module.exports = wishlistRouter;