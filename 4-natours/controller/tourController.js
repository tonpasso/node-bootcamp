const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "Success",
      results: tours.length,
      data: {
        tours,
      },
    });    
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });    
  }
};

const findTourById = async (req, res) => {
  try {
    const tourId = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      tourId,
    });    
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: error
    });    
  }
};

const createTour = async (req, res) => {
  try {
  // const newTour = new Tour({})
  // newTour.save()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });    
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: 'Invalid data sent!'
    })
  }
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour here",
    },
  });
};

const excludeTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllTours,
  findTourById,
  createTour,
  updateTour,
  excludeTour,  
};