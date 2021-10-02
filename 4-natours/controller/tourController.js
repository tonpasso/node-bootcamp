const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    console.log('req query', req.query);
    // First we build the query
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(element => delete queryObj[element]);
    // console.log('query obj', queryObj);

    // 2) Advanced Filtering
    const queryString = JSON.stringify(queryObj); 
    const newQuery = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     // operators to replace -> gte, gt, lte, lt
    console.log(JSON.parse(newQuery));    
    
    const query = Tour.find(JSON.parse(newQuery));

    // Then we execute the query
    const tours = await query    

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equalls('easy')
    // console.log(req.query, queryObj);

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