require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const app = express();
const port = process.env.PORTSERVER;
const bodyParser = require('body-parser');


// Middleware to parse JSON bodies

const allowedOrigins = [
  'https://civil-formations.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
const configRoutes = require('./routes/config');

app.use('/api/formations', formationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribes', subscribeRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/config', configRoutes);

// app.use((err, req, res, next) => {
//   console.error('💥 Error middleware:', err);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});