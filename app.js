const express = require('express');
const morgan = require('morgan');

const app = express();

// Importing Routes

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1). MIDDLEWARES

app.use(morgan('dev'));

// middleware
// it is called **middleware** because it stands between **request** and **response**.
app.use(express.json()); //returns function added to middleware stack.
app.use(express.static(`${__dirname}/public`));
//similarly we can create our own middleware function.
app.use((req, res, next) => {
  console.log('Hello from the middleware...');
  next();
});

//creating your own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
