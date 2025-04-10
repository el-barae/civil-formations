const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const {authMiddleware, authorizeRoles} = require('../middleware/auth');

router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), formationController.createFormation);
  

router.put('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.updateFormation);

  
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), formationController.DeleteFormation);

module.exports = router;