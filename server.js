const app = require('./app');

/*
 * other stuff in this file such as
 * database configurations, error handling or environmental
 * variables will be here
 */

// 4.) START SERVER
// starting up a server
// adding port to listen
const port = 3000;
app.listen(port, () => {
  //passing port and a callback function
  console.log(`App running on port ${port}`);
});
