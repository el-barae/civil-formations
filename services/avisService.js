const Avis = require('../models/Avis');
const User = require('../models/User'); 
const Formation = require('../models/Formation'); 


exports.addAvis = async (req, res) => {
    try {
      const { commentaire, userId, formationId } = req.body;
  
      // Validate required fields
      if (!commentaire || !userId || !formationId) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the user and formation exist
      const user = await User.findByPk(userId);
      const formation = await Formation.findByPk(formationId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!formation) {
        return res.status(404).json({ message: 'Formation not found' });
      }
  
      // Create the avis
      const newAvis = await Avis.create({
        commentaire,
        userId,
        formationId,
      });
  
      res.status(201).json(newAvis);
    } catch (error) {
      console.error('Error adding avis:', error);
      res.status(500).json({ message: 'Error adding avis', error: error.message });
    }
  };

