const express = require('express');
const router = express.Router();
const videoController = require('../services/videoService'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const {authMiddleware, authorizeRoles} = require('../middleware/auth');


// Create a new video
router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), videoController.createVideo);

// Get all videos
router.get('/',authMiddleware, videoController.getAllVideos);

// Get videos by formation ID
router.get('/formation/:formationId',authMiddleware, videoController.getVideosByFormation);

// Get video by ID
router.get('/:id',authMiddleware, videoController.getVideoById);

// Update a video
router.put('/:id',authMiddleware, authorizeRoles('ADMIN'), videoController.updateVideo);

// Delete a video
router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), videoController.deleteVideo);

module.exports = router;
