const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex:true
}).then(() => console.log('DB connection successful'));

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => console.log("App running on port:", PORT));

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! Shutting down...');
  // First we close the server and then shut it down
  server.close(() => {
    process.exit(1)
  });
});
