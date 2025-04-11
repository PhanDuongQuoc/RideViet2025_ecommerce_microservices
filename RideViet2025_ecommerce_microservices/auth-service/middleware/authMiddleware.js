const jwt = require('jsonwebtoken');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Tách "Bearer " khỏi token

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ', error: err.message });
  }
};

module.exports = authMiddleware;
