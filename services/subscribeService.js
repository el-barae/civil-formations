const Subscribe = require('../models/Subscribe'); 
const User = require('../models/User');
const Formation = require('../models/Formation'); 

// Create a new subscription
exports.createSubscription = async (req, res) => {
  const { pourcentage, formationId, userId } = req.body;
  try {
    const subscription = await Subscribe.create({ pourcentage, formationId, userId });
    res.status(201).json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscribe.findAll({ include: [User, Formation] });
    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get subscriptions by user ID
exports.getSubscriptionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const subscriptions = await Subscribe.findAll({ where: { userId }, include: [Formation] });
    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscribe.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    await subscription.destroy();
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
