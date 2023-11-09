const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
/*
 * Route Handlers for Users
 */

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
