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
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100MB
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


router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), formationController.createFormation);
  

router.put('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.updateFormation);

  
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.DeleteFormation);

module.exports = router;