const Formation = require('../models/Formation'); 
const path = require('path');
const fs = require('fs');

exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findByPk(req.params.id);
        if (formation) {
            res.json(formation);
          } else {
            res.status(404).json({ error: 'Formation not found' });
          }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getFormations = async (req, res) => {
    try {
      const formations = await Formation.findAll();
      res.json(formations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.createFormation = async (req, res) => {
    try {
        const videos = req.body;
        const files = req.files;

        // Create directories if they don't exist
        if (!fs.existsSync(path.join(__dirname, 'public/images'))) {
            fs.mkdirSync(path.join(__dirname, 'public/images'), { recursive: true });
        } else {
            console.log("The images directory already exists");
        }

        if (!fs.existsSync(path.join(__dirname, 'public/videos'))) {
            fs.mkdirSync(path.join(__dirname, 'public/videos'), { recursive: true });
        } else {
            console.log("The videos directory already exists");
        }

        // Save image and video files
        const fileimage = files[0];
        const targetPathimage = path.join(__dirname, '../public/images', fileimage.originalname);
        fs.renameSync(fileimage.path, targetPathimage);
        const imagePath = `/images/${fileimage.originalname}`;

        const filevideo = files[1];
        const targetPathvideo = path.join(__dirname, '../public/videos', filevideo.originalname);
        fs.renameSync(filevideo.path, targetPathvideo);
        const videoPath = `/videos/${filevideo.originalname}`;

        // Prepare the data for database insertion
        const formationData = {
            name: videos['name'],
            duree: videos['duree'],
            description: videos['description'],
            price: videos['price'],
            image: imagePath,
            video: videoPath
        };
console.log("les information du formations")
        // Save formation data to the database
        const newFormation = await Formation.create(formationData);
        res.status(200).json(newFormation);
    } catch (error) {
        console.error('Error creating formation:', error);
        res.status(500).json({ message: 'Error creating formation', error });
    }
};
  
  exports.updateFormation = async (req, res) => {
    try {
      const formation = await Formation.findByPk(req.params.id);

      const videos = req.body;
      if (videos!=null) {
        console.log("req body not null ",videos)
      }else{
        console.log("req body is null")
      }
      // const files = req.files;

      // Create directories if they don't exist
      // if (!fs.existsSync(path.join(__dirname, 'public/images'))) {
      //     fs.mkdirSync(path.join(__dirname, 'public/images'), { recursive: true });
      // } else {
      //     console.log("The images directory already exists updated");
      // }

      // if (!fs.existsSync(path.join(__dirname, 'public/videos'))) {
      //     fs.mkdirSync(path.join(__dirname, 'public/videos'), { recursive: true });
      // } else {
      //     console.log("The videos directory already exists updated");
      // }

      // Save image and video files
      // const fileimage = files[0];
      // // if(fileimage){
      //   console.log("image file existed");
      //    const targetPathimage = path.join(__dirname, '../public/images', fileimage.originalname);
      // fs.renameSync(fileimage.path, targetPathimage);
      // const imagePath = `/images/${fileimage.originalname}`;
      // }else{
      //   console.log("image file dont existed");
      //   const imagePath = videos['imageUrl'];
      // }
     

      // const filevideo = files[1];
      // // if (filevideo) {
      //   console.log("video file existed");
      //   const targetPathvideo = path.join(__dirname, '../public/videos', filevideo.originalname);
      // fs.renameSync(filevideo.path, targetPathvideo);
      // const videoPath = `/videos/${filevideo.originalname}`;
      // if(imagePath!=null){const imbool=true;}
      // else{const imbool = false}
      // if(videoPath!=null){const vdbool=true;}
      // else{const vdbool = false}
      // }
      // else{
      //   console.log("video file dont existed");
      //   const videoPath = videos['videoUrl'];
      // }
      

      // Prepare the data for database insertion
      // const formationDataUpdated = {
      //     name: videos['name'],
      //     duree: videos['duree'],
      //     description:videos['description'],
      //     price: videos['price'],
      //     image: imagePath,
      //     video: videoPath
        
      // };
      if (formation) {
        console.log("data qui 'il faut update ", req.body)
        await formation.update(req.body);
        console.log("formation exist");
        // res.json(formation);
      } else {
        console.log("formation dont exist");
        res.status(404).json({ error: 'Formation not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.DeleteFormation = async (req, res) => {
    try {
      const formation = await Formation.findByPk(req.params.id);
      if (formation) {
        await formation.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Formation not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };