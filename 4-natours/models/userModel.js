const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    require: [true, 'Please enter a password!'],
    minlength: 8,
    // when use Get methods the password wont be displayed
    select: false,
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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

// this function returns true or false if they are equal or not. the function is available on all the user documents
userSchema.methods.correctPassword = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
