const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const subscribeController = require('../services/subscribeService.js'); 
const {authMiddleware} = require('../middleware/auth');
const Subscribe = require('../models/Subscribe'); 
const User = require('../models/User');
const Formation = require('../models/Formation'); 

// Create a new subscription
router.post('/',authMiddleware, subscribeController.createSubscription);

// Get all subscriptions
router.get('/',authMiddleware, subscribeController.getAllSubscriptions);

// Get subscriptions by user ID
router.get('/user/:userId',authMiddleware, subscribeController.getSubscriptionsByUser);

// Delete a subscription
router.delete('/:id',authMiddleware, subscribeController.deleteSubscription);

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent',authMiddleware, async (req, res) => {
  const { amount, pourcentage, formationId, userId } = req.body;

  try {
    // Check if formation exists
    const formation = await Formation.findByPk(formationId);
    if (!formation) {
      return res.status(400).json({ message: 'Formation not found' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Create a subscription
    const subscription = await Subscribe.create({ pourcentage, formationId, userId });

    // Send the client secret and subscription details to the frontend
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      subscription,
      message: 'Payment intent created and subscription successful',
    });
  } catch (error) {
    console.error('Error creating payment intent or subscription:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
