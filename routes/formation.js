const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/', upload.any(), formationController.createFormation);
  
router.put('/:id',upload.none(), formationController.updateFormation);
  
router.delete('/:id', formationController.DeleteFormation);

module.exports = router;