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


exports.getAllClients = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec le rôle CLIENT
    const clients = await User.findAll({
      where: { 
        role: 'CLIENT' 
      },
      attributes: {
        exclude: ['password'] // Exclure le mot de passe
      },
      order: [['id', 'DESC']] // Trier par ID décroissant
    });

    return res.status(200).json({
      success: true,
      message: 'Clients récupérés avec succès',
      count: clients.length,
      data: clients
    });

  } catch (error) {
    console.error('Error in getAllClients:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
};

exports.getClientDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID client invalide'
      });
    }

    // Récupérer le client avec ses inscriptions et formations
    const client = await User.findOne({
      where: { 
        id: id,
        role: 'CLIENT' 
      },
      attributes: {
        exclude: ['password'] // Exclure le mot de passe
      },
      include: [
        {
          model: Subscribe,
          as: 'Subscribes', // Assurez-vous que l'alias correspond à votre modèle
          attributes: ['id', 'pourcentage', 'formationId'],
          include: [
            {
              model: Formation,
              as: 'Formation', // Assurez-vous que l'alias correspond à votre modèle
              attributes: ['id', 'name', 'duree', 'description', 'price', 'image']
            }
          ]
        }
      ]
    });

    // Vérifier si le client existe
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Détails du client récupérés avec succès',
      data: client
    });

  } catch (error) {
    console.error('Error in getClientDetails:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du client',
      error: error.message
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID client invalide'
      });
    }

    // Vérifier si le client existe
    const client = await User.findOne({
      where: { 
        id: id,
        role: 'CLIENT' 
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Sauvegarder les informations avant suppression (pour le log)
    const clientInfo = {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email
    };

    // Supprimer le client
    // Les Subscribes seront supprimés automatiquement grâce à onDelete: 'CASCADE'
    await client.destroy();

    console.log(`Client supprimé: ${clientInfo.firstName} ${clientInfo.lastName} (ID: ${clientInfo.id})`);

    return res.status(200).json({
      success: true,
      message: 'Client supprimé avec succès',
      data: clientInfo
    });

  } catch (error) {
    console.error('Error in deleteClient:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du client',
      error: error.message
    });
  }
};
