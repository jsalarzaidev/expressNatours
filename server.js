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
    /**
     * (node:297940) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated,
     *  and will be removed in a future version.
     *  To use the new Server Discover and Monitoring engine,
     *  pass option { useUnifiedTopology: true } to the MongoClient constructor.
     */
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
const server = app.listen(port, () => {
  //passing port and a callback function
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
