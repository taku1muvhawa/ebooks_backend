// CRUDS/purchases.js
require('dotenv').config();
const pool = require('./poolfile');

const purchasesDb = {
  createPurchase: (userId, bookId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO purchases (user_id, book_id) 
        VALUES (?, ?)`,
        [userId, bookId],
        (err, result) => {
          if (err) return reject(err);
          resolve({
            id: result.insertId,
            user_id: userId,
            book_id: bookId,
            date: new Date().toISOString()
          });
        }
      );
    });
  },

  getAllPurchases: () => {
    return new Promise((resolve, reject) => {
      pool.query(
        /*`SELECT p.purchases_id, p.user_id, p.book_id, p.date,
                b.title AS book_title, u.username
         FROM purchases p
         JOIN books b ON p.book_id = b.book_id
         JOIN users u ON p.user_id = u.user_id` */
         `SELECT * FROM purchases`,         
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getPurchaseById: (user_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM purchases WHERE user_id = ?`,
        [user_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  deletePurchase: (purchaseId) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM purchases WHERE purchases_id = ?`,
        [purchaseId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }
};

module.exports = purchasesDb;