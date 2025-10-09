require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const app = express();
const port = process.env.PORTSERVER;
const bodyParser = require('body-parser');


// Middleware to parse JSON bodies

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


/*app.post('/api/formation', upload.any(),async (req, res) => {
    const videos = req.body.videos;
  const files = req.files;
  const infoData = [];

  if (!fs.existsSync(path.join(__dirname, 'public/images'))) {
    fs.mkdirSync(path.join(__dirname, 'public/images'), { recursive: true });
  }else{
    console.log("le fichier image exist")
  }
const fileimage = files[0]
    const targetPathimage = path.join(__dirname, 'public/images', fileimage.originalname);
    fs.renameSync(fileimage.path, targetPathimage);
    const imagePath = `public/images/${fileimage.originalname}`;

const filevideo = files[1]
if (!fs.existsSync(path.join(__dirname, 'public/videos'))) {
    fs.mkdirSync(path.join(__dirname, 'public/videos'), { recursive: true });
  }else{
    console.log("le fichier video exist")
  }
    const targetPathvideo = path.join(__dirname, 'public/videos', filevideo.originalname);
    fs.renameSync(filevideo.path, targetPathvideo);
    const videoPath = `public/videos/${fileimage.originalname}`;

    infoData.push({
      name: videos['name'],
      desc: videos['desc'],
      duree: videos['duree'],
      price: videos['price'],
      image: imagePath,
      video : videoPath
    });
  console.log('Form data:', { videos: infoData });
  const newFormation = await Formation.create(formationData);

        res.status(200).send({ formation: newFormation });

  res.status(200).send({ videos: infoData });
  });


  app.post('/api/videos', upload.any(), (req, res) => {
    const videos = req.body.videos;
    const files = req.files;
    const videoData = [];
  
    if (!fs.existsSync(path.join(__dirname, 'public/videos'))) {
      fs.mkdirSync(path.join(__dirname, 'public/videos'), { recursive: true });
    }
  
    files.forEach((file, index) => {
      const targetPath = path.join(__dirname, 'public/videos', file.originalname);
      fs.renameSync(file.path, targetPath);
      const videoPath = `public/videos/${file.originalname}`;
  
      videoData.push({
        titre: videos[index]['titre'],
        desc: videos[index]['desc'],
        video: videoPath
      });
    });
  
    console.log('Form data:', { videos: videoData });
  
    // Logic to save videoData to the database goes here
  
    res.status(200).send({ videos: videoData });
  });

*/

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);

const formationRoutes = require('./routes/formation'); 
const userRoutes = require('./routes/user'); 
const subscribeRoutes = require('./routes/subscribe');
const videoRoutes = require('./routes/video');
const viewRoutes = require('./routes/view');
const avisRoutes = require('./routes/avisRoutes');

app.use('/api/formations', formationRoutes);
app.use('/formations', formationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribes', subscribeRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/avis', avisRoutes);

// app.use((err, req, res, next) => {
//   console.error('💥 Error middleware:', err);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});