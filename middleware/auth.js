const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'e7a7b3a7abc3d2a39e7d8e2b1a4f3a8b1e3d7c8f3b6e4a3d9e2b3a7d2f4c9b1e8b7f2a3d4e3b7d8f2c3a6e4f7d2e9c3b8a7f2e3d7a6f5');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
