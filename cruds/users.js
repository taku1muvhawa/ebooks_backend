const pool = require('./poolfile');

const crudsObj = {};

// Create User
crudsObj.createUser = ({ username, email, password_hash, bio, profile_pic }) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO users (
                username, 
                email, 
                password_hash, 
                bio, 
                profile_pic, 
                created_at, 
                updated_at
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [username, email, password_hash, bio, profile_pic],
            (err, result) => {
                if (err) return reject(err);
                resolve({
                    status: 201,
                    user_id: result.insertId,
                    message: 'User created successfully'
                });
            }
        );
    });
};

// Authenticate User
crudsObj.authenticateUser = (email, passwordHash) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT 
                user_id,
                username,
                email,
                bio,
                followers,
                total_sales,
                average_rating,
                profile_pic,
                created_at,
                updated_at
            FROM users 
            WHERE email = ? AND password_hash = ?`,
            [email, passwordHash],
            (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                    return resolve({ status: 401, message: 'Invalid credentials' });
                }
                resolve({
                    status: 200,
                    message: 'Login successful',
                    user: results[0]
                });
            }
        );
    });
};

// Get All Users
crudsObj.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT 
                user_id,
                username,
                email,
                bio,
                followers,
                total_sales,
                average_rating,
                profile_pic,
                created_at,
                updated_at
            FROM users`,
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

// Get User by ID
crudsObj.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT 
                user_id,
                username,
                email,
                bio,
                followers,
                total_sales,
                average_rating,
                profile_pic,
                created_at,
                updated_at
            FROM users 
            WHERE user_id = ?`,
            [userId],
            (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                    return resolve({ status: 404, message: 'User not found' });
                }
                resolve(results[0]);
            }
        );
    });
};

// Update User
crudsObj.updateUser = (userId, { username, email, bio, profile_pic }) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE users SET
                username = ?,
                email = ?,
                bio = ?,
                profile_pic = ?,
                updated_at = NOW()
            WHERE user_id = ?`,
            [username, email, bio, profile_pic, userId],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) {
                    return resolve({ status: 404, message: 'User not found' });
                }
                resolve({ status: 200, message: 'User updated successfully' });
            }
        );
    });
};

// Delete User
crudsObj.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'DELETE FROM users WHERE user_id = ?',
            [userId],
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) {
                    return resolve({ status: 404, message: 'User not found' });
                }
                resolve({ status: 200, message: 'User deleted successfully' });
            }
        );
    });
};

module.exports = crudsObj;