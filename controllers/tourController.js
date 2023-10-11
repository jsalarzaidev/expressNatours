const Tour = require('./../models/tourModel');
//reading file from directory

/*
 * Route Handlers for Tours
 */

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); // this method will return a promise

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours, //displaying result from Tour.find() method.
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // short end for => findbyId => Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({ })
  // newTour.save()
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });

    //console.log(req.body);
    //res.send('Done'); // always need to send something in order to finish request response cycle.
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!', // caution: do not add messages like this in production.
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err, // caution: do not add messages like this in production.
    });
  }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    // response for delete is 204 (no content)
    status: 'success',
    data: null,
  });
};
