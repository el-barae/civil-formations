const express = require('express');
const router = express.Router();
const formationController = require('../services/formationService');

router.get('/:id', formationController.getFormationById);

router.get('/', formationController.getFormations);
  
router.post('/', formationController.createFormation);
  
router.put('/:id', formationController.updateFormation);
  
router.delete('/:id', formationController.DeleteFormation);

module.exports = router;