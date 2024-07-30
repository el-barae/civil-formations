const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Formation = require('./models/Formation');
const Video = require('./models/Video');
const User = require('./models/User');
const Subscribe = require('./models/Subscribe');
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

app.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.findAll();
    res.json(formations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/formations', async (req, res) => {
  try {
    const formation = await Formation.create(req.body);
    res.status(201).json(formation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/formations/:id', async (req, res) => {
  try {
    const formation = await Formation.findByPk(req.params.id);
    if (formation) {
      await formation.update(req.body);
      res.json(formation);
    } else {
      res.status(404).json({ error: 'Formation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/formations/:id', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
