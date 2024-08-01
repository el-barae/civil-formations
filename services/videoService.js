const Video = require('../models/Video'); // Adjust this to your Video model file

// Create a new video
exports.createVideo = async (req, res) => {
  const { title, numero, link, description, formationId } = req.body;
  try {
    const video = await Video.create({ title, numero, link, description, formationId });
    res.status(201).json({ message: 'Video created successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get videos by formation ID
exports.getVideosByFormation = async (req, res) => {
  const { formationId } = req.params;
  try {
    const videos = await Video.findAll({ where: { formationId } });
    res.status(200).json({ videos });
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
    res.status(200).json({ video });
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
