const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Issue = require('../models/issue');
const User = require('../models/user');
const middlewares = require('../middlewares');

/**
 * @api {post} /issues/ Create a new issue
 * @apiName PostIssue
 * @apiGroup Issue
 *
 * @apiParam {String="new","inProgress","canceled","completed"} status The status of the issue:
 *
 * * Defaults to "new" when the issue is created
 * * Change from "new" to "inProgress" to indicate that a city employee is working on the issue
 * * Change from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue
 * * Change from "inProgress" to "completed" to indicate that the issue has been resolved
 *
 * @apiParam {String{0..1000}} [description] A detailed description of the issue
 * @apiParam {String{0..500}} [imageUrl] A URL to a picture of the issue
 * @apiParam {Point} geolocation The coordinates indicating where the issue is, e.g. : { type: "Point", coordinates: [ 40, 5 ] }
 *
 * @apiParam {String[]} tags User-defined tags to describe the issue (e.g. "accident", "broken")
 *
 * @apiUse issueInSuccessResponse
 */
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

/**
 * @api {get} /issues/ Request the list of issues
 * @apiName GetIssues
 * @apiGroup Issue
 *
 * @apiUse issueInSuccessResponse
 */
  router.get('/', function(req, res, next) {
    let query = queryIssues(req);


    query.sort('createdAt').exec(function(err, issues) {
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
 * @apiParam {String} id Unique identifier of the issue
 *
 * @apiUse issueInSuccessResponse
 */
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

<<<<<<< HEAD
/*
* This function returns the issues with the given parameters from the request
*
*/
function queryIssues(req){
  let query = Issue.find()

  if(Array.isArray(req.query.user)){
    const users = req.query.user.filter(ObjectId.isValid);
    query = query.where('userId').in(users);
  } else if (ObjectId.isValid(req.query.user)){
    query = query.where('userId').equals(req.query.user);
  }
    return query;

}


/**
* @apiDefine issueInSuccessResponse

 * @apiSuccess {String="new","inProgress","canceled","completed"} status The status of the issue:
 *
 * * Defaults to "new" when the issue is created
 * * Change from "new" to "inProgress" to indicate that a city employee is working on the issue
 * * Change from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue
 * * Change from "inProgress" to "completed" to indicate that the issue has been resolved
 *
 * @apiSuccess {String{0..1000}} [description] A detailed description of the issue
 * @apiSuccess {String{0..500}} [imageUrl] A URL to a picture of the issue
 * @apiSuccess {Point} geolocation The coordinates indicating where the issue is, e.g. : { type: "Point", coordinates: [ 40, 5 ] }
 *
 * @apiSuccess {String[]} tags User-defined tags to describe the issue (e.g. "accident", "broken")
 * @apiSuccess {String} userHref The user href of the user who reported the issue
 *
 * @apiSuccess {Date} createdAt The date at which the issue was reported
 * @apiSuccess {Date} updatedAt The date at which the issue was last modified
*/
