const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../services/authService');
const {authMiddleware} = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', authMiddleware, logout);

module.exports = router;
