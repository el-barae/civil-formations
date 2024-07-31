const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const stripe = Stripe('your-secret-key-here');

app.post('/create-payment', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

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
app.use('/api/formations', formationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribes', subscribeRoutes);
app.use('/api/videos', videoRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
