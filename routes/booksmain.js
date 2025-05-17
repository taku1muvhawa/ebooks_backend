const express = require('express');
const booksMainRouter = express.Router();
const booksDbOperations = require('../cruds/booksmain');

// Get all books (public)
booksMainRouter.get('/', async (req, res) => {
    try {
        const books = await booksDbOperations.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Get book by ID (public)
booksMainRouter.get('/:id', async (req, res) => {
    try {
        const book = await booksDbOperations.getBookById(req.params.id);
        res.json(book);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch book' });
        }
    }
});

// Create new book (admin only)
booksMainRouter.post('/', async (req, res) => {
    try {
        // Add validation for admin role here
        const { title, author, cover_url, description, preview_content, price, category } = req.body;
        const result = await booksDbOperations.createBook(title, author, cover_url, description, preview_content, price, category);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// Update book (admin only)
booksMainRouter.put('/:id', async (req, res) => {
    try {
        // Add validation for admin role here
        const { title, author, cover_url, description, preview_content, price, category } = req.body;
        const result = await booksDbOperations.updateBook(
            req.params.id, 
            title, author, cover_url, description, preview_content, price, category
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update book' });
        }
    }
});

// Delete book (admin only)
booksMainRouter.delete('/:id', async (req, res) => {
    try {
        // Add validation for admin role here
        const result = await booksDbOperations.deleteBook(req.params.id);
        res.json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to delete book' });
        }
    }
});

// Get recommended books (authenticated)
booksMainRouter.get('/recommended/bk', async (req, res) => {

    console.log('Point 1');
    const userId = 1;

    try {
        const books = await booksDbOperations.getRecommendedBooks(userId);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recommended books' });
    }
});

// Get top selling books (public)
booksMainRouter.get('/top-selling', async (req, res) => {
    try {
        const books = await booksDbOperations.getTopSellingBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch top selling books' });
    }
});

// Get recently added books (public)
booksMainRouter.get('/recent', async (req, res) => {
    try {
        const books = await booksDbOperations.getRecentlyAddedBooks();
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recently added books' });
    }
});

// Add book to library (authenticated)
booksMainRouter.post('/library/:bookId', async (req, res) => {
    try {
        const result = await booksDbOperations.addToLibrary(req.user.userId, req.params.bookId);
        res.json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book already in library') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to add book to library' });
        }
    }
});

// Get user library (authenticated)
booksMainRouter.get('/library', async (req, res) => {
    try {
        const books = await booksDbOperations.getUserLibrary(req.user.userId);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user library' });
    }
});

// Add to wishlist (authenticated)
booksMainRouter.post('/wishlist/:bookId', async (req, res) => {
    try {
        const result = await booksDbOperations.addToWishlist(req.user.userId, req.params.bookId);
        res.json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book already in wishlist') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to add book to wishlist' });
        }
    }
});

// Get user wishlist (authenticated)
booksMainRouter.get('/wishlist', async (req, res) => {
    try {
        const books = await booksDbOperations.getUserWishlist(req.user.userId);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Add to reading list (authenticated)
booksMainRouter.post('/reading-list/:bookId', async (req, res) => {
    try {
        const result = await booksDbOperations.addToReadingList(req.user.userId, req.params.bookId);
        res.json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Book already in reading list') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to add book to reading list' });
        }
    }
});

// Get user reading list (authenticated)
booksMainRouter.get('/reading-list', async (req, res) => {
    try {
        const books = await booksDbOperations.getUserReadingList(req.user.userId);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reading list' });
    }
});

// Get user stats (authenticated)
booksMainRouter.get('/stats', async (req, res) => {
    try {
        const stats = await booksDbOperations.getUserStats(req.user.userId);
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// Get user library with ratings
booksMainRouter.get('/library/enhanced', async (req, res) => {
    try {
        const library = await booksDbOperations.getEnhancedUserLibrary(req.user.userId);
        res.json(library);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch enhanced library' });
    }
});

// Update user rating
booksMainRouter.put('/rate/:bookId', async (req, res) => {
    try {
        const { rating } = req.body;
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ error: 'Invalid rating value' });
        }
        
        const result = await booksDbOperations.updateUserRating(
            req.user.userId,
            req.params.bookId,
            rating
        );
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rating' });
    }
});

// Get PDF URL endpoint
booksMainRouter.get('/:id/pdf', async (req, res) => {
    try {
        const book = await booksDbOperations.getBookById(req.params.id);
        res.json({ pdfUrl: book.pdf_url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get PDF URL' });
    }
});

// Redaing List

// Get user's reading list
booksMainRouter.get('/reading-list/get/all/bks', async (req, res) => {
    console.log('Point 111');
    try {
        const readingList = await booksDbOperations.getUserReadingList2();
        res.json(readingList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reading list' });
    }
});

// Update reading list item
booksMainRouter.put('/reading-list/:bookId', async (req, res) => {
    try {
        const { status, progress } = req.body;
        await booksDbOperations.updateReadingListItem(
            req.user.userId,
            req.params.bookId,
            status,
            progress
        );
        res.json({ message: 'Reading list updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update reading list' });
    }
});

// Add to reading list
booksMainRouter.post('/reading-list/:bookId', async (req, res) => {
    try {
        const { status } = req.body;
        await booksDbOperations.addToReadingList(
            req.user.userId,
            req.params.bookId,
            status || 'WANT_TO_READ'
        );
        res.json({ message: 'Book added to reading list' });
    } catch (error) {
        console.error(error);
        if (error.message === 'Book already in reading list') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to add to reading list' });
        }
    }
});

// Remove from reading list
booksMainRouter.delete('/reading-list/:bookId', async (req, res) => {
    try {
        await booksDbOperations.removeFromReadingList(
            req.user.userId,
            req.params.bookId
        );
        res.json({ message: 'Book removed from reading list' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove from reading list' });
    }
});


module.exports = booksMainRouter;