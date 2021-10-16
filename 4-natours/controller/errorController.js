const AppError = require('./../utils/appError');

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

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
    let errorObj = { ...err };

    if (err.name === 'CastError') errorObj = handleCastError(errorObj);

    sendProdError(errorObj, res);
  }
  
};