// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../services/userService');
const {authMiddleware, authorizeRoles} = require('../middleware/auth');

// Get user profile
router.get('/profile/:id', authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/profile/:id', authMiddleware, userController.updateUserProfile);

// Get all clients
router.get('/clients', authMiddleware, authorizeRoles('ADMIN'), userController.getAllClients);

// Get client details with subscribes
router.get('/clients/:id', authMiddleware, authorizeRoles('ADMIN'), userController.getClientDetails);

// Delete client
router.delete('/clients/:id', authMiddleware, authorizeRoles('ADMIN'), userController.deleteClient);

router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;