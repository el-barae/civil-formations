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

const MIN_AMOUNT = 0.20; 

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  const { amount, pourcentage, formationId, userId } = req.body;

  // Validation du montant
  if (!amount || amount < MIN_AMOUNT) {
    return res.status(400).json({ 
      message: `Le montant doit être au moins ${MIN_AMOUNT} €` 
    });
  }

  try {
    // Validation des entrées
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    // Check if formation exists
    const formation = await Formation.findByPk(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calcul du montant réel
    const amountInCents = Math.round(amount * 1);

    try {
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          formationId: formationId.toString(),
          userId: userId.toString(),
          pourcentage: pourcentage.toString()
        }
      });

      // Create a subscription
      const subscription = await Subscribe.create({ 
        pourcentage, 
        formationId, 
        userId,
        stripePaymentIntentId: paymentIntent.id
      });

      // Logging
      console.log('Payment Intent Created:', {
        id: paymentIntent.id,
        amount: amountInCents,
        subscription: subscription.id
      });

      // Send the client secret and subscription details to the frontend
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        subscription,
        message: 'Payment intent created and subscription successful',
      });

    } catch (stripeError) {
      console.error('Stripe Error:', stripeError);
      res.status(500).json({ 
        message: 'Erreur de traitement du paiement', 
        error: stripeError.message 
      });
    }

  } catch (error) {
    console.error('Server Error creating payment intent or subscription:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur', 
      error: error.message 
    });
  }
});

module.exports = router;
