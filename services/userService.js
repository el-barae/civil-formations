const User = require('../models/User');
const Subscribe = require('../models/Subscribe');
const Formation = require('../models/Formation');

exports.getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id, {
        include: [{
          model: Subscribe,
          include: [Formation]
        }]
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Update user profile
  exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, address } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone;
      user.address = address;
      await user.save();
      res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };