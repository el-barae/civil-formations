const express = require('express');
const router = express.Router();
const videoController = require('../services/videoService'); 
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const uploadfile = multer({ storage: storage });
const upload = multer({ dest: 'uploads/' }); 

// Create a new video
router.post('/', upload.any(), videoController.createVideo);

// Get all videos
router.get('/', videoController.getAllVideos);

// Get videos by formation ID
router.get('/formation/:formationId', videoController.getVideosByFormation);

// Get video by ID
router.get('/:id', videoController.getVideoById);

// Update a video
router.put('/:id', videoController.updateVideo);

// update video with file
router.put('/file/:id',uploadfile.any(), videoController.updateVideoFile);


// Delete a video
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
