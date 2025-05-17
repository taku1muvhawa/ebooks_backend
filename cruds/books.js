require('dotenv').config();
const pool = require('./poolfile');

let booksObj = {};

// Create a new book
booksObj.createBook = (title, author, cover_url, pdf_url, description, preview_content, price, category) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO books(title, author, cover_url, pdf_url, description, preview_content, price, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, author, cover_url, pdf_url, description, preview_content, price, category],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ status: 200, message: 'Book created successfully', bookId: result.insertId });
            }
        );
    });
};

// Get all books
booksObj.getAllBooks = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM books', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get books by user ID
booksObj.getBookById = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT ul.*, b.*, u.username AS authorName FROM user_library ul JOIN books b ON b.book_id = ul.book_id JOIN users u ON b.author = u.user_id WHERE ul.user_id = ?', [userId], (err, results) => {
            if (err) return reject(err);
            // if (results.length === 0) return reject(new Error('Book not found'));
            return resolve(results);
        });
    });
};

// Update book
booksObj.updateBook = (bookId, title, author, cover_url, description, preview_content, price, category) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE books SET title = ?, author = ?, cover_url = ?, description = ?, preview_content = ?, price = ?, category = ? WHERE book_id = ?',
            [title, author, cover_url, description, preview_content, price, category, bookId],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject(new Error('Book not found'));
                return resolve({ status: 200, message: 'Book updated successfully' });
            }
        );
    });
};

// Delete book
booksObj.deleteBook = (bookId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM books WHERE book_id = ?', [bookId], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error('Book not found'));
            return resolve({ status: 200, message: 'Book deleted successfully' });
        });
    });
};

// Get recommended books for user
booksObj.getRecommendedBooks = (userId) => {
    return new Promise((resolve, reject) => {
        // In a real app, this would be more sophisticated based on user preferences
        // For now, just return top rated books

        console.log('Point 2');

        pool.query('SELECT * FROM books ORDER BY average_rating DESC LIMIT 10', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get top selling books
booksObj.getTopSellingBooks = () => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT b.*, COUNT(ul.book_id) as sales_count 
            FROM books b
            LEFT JOIN user_library ul ON b.book_id = ul.book_id
            GROUP BY b.book_id
            ORDER BY sales_count DESC
            LIMIT 10
        `, (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get recently added books
booksObj.getRecentlyAddedBooks = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 10', (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Add book to user library
booksObj.addToLibrary = (userId, bookId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO user_library (user_id, book_id) VALUES (?, ?)',
            [userId, bookId],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject(new Error('Book already in library'));
                    }
                    return reject(err);
                }
                return resolve({ status: 200, message: 'Book added to library' });
            }
        );
    });
};

// Get user library
booksObj.getUserLibrary = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT b.* 
            FROM books b
            JOIN user_library ul ON b.book_id = ul.book_id
            WHERE ul.user_id = ?
        `, [userId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Add to wishlist
booksObj.addToWishlist = (userId, bookId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)',
            [userId, bookId],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject(new Error('Book already in wishlist'));
                    }
                    return reject(err);
                }
                return resolve({ status: 200, message: 'Book added to wishlist' });
            }
        );
    });
};

// Get user wishlist
booksObj.getUserWishlist = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT b.* 
            FROM books b
            JOIN wishlist w ON b.book_id = w.book_id
            WHERE w.user_id = ?
        `, [userId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Add to reading list
booksObj.addToReadingList = (userId, bookId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO reading_list (user_id, book_id) VALUES (?, ?)',
            [userId, bookId],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject(new Error('Book already in reading list'));
                    }
                    return reject(err);
                }
                return resolve({ status: 200, message: 'Book added to reading list' });
            }
        );
    });
};

// Get user reading list
booksObj.getUserReadingList = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT b.* 
            FROM books b
            // JOIN reading_list rl ON b.book_id = rl.book_id
            // WHERE rl.user_id = 1
        `, [userId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Get user stats
booksObj.getUserStats = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM user_library WHERE user_id = ?) as library_count,
                (SELECT COUNT(*) FROM reading_list WHERE user_id = ?) as reading_list_count,
                (SELECT COUNT(*) FROM wishlist WHERE user_id = ?) as wishlist_count,
                (SELECT COUNT(*) FROM user_library WHERE user_id = ?) as purchases_count
        `, [userId, userId, userId, userId], (err, results) => {
            if (err) return reject(err);
            return resolve(results[0]);
        });
    });
};

// Get user-specific book ratings
booksObj.getUserBookRatings = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT b.book_id, COALESCE(ubr.rating, 0) as user_rating
            FROM books b
            LEFT JOIN user_book_ratings ubr 
                ON b.book_id = ubr.book_id 
                AND ubr.user_id = ?
        `, [userId], (err, results) => {
            if (err) return reject(err);
            const ratingsMap = results.reduce((acc, { book_id, user_rating }) => {
                acc[book_id] = user_rating;
                return acc;
            }, {});
            return resolve(ratingsMap);
        });
    });
};

// Update user rating
booksObj.updateUserRating = (userId, bookId, rating) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            INSERT INTO user_book_ratings (user_id, book_id, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = ?
        `, [userId, bookId, rating, rating], (err, result) => {
            if (err) return reject(err);
            return resolve({ status: 200, message: 'Rating updated' });
        });
    });
};

// Get complete library data with ratings
booksObj.getEnhancedUserLibrary = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT 
                b.*,
                COALESCE(ubr.rating, 0) as user_rating,
                COUNT(ul.book_id) as total_readers
            FROM user_library ul
            JOIN books b ON ul.book_id = b.book_id
            LEFT JOIN user_book_ratings ubr 
                ON ul.user_id = ubr.user_id 
                AND ul.book_id = ubr.book_id
            WHERE ul.user_id = ?
            GROUP BY b.book_id
        `, [userId], (err, results) => {
            if (err) return reject(err);
            return resolve(results);
        });
    });
};

// Reading List

// Get user's reading list grouped by status
booksObj.getUserReadingList2 = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`

             SELECT 
                rl.reading_id, rl.user_id, rl.book_id, 
                rl.progress, rl.added_at, rl.started_at, rl.completed_at,
                st.name as status,
                b.title, b.author, b.cover_url, b.pdf_url, b.category
            FROM user_reading_list rl
            JOIN reading_status_types st ON rl.status_id = st.status_id
            JOIN books b ON rl.book_id = b.book_id
            WHERE rl.user_id = 1001
            ORDER BY st.status_id, rl.added_at DESC

        `, [userId], (err, results) => {
            if (err) return reject(err);
            
            // Group by status
            // const grouped = {
            //     WANT_TO_READ: [],
            //     CURRENTLY_READING: [],
            //     COMPLETED: []
            // };
            
            // results.forEach(item => {
            //     grouped[item.status].push(item);
            // });
            
            // resolve(grouped);
            resolve(results);
        });
    });
},

// Add to reading list
booksObj.addToReadingList = (userId, bookId, status) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            INSERT INTO user_reading_list (user_id, book_id, status_id)
            SELECT ?, ?, status_id 
            FROM reading_status_types 
            WHERE name = ?
        `, [userId, bookId, status], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return reject(new Error('Book already in reading list'));
                }
                return reject(err);
            }
            resolve();
        });
    });
},

// Update reading list item
booksObj.updateReadingListItem = (userId, bookId, status, progress) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            UPDATE user_reading_list rl
            JOIN reading_status_types st ON st.name = ?
            SET 
                rl.status_id = st.status_id,
                rl.progress = ?,
                rl.started_at = IF(st.name = 'CURRENTLY_READING' AND rl.started_at IS NULL, NOW(), rl.started_at),
                rl.completed_at = IF(st.name = 'COMPLETED' AND rl.completed_at IS NULL, NOW(), rl.completed_at)
            WHERE rl.user_id = ? AND rl.book_id = ?
        `, [status, progress, userId, bookId], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) {
                return reject(new Error('Book not found in reading list'));
            }
            resolve();
        });
    });
},

// Remove from reading list
booksObj.removeFromReadingList = (userId, bookId) => {
    return new Promise((resolve, reject) => {
        pool.query(`
            DELETE FROM user_reading_list 
            WHERE user_id = ? AND book_id = ?
        `, [userId, bookId], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) {
                return reject(new Error('Book not found in reading list'));
            }
            resolve();
        });
    });
}


module.exports = booksObj;