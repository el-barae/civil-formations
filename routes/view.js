const express = require('express');
const router = express.Router();
const viewController = require('../services/viewService'); 

router.get('/user/:userId', viewController.getViewsByUser);
router.post('/set/:userId/:videoId', viewController.setView);

module.exports = router;
