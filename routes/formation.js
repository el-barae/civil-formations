const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');
const multer = require('multer');
const path = require('path');
const {authMiddleware, authorizeRoles} = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/formation');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, fileName);
      }
    });


const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// Dans votre route
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'videolist' }
]), formationController.createFormation);


router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), formationController.createFormation);
  

router.put('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.updateFormation);

  
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.DeleteFormation);

module.exports = router;