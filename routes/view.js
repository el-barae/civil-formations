const express = require('express');
const router = express.Router();
const viewController = require('../services/viewService'); 
const {authMiddleware} = require('../middleware/auth');


router.get('/user/:userId',authMiddleware, viewController.getViewsByUser);
router.post('/set/:userId/:videoId',authMiddleware, viewController.setView);

module.exports = router;
