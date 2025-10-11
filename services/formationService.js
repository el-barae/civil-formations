const Formation = require('../models/Formation'); 
const Avis = require('../models/Avis'); 
const User = require('../models/User'); 
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');







exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findByPk(req.params.id, {
          include: [
            {
              model: Avis,
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName'],
                },
              ],
            },
          ],
        });
        if (formation) {
            res.json(formation);
          } else {
            res.status(404).json({ error: 'Formation not found' });
          }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getFormations = async (req, res) => {
    try {
      const formations = await Formation.findAll();
      res.json(formations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createFormation = async (req, res) => {
  try {
    const { name, duree, description, price } = req.body;
    const videos = JSON.parse(req.body.videos || '[]');

    // ✅ Vérification de la présence des fichiers
    if (!req.files) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    // ✅ Dossier de stockage
    const stockDir = path.join(__dirname, '../uploads/formation');
    if (!fs.existsSync(stockDir)) {
      fs.mkdirSync(stockDir, { recursive: true }); // ✅ correction ici
    }

    // ✅ Image principale
    let imagePath = null;
    if (req.files['image']) {
      const imageFile = req.files['image'][0];
      imagePath = `/uploads/formation/${imageFile.filename}`;
    } else {
      console.log("Image non trouvée !");
    }

    // ✅ Vidéo principale
    let mainVideoPath = null;
    if (req.files['video']) {
      const videoFile = req.files['video'][0];
      mainVideoPath = `/uploads/formation/${videoFile.filename}`;
    } else {
      console.log("Vidéo principale non trouvée !");
    }

    // ✅ Traitement des vidéos supplémentaires
    const processedVideos = [];
    if (req.files['videolist'] && req.files['videolist'].length > 0) {
      req.files['videolist'].forEach((file, index) => {
        const videoData = videos[index];
        const filePath = `/uploads/privatevideos/${file.filename}`;

        processedVideos.push({
          title: videoData?.title || `Part ${index + 1}`,
          description: videoData?.description || '',
          link: filePath,
          numero: videoData?.numero || index + 1,
        });
      });
    } else {
      console.log("Aucune vidéo supplémentaire !");
    }

    // ✅ Création de la formation
    const newFormation = await Formation.create({
      name,
      duree,
      description,
      price,
      image: imagePath,
      video: mainVideoPath,
    });

    // ✅ Création des vidéos liées
    const newVideosData = await Promise.all(
      processedVideos.map(video =>
        Video.create({ ...video, formationId: newFormation.id })
      )
    );

    // ✅ Réponse finale
    res.status(201).json({
      message: 'Formation et vidéos créées avec succès ✅',
      data: { newFormation, newVideosData },
    });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de la formation',
      error: error.message,
    });
  }
};

exports.updateFormation = async (req, res) => {
  try {
    const formation = await Formation.findByPk(req.params.id);

    if (!formation) {
      return res.status(404).json({ error: 'Formation not found' });
    }

    const updateData = {
      name: req.body.name,
      duree: req.body.duree,
      description: req.body.description,
      price: req.body.price
    };

    // ✅ Gestion de l'image
    if (req.files && req.files.image) {
      const imagePath = `/uploads/formation/${req.files.image[0].filename}`;
      updateData.image = imagePath;

      // Supprimer l'ancienne image
      if (formation.image) {
        const oldImagePath = path.join(__dirname, '..', formation.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('✅ Ancienne image supprimée');
          } catch (err) {
            console.error('❌ Erreur suppression image:', err);
          }
        }
      }
    }

    // ✅ Gestion de la vidéo de présentation
    if (req.files && req.files.video) {
      const videoPath = `/uploads/formation/${req.files.video[0].filename}`;
      updateData.video = videoPath;

      // Supprimer l'ancienne vidéo
      if (formation.video) {
        const oldVideoPath = path.join(__dirname, '..', formation.video);
        if (fs.existsSync(oldVideoPath)) {
          try {
            fs.unlinkSync(oldVideoPath);
            console.log('✅ Ancienne vidéo supprimée');
          } catch (err) {
            console.error('❌ Erreur suppression vidéo:', err);
          }
        }
      }
    }

    await formation.update(updateData);
    
    res.json({
      message: 'Formation mise à jour avec succès',
      formation: formation
    });

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: err.message });
  }
};
  
  exports.DeleteFormation = async (req, res) => {
    try {
      const formation = await Formation.findByPk(req.params.id);
      if (formation) {
        await formation.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Formation not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };