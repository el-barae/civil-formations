// controllers/configController.js
const Config = require('../models/Config')

// ✅ Récupérer la clé Stripe déchiffrée
exports.getStripeKey = async (req, res) => {
  try {
    const config = await Config.findOne({ where: { key: 'STRIPE_SECRET_KEY' } });
    if (!config) {
      return res.status(404).json({ message: 'Clé Stripe non trouvée' });
    }

    const decryptedKey = Config.decrypt(config.value);
    res.json({ stripeSecretKey: decryptedKey });
  } catch (error) {
    console.error('Erreur getStripeKey:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// ✅ Mettre à jour ou créer la clé Stripe chiffrée
exports.updateStripeKey = async (req, res) => {
  try {
    const { stripeSecretKey } = req.body;
    if (!stripeSecretKey) {
      return res.status(400).json({ message: 'Clé Stripe manquante' });
    }

    const encryptedKey = Config.encrypt(stripeSecretKey);

    const [config, created] = await Config.upsert({
      key: 'STRIPE_SECRET_KEY',
      value: encryptedKey,
    });

    res.json({
      message: created ? 'Clé Stripe créée avec succès' : 'Clé Stripe mise à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur updateStripeKey:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};