const express = require('express');
const router = express.Router();
const subscribeController = require('../services/subscribeService.js'); 
const {authMiddleware} = require('../middleware/auth');

// Create a new subscription
router.post('/',authMiddleware, subscribeController.createSubscription);

// Get all subscriptions
router.get('/',authMiddleware, subscribeController.getAllSubscriptions);

// Get subscriptions by user ID
router.get('/user/:userId',authMiddleware, subscribeController.getSubscriptionsByUser);

// Delete a subscription
router.delete('/:id',authMiddleware, subscribeController.deleteSubscription);

module.exports = router;
