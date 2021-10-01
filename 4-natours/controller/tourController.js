const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    // First we build the query
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(element => delete queryObj[element]);

    const query = Tour.find(queryObj);

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equalls('easy')
    // console.log(req.query, queryObj);

    // Then we execute the query
    const tours = await query    

    // Send response
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
      message: error
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
        updatedTour
      },
    });    
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
    });    
  }
};

const excludeTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: null,
    });    
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
    });
  }
};

module.exports = {
  getAllTours,
  findTourById,
  createTour,
  updateTour,
  excludeTour,  
};