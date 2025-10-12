const express = require('express');
const router = express.Router();
const configController = require('../services/configService');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const Config = require('../models/Config')

router.get('/stripe-public-key', configController.getStripePublicKey);

router.get('/stripe-key', authMiddleware, authorizeRoles('ADMIN'), configController.getStripeKey);
router.put('/stripe-key', authMiddleware, authorizeRoles('ADMIN'), configController.updateStripeKey);

router.post('/stripe-key/setup', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { stripeSecretKey, stripePublicKey } = req.body;

    if (!stripeSecretKey || !stripePublicKey) {
      return res.status(400).json({ message: 'Clés Stripe manquantes' });
    }

    const encryptedSecret = Config.encrypt(stripeSecretKey);
    const encryptedPublic = Config.encrypt(stripePublicKey);

    // Setup ou update clé secrète
    const existingSecret = await Config.findOne({ where: { key: 'STRIPE_SECRET_KEY' } });
    if (existingSecret) {
      await existingSecret.update({ value: encryptedSecret });
    } else {
      await Config.create({ key: 'STRIPE_SECRET_KEY', value: encryptedSecret });
    }

    // Setup ou update clé publique
    const existingPublic = await Config.findOne({ where: { key: 'STRIPE_PUBLIC_KEY' } });
    if (existingPublic) {
      await existingPublic.update({ value: encryptedPublic });
    } else {
      await Config.create({ key: 'STRIPE_PUBLIC_KEY', value: encryptedPublic });
    }

    res.json({ message: '✅ Clés Stripe enregistrées avec succès dans la base de données.' });
  } catch (error) {
    console.error('Erreur setup Stripe key:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


module.exports = router;
