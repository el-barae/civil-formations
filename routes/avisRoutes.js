const express = require('express');
const router = express.Router();
const { addAvis } = require('../services/avisService');

router.post('/', addAvis);

module.exports = router;