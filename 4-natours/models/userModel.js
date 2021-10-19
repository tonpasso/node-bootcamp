const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password!'],
    validate: {
      // This only works on CREATE or SAVE
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

userSchema.pre('save', async function(next) {
  // Only runs if password is modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Exclude passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

