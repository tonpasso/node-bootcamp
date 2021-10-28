const { promisify } = require('util');
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
  const { name, email, password, passwordConfirm, passwordChangedAt, role } = req.body;  

  const newUser = await User.create({ name, email, password, passwordConfirm, passwordChangedAt, role });
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

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if it's there
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }
  
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, jwtSecret);
    
  // const decoded = await promisify(jwt.verify)(token, jwtSecret);
  // console.log('console 1', decoded);
  // const idDecoded = decoded.id;
  // console.log('console 2', idDecoded);

  // const user = await User.findOne({ _id: idDecoded });
  // console.log('console 3', user);
  // console.log('console 4', user._id);

  // if (idDecoded === user.id) {
  //   return next(console.log('token igual'))    
  // }


  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('This user no longer exists', 401))
  } 

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User has changed the password, please log in again', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  // console.log(req.user);
  next();
});

// (...roles) comes from the roles defined at authController.restrictTo('admin', 'lead-guide')
const restrictTo = (...roles) => {
  return (req, res, next) => {    
    // roles ['admin', 'lead-guide'] role=user
    if(!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied!', 403));
    }
    
    next();
  }
};

module.exports = {
  signup,
  login,
  protect,
  restrictTo
}
