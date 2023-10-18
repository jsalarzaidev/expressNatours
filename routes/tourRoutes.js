const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours,} = require('./../controllers/tourController');
const router = express.Router();
//Tour Routes

//router.param('id', tourController.checkID); // it will go through all middlewares in app.js

// aliasing: creating alias for complex queries
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
