const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours,} = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();
//Tour Routes

//router.param('id', tourController.checkID); // it will go through all middlewares in app.js

// aliasing: creating alias for complex queries
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour) // plugin added.
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'), // passing roles as parameters
    tourController.deleteTour,
  );

module.exports = router;
