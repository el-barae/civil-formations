const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

// ✅ Configuration Multer UNIFIÉE pour formations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    // Détermine le dossier selon le type de fichier
    if (file.fieldname === 'videolist') {
      // Vidéos de formation (contenu privé)
      uploadPath = path.join(__dirname, '../uploads/privatevideos');
    } else {
      // Images et vidéos de présentation
      uploadPath = path.join(__dirname, '../uploads/formation');
    }

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      // Validation pour images
      const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Error('Seules les images sont acceptées pour le champ image!'));
      }
    } else if (file.fieldname === 'video' || file.fieldname === 'videolist') {
      // Validation pour vidéos
      const allowedVideoTypes = /mp4|avi|mov|mkv|webm/;
      const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedVideoTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Error('Seules les vidéos sont acceptées pour les champs vidéo!'));
      }
    } else {
      // Accepter tous les autres champs
      cb(null, true);
    }
  }
});

// Créer une formation (avec image, vidéo de présentation et liste de vidéos)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'), 
  upload.fields([
    { name: 'image', maxCount: 1 },        // Image → /uploads/formation
    { name: 'video', maxCount: 1 },        // Vidéo présentation → /uploads/formation
    { name: 'videolist', maxCount: 40 },   // Vidéos contenu → /uploads/privatevideos
  ]),
  formationController.createFormation
);

// Mettre à jour une formation (avec image et vidéo de présentation)
router.put(
  '/:id', 
  authMiddleware, 
  authorizeRoles('ADMIN'), 
  upload.fields([
    { name: 'image', maxCount: 1 },   // Image → /uploads/formation
    { name: 'video', maxCount: 1 }    // Vidéo présentation → /uploads/formation
  ]),
  formationController.updateFormation
);

router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
    
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.DeleteFormation);

module.exports = router;