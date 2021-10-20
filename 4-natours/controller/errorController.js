const AppError = require('./../utils/appError');

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {  
  // const value = err.keyValue[Object.keys(err.keyValue)[0]];
  const value = err.keyValue.name;
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const resultErrors = Object.values(err.errors).map(info => info.message);

  const message = `Invalid input data. ${resultErrors.join('. ')}`
  return new AppError(message, 400);
};

const handleJWTError = err => new AppError(err.message, 401);

const handleJWTExpiredError = () => new AppError('Your token has expired, please log in again.', 401);

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendProdError = (err, res) => {
// Operational error: send message to client
  if (err.isOperacional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
// When it's a programming or unknow error: don't leak error details    
  } else {
    console.log('ERROR', err);

    // send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let errorObj = { ...err };
    // if (err.code === 11000) errorObj = handleDuplicateFieldsDB(errorObj);

    // Mongoose bad ObjectI
    if (err.name === 'CastError') { err = handleCastError(err) };
    // Mongoose duplicate key/fields
    if (err.code === 11000) { err = handleDuplicateFieldsDB(err) };
    // Mongoose validationError
    if (err.name === 'ValidationError') { err = handleValidationError(err) };
    if (err.name === 'JsonWebTokenError') { err = handleJWTError(err)};
    if (err.name === 'TokenExpiredError') { err = handleJWTExpiredError()};

    sendProdError(err, res);
  }  
};
