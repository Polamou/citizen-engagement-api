const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const middlewares = require('../middlewares');

/* POST new Issue */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);
    // Save that document
    newIssue.save(function(err, savedIssue) {
      if (err) {
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
  
/**
 * @api {get} /issues/:id Request an issue's information
 * @apiName GetIssue
 * @apiGroup Issue
 *
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiUse issueInSuccessResponse
 */
/* GET issue by id */
router.get('/:id', middlewares.findIssueById, function(req, res, next) {
  res.send(req.issue);
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