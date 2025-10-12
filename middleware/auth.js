require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: 'Clé secrète JWT manquante dans .env' });
    }

    const verified = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token d’authentification invalide' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée' });
    }
    return res.status(500).json({ message: 'Échec de l’authentification', error: err.message });
  }
};


exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user; 
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
    }
    next();
  };
};