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

module.exports = APIFeatures;
