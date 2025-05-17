const express = require('express');
const readingListRouter = express.Router();
const readingListDb = require('../cruds/readinglist');

// Get reading list by user ID with book details
readingListRouter.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const listItems = await readingListDb.getReadingListByUserIdWithDetails(userId);
        
        if (listItems.length > 0) {
            // Organize by status
            const organized = {
                "Currently Reading": listItems.filter(item => item.status_id === 2),
                "Want to Read": listItems.filter(item => item.status_id === 1),
                "Completed": listItems.filter(item => item.status_id === 3)
            };
            res.json(organized);
        } else {
            res.json({
                "Currently Reading": [],
                "Want to Read": [],
                "Completed": []
            });
        }
    } catch (e) {
        console.error('GET By User ID Error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add book to reading list
readingListRouter.post('/', async (req, res) => {
    try {
        const { user_id, book_id, status_id, progress } = req.body;
        const result = await readingListDb.createReadingList(user_id, book_id, status_id, progress || 0);
        res.status(201).json(result);
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Book already in reading list' });
        }
        console.error('POST Error:', e);
        res.status(500).json({ error: 'Failed to add to reading list' });
    }
});

// Update reading list item
readingListRouter.put('/:id', async (req, res) => {
    try {
        const { status_id, progress } = req.body;
        const result = await readingListDb.updateReadingListItem(req.params.id, status_id, progress);
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Reading list item updated successfully' });
        } else {
            res.status(404).json({ error: 'Reading list item not found' });
        }
    } catch (e) {
        console.error('PUT Error:', e);
        res.status(500).json({ error: 'Failed to update reading list item' });
    }
});

// Delete reading list item
readingListRouter.delete('/:id', async (req, res) => {
    try {
        const result = await readingListDb.deleteReadingList(req.params.id);
        result.affectedRows > 0 
            ? res.json({ message: 'Reading list item deleted successfully' })
            : res.status(404).json({ error: 'Reading list item not found' });
    } catch (e) {
        console.error('DELETE Error:', e);
        res.status(500).json({ error: 'Failed to delete reading list item' });
    }
});

module.exports = readingListRouter;

// // ROUTES/readinglist.js
// const express = require('express');
// const readingListRouter = express.Router();
// const readingListDb = require('../cruds/readinglist');

// readingListRouter.post('/', async (req, res) => {
//     try {
//         const { user_id, book_id, status_id, progress } = req.body;
//         const result = await readingListDb.createReadingList(user_id, book_id, status_id, progress);
//         res.status(201).json(result);
//     } catch (e) {
//         if (e.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ error: 'Book already in reading list' });
//         }
//         console.error('POST Error:', e);
//         res.status(500).json({ error: 'Failed to add to reading list' });
//     }
// });

// readingListRouter.get('/', async (req, res) => {
//     try {
//         const readingList = await readingListDb.getAllReadingLists();
//         res.json(readingList);
//     } catch (e) {
//         console.error('GET All Error:', e);
//         res.status(500).json({ error: 'Failed to retrieve reading list' });
//     }
// });

// readingListRouter.get('/:id', async (req, res) => {
//     try {
//         const listItems = await readingListDb.getReadingListById(req.params.id);
//         listItems.length > 0 
//             ? res.json(listItems) 
//             : res.status(404).json({ error: 'No reading list items found' });
//     } catch (e) {
//         console.error('GET By ID Error:', e);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// readingListRouter.delete('/:id', async (req, res) => {
//     try {
//         const result = await readingListDb.deleteReadingList(req.params.id);
//         result.affectedRows > 0 
//             ? res.json({ message: 'Reading list item deleted successfully' })
//             : res.status(404).json({ error: 'Reading list item not found' });
//     } catch (e) {
//         console.error('DELETE Error:', e);
//         res.status(500).json({ error: 'Failed to delete reading list item' });
//     }
// });

// module.exports = readingListRouter;