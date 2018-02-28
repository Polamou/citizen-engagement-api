const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middlewares = require('../middlewares');


/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
});

/* GET users listing */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* GET user by id */
router.get('/:id', middlewares.findUserById, function(req, res, next) {
  res.send(req.user);
});

/* PATCH user by id */
router.patch('/:id', middlewares.findUserById, function(req, res, next) {

});

/* DELETE user by id */
router.delete('/:id', middlewares.findUserById, function(req, res, next) {
  res.send('DELETE user by id');
});

module.exports = router;
