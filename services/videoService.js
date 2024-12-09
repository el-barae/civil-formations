const Video = require('../models/Video');
const Formation = require('../models/Formation');


const path = require('path');
const fs = require('fs');

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const videos = req.body.videos;
    const files = req.files;
    const videoData = [];

    console.log('Request body:', req.body); // Log the whole request body to check if formationname is included

    const formationName = videos?.formationname; // Use optional chaining for safety

    if (!formationName) {
      return res.status(400).json({ message: 'Formation name is missing from the request' });
    }

    const formation = await Formation.findOne({ where: { name: formationName } });

    if (!formation) {
      throw new Error('Formation not found');
    }

    console.log('Found formation:', formation);

    // Process each file
    files.forEach((file, index) => {
      const targetPath = path.join(videosDir, file.originalname);
      console.log('Renaming file from:', file.path, 'to:', targetPath);
      fs.renameSync(file.path, targetPath);
      const videoPath = `public/videos/${file.originalname}`;

      // Push video metadata into the array
      videoData.push({
        title: videos[index]?.title,  // Check if title is present
        numero: index + 1,
        link: videoPath,
        description: videos[index]?.description,  // Check if description is present
        formationId: formation.id
      });
    });

    console.log('Videos to be inserted:', videoData);
    const newVideos = await Videoo.bulkCreate(videoData);

    res.status(200).json(newVideos);

  } catch (error) {
    console.error('Error creating videos:', error); 
    res.status(500).json({ message: 'Error creating videos', error: error.message });
  }
};



// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get videos by formation ID
exports.getVideosByFormation = async (req, res) => {
  const { formationId } = req.params;
  try {
    const videos = await Video.findAll({ where: { formationId } });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a video
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, numero, link, description, formationId } = req.body;
  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    await video.update({ title, numero, link, description, formationId });
    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    await video.destroy();
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
