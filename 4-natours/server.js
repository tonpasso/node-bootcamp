const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
}).then(() => console.log('DB connection successful'));

// with mongoose schema to specify a schema for our data and we can do some validations as well
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
// we define the name of the model (in this case Tour), and then the schema wich will be used for
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Parker Camper',
  price: 997
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR', err);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("App running on port:", PORT));