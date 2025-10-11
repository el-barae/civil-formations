const Avis = require('../models/Avis');
const User = require('../models/User'); 
const Formation = require('../models/Formation'); 


exports.addAvis = async (req, res) => {
  try {
    const { commentaire, userId, formationId } = req.body;

    // Validate required fields
    if (!commentaire || !userId || !formationId) {
      return res.status(400).json({ 
        success: false,
        message: 'Tous les champs sont requis' 
      });
    }

    // Check if the user and formation exist
    const user = await User.findByPk(userId);
    const formation = await Formation.findByPk(formationId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
    }

    if (!formation) {
      return res.status(404).json({ 
        success: false,
        message: 'Formation non trouvée' 
      });
    }

    // Create the avis
    const newAvis = await Avis.create({
      commentaire,
      userId,
      formationId,
    });

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      data: newAvis
    });
  } catch (error) {
    console.error('Error adding avis:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'ajout de l\'avis', 
      error: error.message 
    });
  }
};


exports.getAllAvisByFormation = async (req, res) => {
  try {
    // Get all formations with their avis
    const formations = await Formation.findAll({
      attributes: ['id', 'name', 'description', 'duree', 'price', 'image'],
      include: [
        {
          model: Avis,
          as: 'Avis', // Assurez-vous que l'alias correspond
          attributes: ['id', 'commentaire', 'createdAt'],
          include: [
            {
              model: User,
              as: 'User', // Assurez-vous que l'alias correspond
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['name', 'ASC']]
    });

    // Transform data to include avis count
    const formationsWithAvis = formations.map(formation => {
      const formationData = formation.toJSON();
      return {
        ...formationData,
        avisCount: formationData.Avis?.length || 0
      };
    });

    res.status(200).json({
      success: true,
      message: 'Avis récupérés avec succès',
      count: formationsWithAvis.length,
      data: formationsWithAvis
    });
  } catch (error) {
    console.error('Error fetching avis by formation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des avis', 
      error: error.message 
    });
  }
};