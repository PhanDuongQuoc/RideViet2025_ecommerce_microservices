const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true  
  },
  full_name: {
    type: String,
    required: true  
  },
  phone_number: {
    type: String,
    required: false  
  },
  date_of_birth: {
    type: Date,
    required: false  
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], 
    required: false
  },
  address: {
    type: String,
    required: false  
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'  
  },
  profile_picture: {
    type: String,
    required: false  
  },
  registration_date: {
    type: Date,
    default: Date.now  
  },
  last_updated: {
    type: Date,
    default: Date.now  
  }
});

module.exports = mongoose.model('User', userSchema,'users');
