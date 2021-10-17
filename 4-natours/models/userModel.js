const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A user must have a name!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    require: [true, 'A user must have an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, 'Please enter a password!'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    require: [true, 'Please confirm your password!'],
  }
});

// , {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true},
// }

const User = mongoose.model('User', userSchema);

module.exports = User;