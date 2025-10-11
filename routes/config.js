const express = require('express');
const router = express.Router();
const configController = require('../services/configService');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const Config = require('../models/Config')

router.get('/stripe-key', authMiddleware, authorizeRoles('ADMIN'), configController.getStripeKey);
router.put('/stripe-key', authMiddleware, authorizeRoles('ADMIN'), configController.updateStripeKey);

router.post('/stripe-key/setup', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const stripeKey = 'sk_test_51PtCVpRobdDMpPtbDrhZ1xlQRVopsW13XL8nl8O9iZjmyJZ11kuYiObLOcKVMU8iOtto0xP2EtYkGr9hQs4rZxOZ00DGiIzFCt';

    const encryptedKey = Config.encrypt(stripeKey);
    const existing = await Config.findOne({ where: { key: 'STRIPE_SECRET_KEY' } });

    if (existing) {
      await existing.update({ value: encryptedKey });
    } else {
      await Config.create({ key: 'STRIPE_SECRET_KEY', value: encryptedKey });
    }

    res.json({ message: '✅ Clé Stripe enregistrée avec succès dans la base de données.' });
  } catch (error) {
    console.error('Erreur setup Stripe key:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
