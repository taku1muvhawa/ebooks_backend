// CRUDS/authorBooks.js
const pool = require('./poolfile');

const authorBooksDb = {
  
 postBook: (
    channel_id,
    title,
    author,
    author_name,
    cover_url,
    description,
    preview_text,
    preview_content,
    price,
    pdf_url,
    category,
    featured,
    average_rating,
    total_ratings
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO books(
                channel_id,
                title,
                author,
                author_name,
                cover_url,
                description,
                preview_text,
                preview_content,
                price,
                pdf_url,
                category,
                featured,
                average_rating,
                total_ratings,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                channel_id,
                title,
                author,
                author_name,
                cover_url,
                description,
                preview_text,
                preview_content,
                price,
                pdf_url,
                category,
                featured,
                average_rating,
                total_ratings
            ],
            (err, result) => {
                if (err) return reject(err);
                return resolve({ 
                    status: '200', 
                    message: 'Book record added successfully',
                    book_id: result.insertId 
                });
            }
        );
    });
},

  getBooksByAuthor: (userId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM books WHERE author = ?`,
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  updateBook: (bookId, updates) => {
    return new Promise((resolve, reject) => {
      const validFields = ['title', 'description', 'price', 'category', 'status'];
      const updateFields = Object.keys(updates)
        .filter(key => validFields.includes(key))
        .map(key => `${key} = ?`)
        .join(', ');

      if (!updateFields) return reject(new Error('No valid fields to update'));

      pool.query(
        `UPDATE author_books 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP 
        WHERE book_id = ?`,
        [...Object.values(updates), bookId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  deleteBook: (bookId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM author_books WHERE book_id = ?`,
        [bookId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
};

module.exports = authorBooksDb;