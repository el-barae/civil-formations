// routes/avisRoutes.js
const express = require('express');
const router = express.Router();
const { addAvis, getAllAvisByFormation } = require('../services/avisService');
const { authMiddleware } = require('../middleware/auth');

// Add a new avis
router.post('/', authMiddleware, addAvis);

// Get all avis grouped by formation
router.get('/formations', authMiddleware, getAllAvisByFormation);

module.exports = router;