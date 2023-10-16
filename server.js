const mongoose = require('mongoose');
const dotenv = require('dotenv');
// will throw 'undefined' if it is above dotenv

dotenv.config({
  path: './config.env',
});

const app = require('./app');

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

/*
 * other stuff in this file such as
 * database configurations, error handling or environmental
 * variables will be here
 */

//console.log(app.get('env'));
// run only once, and it is available on every single file.
//console.log(process.env);

// 4.) START SERVER
// starting up a server
// adding port to listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  //passing port and a callback function
  console.log(`App running on port ${port}`);
});
