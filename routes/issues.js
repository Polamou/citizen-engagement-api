var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');

/* POST new Issue */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);
    // Save that document
    newIssue.save(function(err, savedIssue) {
      if (err) {
        if (err.name === 'ValidationError'){
          err.status = 422;
        }
        if (err.code === 11000){
          err.status = 409;
        }
        return next(err);
      }
      // Send the saved document in the response
      res.send(savedIssue);
    });
  });
  
  /* GET issues listing */
  router.get('/', function(req, res, next) {
    Issue.find().sort('createdAt').exec(function(err, issues) {
      if (err) {
        return next(err);
      }
      res.send(issues);
    });
  });
  
  /* GET issue by id */
  router.get('/:id', function(req, res, next) {
    res.send('GET issue by id');
  });
  
  /* PUT issue by id */
  router.put('/:id', function(req, res, next) {
    res.send('PUT issue by id');
  });
  
  /* DELETE issue by id */
  router.delete('/:id', function(req, res, next) {
    res.send('DELETE issue by id');
  });
  
  module.exports = router;