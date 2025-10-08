const Formation = require('../models/Formation'); 
const Avis = require('../models/Avis'); 
const User = require('../models/User'); 
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');







exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findByPk(req.params.id, {
          include: [
            {
              model: Avis,
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName'],
                },
              ],
            },
          ],
        });
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
   
        const { name, duree, description, price } = req.body;
        const videos = JSON.parse(req.body.videos || '[]');
        
        // Vérification des fichiers
        if (!req.files) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }

        // Création des répertoires s'ils n'existent pas
        const stockDir = path.join(__dirname, '../uploads/formation');
     
      
            if (!fs.existsSync(stockDir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
   

        // Traitement de l'image principale
        let imagePath = null;
        if (req.files['image']) {
            const imageFile = req.files['image'][0];
            imagePath =imageFile?`/formation/${req.files['image'][0].filename}`:null;
        }else{
          console.log("image not exist !!!")
        }

        // Traitement de la vidéo principale
        let mainVideoPath = null;
        if (req.files['video']) {
            const videoFile = req.files['video'][0];
            mainVideoPath = videoFile?`/formation/${req.files['video'][0].filename}`:null;
        }else{
          console.log("video not exist !!!")
        }

        // Traitement des vidéos supplémentaires
        const processedVideos = [];
       
        console.log("number of videosss:"+req.files['videolist'].length)
        if (req.files['videolist']) {
            req.files['videolist'].forEach((file, index) => {

              const pathvideo=`/formation/${file.filename}`
              videos[index].videolist=pathvideo
                
                  processedVideos.push({
                    "title":  videos[index].title,
                    "description": videos[index].description,
                    "link": videos[index].videolist,
                    "numero":videos[index].numero,
                  });
            });
        }else{
          console.log("videos not exist !!!")
        }

        // Création de l'objet formation
        const formationData = {
            name,
            duree,
            description,
            price,
            image: imagePath,
            video: mainVideoPath,
        };
      

        // Enregistrement dans la base de données
        const newFormation = await Formation.create(formationData);
        const newvideosdata = await Promise.all(processedVideos.map( prvd=>{
          return Video.create({
            ...prvd,
            formationId: newFormation.id,  
          });
        }));

        // processedVideos.forEach(prvd=>{
        //   const newvideosdata = await Video.create();
        // })

       
        
        res.status(201).json({
            message: 'Formation et videos sont créée avec succès',
            data: {newFormation,newvideosdata}
        });

    } catch (error) {
        console.error('Erreur lors de la création de la formation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création de la formation',
            error: error.message
        });
    }
};




// exports.createFormation = async (req, res) => {
//   // Validate request
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     // Check if files were uploaded
//     if (!req.files || !Array.isArray(req.files)) {
//       return res.status(400).json({ message: 'No files uploaded' });
//     }

//     // Extract files
//     const files = req.files;
//     const imageFile = files.find(file => file.fieldname === 'image');
//     const videoFile = files.find(file => file.fieldname === 'video');

//     if (!imageFile) {
//       return res.status(400).json({ message: 'Image file is required' });
//     }

//     // Create the formation
//     const newFormation = new Formation({
//       name: req.body.name,
//       duree: req.body.duree,
//       description: req.body.description,
//       price: req.body.price,
//       imagePath: imageFile.path,
//       videoPath: videoFile ? videoFile.path : null
//     });

//     // Save the formation
//     const savedFormation = await newFormation.save();

//     // Create and associate videos
//     const videos = req.body.videos.map(video => ({
//       title: video.title,
//       description: video.description || '',
//       numero: video.numero,
//       link: video.link,
//       formation: savedFormation._id
//     }));

//     await Video.insertMany(videos);

//     return res.status(201).json({
//       success: true,
//       message: 'Formation created successfully',
//       formation: savedFormation
//     });

//   } catch (error) {
//     console.error('Error creating formation:', error);
//     return res.status(500).json({ 
//       success: false,
//       message: 'Server error while creating formation',
//       error: error.message 
//     });
//   }
// };


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