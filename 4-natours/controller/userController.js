const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const getAllUsers = catchAsync(async (_req, res, next) => {
  const users = await User.find();
    // Send response
  res.status(200).json({
    status: "Success",
    results: users.length,
    data: {
      users,
    },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not ready yet",
  });
};

const findUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not ready yet",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not ready yet",
  });
};

const excludeUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Not ready yet",
  });
};

module.exports = {
  getAllUsers,
  createUser,
  findUserById,
  updateUser,
  excludeUser,
};
