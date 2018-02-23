var express = require('express');
var router = express.Router();

/* ADD new user */
router.post('/', function(req, res, next) {
  res.send('post user');
});

/* GET users listing */
router.get('/', function(req, res, next) {
  res.send('GET users listing');
});

/* GET user by id */
router.get('/:id', function(req, res, next) {
  res.send('GET user by id');
});

/* PUT user by id */
router.put('/:id', function(req, res, next) {
  res.send('PUT user by id');
});

/* DELETE user by id */
router.delete('/:id', function(req, res, next) {
  res.send('DELETE user by id');
});

module.exports = router;