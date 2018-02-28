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
  
/* PATCH user by id */
router.patch('/:id', middlewares.findIssueById, function(req, res, next) {
  let updatedIssue = req.issue;
  updatedIssue.set(req.body);
  updatedIssue.save(function(err, savedIssue){
    if (err){
      return next(err);
    }
    res.send(savedIssue);
  });

});
  
/* DELETE issue by id */
router.delete('/:id', middlewares.findIssueById, function(req, res, next) {
  Issue.findByIdAndRemove(req.params.id, function(err, issue) {
    if (err) {
      next(err);
    } else if (!issue) {
      let err = new Error();
      err.message = 'No issue found with ID ' + req.params.id;
      err.status = 404;
      return next(err);
    } else {
      res.status(204);
      res.send();
    }
  });
});
  
  module.exports = router;