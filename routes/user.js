const express = require('express');
const router = express.Router();
const userController = require('../services/userService');
const {authMiddleware} = require('../middleware/auth');


// Get user profile
router.get('/profile/:id',authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/profile/:id',authMiddleware, userController.updateUserProfile);

module.exports = router;
