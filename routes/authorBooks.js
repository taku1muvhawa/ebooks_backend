// ROUTES/authorBooks.js
const express = require('express');
const authorBookRouter = express.Router();
const authorBooksDb = require('../cruds/authorBooks');
const multer = require('multer');
const poolapi = require('../cruds/poolapi');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    // limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

authorBookRouter.post('/book', upload.fields([{ name: 'pdf_file', maxCount: 1 }, { name: 'cover_file', maxCount: 1 }]), async (req, res, next) => { 
    try {
        let postedValues = req.body;

        // File paths
        const pdfPath = req.files['pdf_file'] ? `${poolapi}/file/${req.files['pdf_file'][0].filename}` : null;
        const coverPath = req.files['cover_file'] ? `${poolapi}/file/${req.files['cover_file'][0].filename}` : null;

        // Call the database operation to insert the book
        let results = await authorBooksDb.postBook(
            postedValues.channel_id || null,
            postedValues.title || null,
            postedValues.author || null,
            postedValues.author_name || null,
            coverPath,
            postedValues.description || null,
            postedValues.preview_text || null,
            postedValues.preview_content || null,
            postedValues.price || 0,
            pdfPath,
            postedValues.category || null,
            postedValues.featured || false,
            postedValues.average_rating || 0,
            postedValues.total_ratings || 0
        );

        // Respond with the results
        res.json(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});


authorBookRouter.get('/:user_id', async (req, res) => {
    try {
        const books = await authorBooksDb.getBooksByAuthor(req.params.user_id);
        res.json(books);
    } catch (e) {
        console.error('GET Error:', e);
        res.status(500).json({ error: 'Failed to retrieve books' });
    }
});

authorBookRouter.put('/:id', async (req, res) => {
    try {
        const result = await authorBooksDb.updateBook(req.params.id, req.body);
        result.affectedRows > 0 
            ? res.json({ message: 'Book updated successfully' })
            : res.status(404).json({ error: 'Book not found' });
    } catch (e) {
        console.error('PUT Error:', e);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

authorBookRouter.delete('/:id', async (req, res) => {
    try {
        const result = await authorBooksDb.deleteBook(req.params.id);
        result.affectedRows > 0 
            ? res.json({ message: 'Book deleted successfully' })
            : res.status(404).json({ error: 'Book not found' });
    } catch (e) {
        console.error('DELETE Error:', e);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

module.exports = authorBookRouter;