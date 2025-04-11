const jwt = require('jsonwebtoken');

const SECRET = 'your_jwt_secret';

exports.generateToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '1' });
exports.verifyToken = (token) => jwt.verify(token, SECRET);
