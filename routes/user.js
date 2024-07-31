const express = require('express');
const router = express.Router();
const userController = require('../services/userService');

// Get user profile
router.get('/profile/:id', userController.getUserProfile);

// Update user profile
router.put('/profile/:id', userController.updateUserProfile);

module.exports = router;
