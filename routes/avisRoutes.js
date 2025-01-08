const express = require('express');
const router = express.Router();
const { addAvis } = require('../services/avisService');
const {authMiddleware} = require('../middleware/auth');

router.post('/',authMiddleware, addAvis);

module.exports = router;