const mongoose = require('mongoose');

// we use mongoose schema to specify a schema for our data and we can do some validations as well
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true -> we can just say that it is required and we also can define a error message if the fielld is not filled
    require: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
// we define the name of the model (in this case Tour), and then the schema witch will be used for
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;