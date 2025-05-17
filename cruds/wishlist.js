// CRUDS/wishlist.js
require('dotenv').config();
const pool = require('./poolfile');

const wishlistDb = {
  createWishlist: (userId, bookId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO wishlist (user_id, book_id) 
        VALUES (?, ?)`,
        [userId, bookId],
        (err, result) => {
          if (err) return reject(err);
          resolve({
            id: result.insertId,
            user_id: userId,
            book_id: bookId,
            added_at: new Date().toISOString()
          });
        }
      );
    });
  },

  getAllWishlists: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM wishlist`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getWishlistById: (userId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM wishlist WHERE user_id = ?`,
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  deleteWishlist: (wishlistId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM wishlist WHERE wishlist_id = ?`,
        [wishlistId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
};

module.exports = wishlistDb;