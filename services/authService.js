const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const jwtSecret = 'e7a7b3a7abc3d2a39e7d8e2b1a4f3a8b1e3d7c8f3b6e4a3d9e2b3a7d2f4c9b1e8b7f2a3d4e3b7d8f2c3a6e4f7d2e9c3b8a7f2e3d7a6f5';

// Register user
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone, address, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    });

    // Generate a JWT token
    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const role = user.role;
    const id = user.id;

    const token = jwt.sign(
      { id: id, role: role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.logout = (req, res) => {
  const token = req.body; 

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Invalid token' });
    }

    res.clearCookie('token'); 
    res.status(200).json({ msg: 'Logged out successfully' });
  });
};
