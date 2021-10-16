const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const aliasTopTours = (req, res, next) => {
  req.query.limit='5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage, summary,difficuty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {  
    console.log('req query', req.query);
    // First we build the query
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach(element => delete queryObj[element]);
    // console.log('query obj', queryObj);

    // 1B) Advanced Filtering
    // const queryString = JSON.stringify(queryObj); 
    // const newQuery = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     // operators to replace -> gte, gt, lte, lt
    // console.log(JSON.parse(newQuery));    
    
    // let query = Tour.find(JSON.parse(newQuery));    

    // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      // query = query.sort(sortBy);
      // sort('price ratingsAverage name)
    // } else {
    //   query = query.sort('name')
    // }

    // 3) Fields limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
      // query = query.select('name duration price')
    // } else {
    //   query = query.select('-__v')
    // }

    // 4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page -1) * limit;

    // page=2&limit=10 -> 1-10 is page 1, 11-20 is page 2, 21-30 is page 3...
    // query = query.skip(10).limit(10) -> it will skip the first 10 results and show the page number 2
    // query = query.skip(skip).limit(limit);

    // If the number of the page dos not exists
    // if (req.query.page) {
    //   const numbersOfTours =  await Tour.countDocuments();
      // console.log(numbersOfTours)
    //   if (skip >= numbersOfTours) throw new Error('This page does not exist');
    // } 

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const tours = await features.query;
    // Send response
    res.status(200).json({
      status: "Success",
      results: tours.length,
      data: {
        tours,
      },
    });
});

const findTourById = catchAsync(async (req, res, next) => { 
    const tour = await Tour.findById(req.params.id);
    // Behind the scenes it's using Tour.findOne({ _id: req.params.id})
    if(!tour) {
      return next(new AppError('No tour found with this ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });    
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       tour: newTour,
  //     },
  //   });    
  // } catch (error) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: error
  //   });
  // }
});

const updateTour = catchAsync(async (req, res, next) => {  
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if(!tour) {
      return next(new AppError('No tour found with this ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedTour
      },
    }); 
});

const excludeTour = catchAsync(async (req, res, next) => {  
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour) {
      return next(new AppError('No tour found with this ID', 404))
    }

    res.status(204).json({
      status: "success",
      data: null,
    });    
});

const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 }}
      },
      {
        $group: {
          // _id: null - brings the data from all touors together
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    }); 
});

const monthlyPlanTours = catchAsync(async (req, res, next) => {  
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      { 
        $unwind: '$startDates' 
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStart: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStart: -1 }
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
});

module.exports = {
  getAllTours,
  findTourById,
  createTour,
  updateTour,
  excludeTour,
  aliasTopTours,
  getTourStats,
  monthlyPlanTours
};