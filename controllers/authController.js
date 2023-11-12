const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

// sign up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  ); // token created, now send it to the client.

  res.status(201).json({
    status: 'success',
    token, // token added.
    data: {
      user: newUser,
    },
  });
});

// logIn

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please Provide email and Password', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email, // email: email
  }).select('+password');
  // 3) if everything is ok, send token to client

  console.log(user);

  const token = '';
  res.status(200).json({
    status: 'success',
    token,
  });
});
