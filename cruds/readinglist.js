require('dotenv').config();
const pool = require('./poolfile');

const readingListDb = {
    createReadingList: (userId, bookId, statusId, progress) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO user_reading_list 
                (user_id, book_id, status_id, progress, started_at, completed_at)
                VALUES (?, ?, ?, ?, 
                    CASE WHEN ? IN (2, 3) THEN CURRENT_TIMESTAMP ELSE NULL END,
                    CASE WHEN ? = 3 THEN CURRENT_TIMESTAMP ELSE NULL END
                )`,
                [userId, bookId, statusId, progress, statusId, statusId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve({
                        reading_id: result.insertId,
                        user_id: userId,
                        book_id: bookId,
                        status_id: statusId,
                        progress: progress,
                        added_at: new Date().toISOString()
                    });
                }
            );
        });
    },

    getReadingListByUserIdWithDetails: (userId) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT 
                    r.reading_id as id,
                    b.title,
                    b.author,
                    b.cover_url as cover,
                    r.progress,
                    DATE(r.added_at) as addedDate,
                    DATE(r.completed_at) as completedDate,
                    r.status_id
                FROM user_reading_list r
                JOIN books b ON r.book_id = b.book_id
                WHERE r.user_id = ?`,
                [userId],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    },

    updateReadingListItem: (readingId, statusId, progress) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE user_reading_list 
                SET 
                    status_id = ?,
                    progress = ?,
                    started_at = CASE WHEN ? IN (2, 3) AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
                    completed_at = CASE WHEN ? = 3 THEN CURRENT_TIMESTAMP ELSE completed_at END
                WHERE reading_id = ?`,
                [statusId, progress, statusId, statusId, readingId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    deleteReadingList: (readingId) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM user_reading_list WHERE reading_id = ?`,
                [readingId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    }
};

module.exports = readingListDb;

// // CRUDS/readinglist.js
// require('dotenv').config();
// const pool = require('./poolfile');

// const readingListDb = {
//   createReadingList: (userId, bookId, statusId, progress) => {
//     return new Promise((resolve, reject) => {
//       pool.query(
//         `INSERT INTO user_reading_list 
//         (user_id, book_id, status_id, progress, started_at, completed_at)
//         VALUES (?, ?, ?, ?, 
//           CASE WHEN ? IN (2, 3) THEN CURRENT_TIMESTAMP ELSE NULL END,
//           CASE WHEN ? = 3 THEN CURRENT_TIMESTAMP ELSE NULL END
//         )`,
//         [userId, bookId, statusId, progress, statusId, statusId],
//         (err, result) => {
//           if (err) return reject(err);
//           resolve({
//             reading_id: result.insertId,
//             user_id: userId,
//             book_id: bookId,
//             status_id: statusId,
//             progress: progress,
//             added_at: new Date().toISOString()
//           });
//         }
//       );
//     });
//   },

//   getAllReadingLists: () => {
//     return new Promise((resolve, reject) => {
//       pool.query(
//         `SELECT * FROM user_reading_list`,
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results);
//         }
//       );
//     });
//   },

//   getReadingListById: (userId) => {
//     return new Promise((resolve, reject) => {
//       pool.query(
//         `SELECT * FROM user_reading_list WHERE user_id = ?`,
//         [userId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results);
//         }
//       );
//     });
//   },

//   deleteReadingList: (readingId) => {
//     return new Promise((resolve, reject) => {
//       pool.query(
//         `DELETE FROM user_reading_list WHERE reading_id = ?`,
//         [readingId],
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result);
//         }
//       );
//     });
//   }
// };

// module.exports = readingListDb;