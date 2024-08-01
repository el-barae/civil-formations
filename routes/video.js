const express = require('express');
const router = express.Router();
const videoController = require('../services/videoService'); 

// Create a new video
router.post('/', videoController.createVideo);

// Get all videos
router.get('/', videoController.getAllVideos);

// Get videos by formation ID
router.get('/formation/:formationId', videoController.getVideosByFormation);

// Get video by ID
router.get('/:id', videoController.getVideoById);

// Update a video
router.put('/:id', videoController.updateVideo);

// Delete a video
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
