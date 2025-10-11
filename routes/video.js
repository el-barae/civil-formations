const express = require('express');
const router = express.Router();
const videoController = require('../services/videoService'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {authMiddleware, authorizeRoles} = require('../middleware/auth');

// ✅ Configuration de Multer pour les vidéos
const uploadPath = path.join(__dirname, '../uploads/privatevideos');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // max 500MB pour les vidéos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les vidéos sont acceptées!'));
    }
  }
});

// ✅ Routes
// Récupérer toutes les vidéos d'une formation
router.get('/formation/:id', authMiddleware, videoController.getVideosByFormation);

// ⭐ Mettre à jour une vidéo (AVEC upload.single('video'))
router.put('/:id', 
  authMiddleware, 
  authorizeRoles('ADMIN'), 
  upload.single('video'),  // ✅ AJOUT ICI
  videoController.updateVideo
);

// Supprimer une vidéo
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), videoController.deleteVideo);

// Ajouter une vidéo à une formation
router.post('/formation/:id', 
  authMiddleware, 
  authorizeRoles('ADMIN'), 
  upload.single('video'), 
  videoController.addVideoToFormation
);

module.exports = router;

// // Create a new video
// router.post('/',authMiddleware, authorizeRoles('ADMIN'), upload.any(), videoController.createVideo);

// // Get all videos
// router.get('/',authMiddleware, videoController.getAllVideos);

// // Get videos by formation ID
// router.get('/formation/:formationId',authMiddleware, videoController.getVideosByFormation);

// // Get video by ID
// router.get('/:id',authMiddleware, videoController.getVideoById);

// // Update a video
// router.put('/:id',authMiddleware, authorizeRoles('ADMIN'), videoController.updateVideo);

// // update video with file
// router.put('/file/:id',uploadfile.any(), videoController.updateVideoFile);


// // Delete a video
// router.delete('/:id',authMiddleware, authorizeRoles('ADMIN'), videoController.deleteVideo);

module.exports = router;
