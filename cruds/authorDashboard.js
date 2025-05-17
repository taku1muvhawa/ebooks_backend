const pool = require('./poolfile');

module.exports = {
  getAuthorStats: (userId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT
    COUNT(DISTINCT b.book_id) AS total_books,
    COUNT(DISTINCT f.user_id) AS followers,
    COUNT(p.purchases_id) AS total_sales
      FROM books b
      LEFT JOIN followers f ON f.channel_id = ?
      LEFT JOIN purchases p ON p.book_id = b.book_id
      WHERE b.author = ?`,
        [userId, userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  checkChannel: (userId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM channels WHERE owner_id = ?`,
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
};