// controllers/configController.js
const Config = require('../models/Config')


exports.getStripePublicKey = async (req, res) => {
  try {
    const config = await Config.findOne({ where: { key: 'STRIPE_PUBLIC_KEY' } });
    if (!config) {
      return res.status(404).json({ message: 'Clé publique Stripe non trouvée' });
    }

    const decryptedKey = Config.decrypt(config.value);
    res.json({ key: decryptedKey }); // renvoie la clé publique
  } catch (error) {
    console.error('Erreur getStripePublicKey:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

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
    const { stripeSecretKey, stripePublicKey } = req.body;
    if (!stripeSecretKey || !stripePublicKey) {
      return res.status(400).json({ message: 'Clé Stripe manquante' });
    }

    const encryptedSecret = Config.encrypt(stripeSecretKey);
    const encryptedPublic = Config.encrypt(stripePublicKey);

    // Upsert clé secrète
    await Config.upsert({ key: 'STRIPE_SECRET_KEY', value: encryptedSecret });
    // Upsert clé publique
    await Config.upsert({ key: 'STRIPE_PUBLIC_KEY', value: encryptedPublic });

    res.json({
      message: 'Clés Stripe mises à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur updateStripeKey:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
