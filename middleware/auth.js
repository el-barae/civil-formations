const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const verified = jwt.verify(
      token,
      "e7a7b3a7abc3d2a39e7d8e2b1a4f3a8b1e3d7c8f3b6e4a3d9e2b3a7d2f4c9b1e8b7f2a3d4e3b7d8f2c3a6e4f7d2e9c3b8a7f2e3d7a6f5",
      { algorithms: ['HS256'] }
    );
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired' });
    }
    return res.status(500).json({ message: 'Authentication failed', error: err.message });
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