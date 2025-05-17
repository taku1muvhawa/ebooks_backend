const express = require('express');
const userRouter = express.Router();
const usersDbOperations = require('../cruds/users');
const crypto = require('crypto');
const { generateToken } = require('../utilities/jwtUtils');

// Create User
userRouter.post('/', async (req, res) => {
    try {
        const { username, email, password, bio, profile_pic } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        
        const result = await usersDbOperations.createUser({
            username,
            email,
            password_hash: hashedPassword,
            bio,
            profile_pic
        });
        
        res.status(result.status).json(result);
    } catch (e) {
        console.error('Create User Error:', e);
        res.status(500).json({ error: 'Server error creating user' });
    }
});

// Login
userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const result = await usersDbOperations.authenticateUser(email, hashedPassword);

        if (!result.user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(result.user);
        res.json({
            ...result,
            token,
            user: {
                ...result.user,
                password_hash: undefined
            }
        });
    } catch (e) {
        console.error('Login Error:', e);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get All Users
userRouter.get('/', async (req, res) => {
    try {
        const results = await usersDbOperations.getAllUsers();
        res.json(results.map(user => ({
            ...user,
            password_hash: undefined
        })));
    } catch (e) {
        console.error('Get Users Error:', e);
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

// Get User by ID
userRouter.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await usersDbOperations.getUserById(userId);
        
        if (result.status === 404) {
            return res.status(404).json(result);
        }
        
        res.json({
            ...result,
            password_hash: undefined
        });
    } catch (e) {
        console.error('Get User Error:', e);
        res.status(500).json({ error: 'Server error fetching user' });
    }
});

// Update User
userRouter.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, bio, profile_pic } = req.body;
        
        const result = await usersDbOperations.updateUser(userId, {
            username,
            email,
            bio,
            profile_pic
        });
        
        res.json(result);
    } catch (e) {
        console.error('Update User Error:', e);
        res.status(500).json({ error: 'Server error updating user' });
    }
});

// Delete User
userRouter.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await usersDbOperations.deleteUser(userId);
        res.json(result);
    } catch (e) {
        console.error('Delete User Error:', e);
        res.status(500).json({ error: 'Server error deleting user' });
    }
});

module.exports = userRouter;