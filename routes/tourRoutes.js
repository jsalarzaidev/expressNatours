const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours,} = require('./../controllers/tourController');
const router = express.Router();
//Tour Routes

//router.param('id', tourController.checkID); // it will go through all middlewares in app.js

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
