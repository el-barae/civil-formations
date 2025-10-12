const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const subscribeController = require('../services/subscribeService.js'); 
const {authMiddleware} = require('../middleware/auth');
const Subscribe = require('../models/Subscribe'); 
const User = require('../models/User');
const Formation = require('../models/Formation'); 
const Config = require('../models/Config');


// Create a new subscription
router.post('/',authMiddleware, subscribeController.createSubscription);

// Get all subscriptions
router.get('/',authMiddleware, subscribeController.getAllSubscriptions);

// Get subscriptions by user ID
router.get('/user/:userId',authMiddleware, subscribeController.getSubscriptionsByUser);

// Delete a subscription
router.delete('/:id',authMiddleware, subscribeController.deleteSubscription);


const MIN_AMOUNT = 0.1; 

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  const { amount, pourcentage, formationId, userId } = req.body;


  if (!amount || amount < MIN_AMOUNT) {
    return res.status(400).json({ message: `Le montant doit être au moins ${MIN_AMOUNT} USD` });
  }

  try {
    const config = await Config.findOne({ where: { key: 'STRIPE_SECRET_KEY' } });
    if (!config) return res.status(400).json({ message: 'Clé Stripe non configurée' });

    const stripeSecretKey = Config.decrypt(config.value);
    const stripe = require('stripe')(stripeSecretKey);

    const formation = await Formation.findByPk(formationId);
    if (!formation) return res.status(404).json({ message: 'Formation not found' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const amountInCents = Math.round(amount * 100); // ✅ conversion en cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        formationId: formationId.toString(),
        userId: userId.toString(),
        pourcentage: pourcentage.toString(),
      },
    });

    const subscription = await Subscribe.create({
      pourcentage,
      formationId,
      userId,
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      subscription,
      message: 'Payment intent created successfully',
    });

  } catch (error) {
    console.error('Server Error creating payment intent:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});


module.exports = router;
