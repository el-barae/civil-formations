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

      // Ensure the directory exists
      const videosDir = path.join(__dirname, 'public/videos');
      if (!fs.existsSync(videosDir)) {
          fs.mkdirSync(videosDir, { recursive: true });
      }

      const formationName = videos['formationname']; // Assuming you're getting the formation name from the request body
      const formation = await Formation.findOne({ where: { name: formationName } });

      if (!formation) {
          throw new Error('Formation not found');
      }

      // Process each file
      files.forEach( (file, index) => {
          const targetPath = path.join(videosDir, file.originalname);
          fs.renameSync(file.path, targetPath);
          const videoPath = `public/videos/${file.originalname}`;

          // Push video metadata into the array
          videoData.push({
              title: videos[index]['title'], // Changed 'titre' to 'title' for consistency
              numero: index + 1, // Incrementing the numero based on the index
              link: videoPath,
              description: videos[index]['description'], // Changed 'desc' to 'description' for consistency
              formationId: formation.id // Using formationId from videos data, default to 1 if not provided
          });
         
      });
      const newVideos = await Video.bulkCreate(videoData);
      res.status(200).json(newVideos);
      
     
      console.log('Form data:', { videos: videoData });
      // res.status(200).json(videoData);

  } catch (error) {
      console.error('Error creating videos:', error);
      res.status(500).json({ message: 'Error creating videos', error });
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
    res.status(500).json({ message: 'Server error get videos by formation', error });
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
    res.status(500).json({ message: 'Server error get video by id', error });
  }
};

// Update a video
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
//  const obj =
//   {title:"intro",
//     numero:1,
//     link:"public/videos/vivd.mp4",
//     description:"gezaaaa",
//     formationId:148
//   };
  const { title, numero, link, description, formationId } =req.body;

  
  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    await video.update({ title, numero, link, description, formationId });
    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error update video', error });
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
