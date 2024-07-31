const express = require('express');
const router = express.Router();
const subscribeController = require('../services/subscribeService.js'); 
// Create a new subscription
router.post('/', subscribeController.createSubscription);

// Get all subscriptions
router.get('/', subscribeController.getAllSubscriptions);

// Get subscriptions by user ID
router.get('/user/:userId', subscribeController.getSubscriptionsByUser);

// Delete a subscription
router.delete('/:id', subscribeController.deleteSubscription);

module.exports = router;
