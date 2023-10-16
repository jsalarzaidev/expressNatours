const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// will throw 'undefined' if it is above dotenv
const Tour = require('./../../models/tourModel');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log('Database from MongoDB connection is successful!');
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); //agressive way of exiting from process.
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
    process.exit(); //aggressive way of exiting from process.
  } catch (err) {
    console.log(err);
  }
  process.exit(); //agressive way of exiting from process.
};

//console.log(process.argv);

if (process.argv[2] === `--import`) {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
