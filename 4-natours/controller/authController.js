const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const jwtSecret = process.env.JWT_SECRET;
const expires = process.env.JWT_EXPIRES_IN;

const signToken = id => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: expires });
}

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;  

  const newUser = await User.create({ name, email, password, passwordConfirm });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Cheks if email and password exists
  if(!email || !password) return next(new AppError('Please enter a email and password', 400));

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  // 3) If everything is ok, sendo token to the client
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

module.exports = {
  signup,
  login,
}

