const fs = require('fs');
const express = require('express');
const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// app.get('/', (req, res) => {
//   // can accept couple of arguments
//   // send some data back to server very quickly
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this URL')
// })

// only executed once.

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// starting up a server

// adding port to listen
const port = 3000;
app.listen(port, () => {
  //passing port and a callback function
  console.log(`App running on port ${port}`);
});
