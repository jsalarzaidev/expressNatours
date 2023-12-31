const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

// sign up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role, // Include role here
  });

  const token = signToken(newUser._id);

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

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or Password!', 401));
  }

  // 3) if everything is ok, send token to client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// protect
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting Token and check if it exists.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  // 2) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist.', 401),
    );
  }
  // 4) Check if user changed password after the Token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, Please login again!', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// roles
exports.restrictTo = (...roles) => {
  // restricting roles
  return (req, res, next) => {
    // roles ['admin','lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

//forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email..
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2) Generate the random reset token
  // for that generate instance document
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false,
  });
  // 3) Send it to user's email
});

//reset password
exports.resetPassword = (req, res, next) => {};
