const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const uploadPath = path.join(__dirname, '../uploads/formation');

// ✅ Création automatique du dossier si nécessaire
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
console.log(uploadPath);

// ✅ Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/formation'; // Par défaut

    if (file.fieldname === 'videolist') {
      folder = 'uploads/privatevideos';
    }

    const uploadDir = path.join(__dirname, '..', folder);

    // Créer le dossier s’il n’existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

// ✅ Route : création d'une formation
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'videolist', maxCount: 30 },
  ]),
  // authMiddleware, authorizeRoles('admin'), // si tu veux protéger la route
  formationController.createFormation
);

// Configuration Multer pour formations (images + vidéos)
const uploadFormation = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/formation');
    
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

const uploadFormationFiles = multer({
  storage: uploadFormation,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Seules les images sont acceptées!'));
      }
    } else if (file.fieldname === 'video') {
      const allowedVideoTypes = /mp4|avi|mov|mkv|webm/;
      const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedVideoTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Seules les vidéos sont acceptées!'));
      }
    }
  }
});

// Route mise à jour
router.put('/:id', 
  authMiddleware, 
  authorizeRoles('ADMIN'), 
  uploadFormationFiles.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  formationController.updateFormation
);

router.put('/:id', 
  authMiddleware, 
  authorizeRoles('ADMIN'), 
  upload.single('image'),
  formationController.updateFormation
);


router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), formationController.createFormation);
  
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.DeleteFormation);

module.exports = router;