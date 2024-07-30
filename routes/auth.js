const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../services/authService');
const auth = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', auth, logout);

module.exports = router;
