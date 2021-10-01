const mongoose = require('mongoose');

// we use mongoose schema to specify a schema for our data and we can do some validations as well
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true -> we can just say that it is required and we also can define a error message if the fielld is not filled
    require: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()   
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },

});
// we define the name of the model (in this case Tour), and then the schema witch will be used for
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// {
//   "name":"The Sea Explorer",
//   "duration":4,
//   "maxGroupSize":10,
//   "difficulty":"difficult",
//   "ratingsAverage":4.5,
//   "ratingsQuantity":13,
//   "price":997,
//   "summary":"Exciting adventure in the snow with snowboarding and skiing",
//   "description":"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!",
//   "imageCover":"tour-3-cover.jpg",
//   "images":["tour-3-1.jpg","tour-3-2.jpg","tour-3-3.jpg"],
//   "startDates":["2022-01-05,10:00","2022-02-12,10:00","2023-01-06,10:00"]
// }

