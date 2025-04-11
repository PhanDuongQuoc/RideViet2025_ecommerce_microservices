// role-service/models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['admin', 'user', 'moderator'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Role', roleSchema,'roles');
