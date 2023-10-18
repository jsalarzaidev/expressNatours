const Tour = require('./../models/tourModel');

// Middleware in Action
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//reading file from directory

class APIFeatures {
  constructor(query, queryString) {
    // it gets automatically called as soon new object is created out of this class.
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // remove all the fields from queryObj
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr)); // this method will return a promise
    return this; // `this` is the entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      //console.log(sortBy);
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt'); // decending order
    }
    return this; // `this` is the entire object
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //projecting
    } else {
      this.query = this.query.select('-__v'); //excluding "__v: 0" mongoose uses this
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // nice trick: to convert string to number, and default to page 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10 -> user is at page # 2 and shows 10 results per page
    // page 1: 1->10, page 2: 11->20, page 3: 21->30 ....
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

/*
 * Route Handlers for Tours
 */

exports.getAllTours = async (req, res) => {
  try {
    //EXECUTE QUERY
    // goal: chain these methods one afte another.

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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
      message: err, // caution: do not add messages like this in production.
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

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); // variable is not required because there is no need to send something back to client.
    res.status(204).json({
      // response for delete is 204 (no content)
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
