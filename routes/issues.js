const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
const Issue = require('../models/issue');
const User = require('../models/user');
const middlewares = require('../middlewares');

/**
 * @api {post} /issues Create a new issue
 * @apiName PostIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Registers a new issue.
 * 
 * @apiExample Example
 * POST /issues HTTP/1.1
 * Content-Type: application/json
 * 
 * {
 *   "description": "Le lampadaire au croisement de la rue du Lac et de la rue des Casernes ne s'allume pas.",
 *   "imageUrl": "https://www.example.com/image.jpg",
 *   "geolocation": {
 *       "type": "Point",
 *       "coordinates": [
 *           46.780338,
 *           6.637956
 *       ]
 *   },
 *   "tags": [
 *       "lampadaire",
 *       "éclairage public",
 *       "ampoule cassée"
 *   ],
 *   "userId": "5a902740d1c0ec3f685e8802"
 * }
 * 
 * @apiSuccessExample 201 Created
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 *
 * {
 *   "description": "Le lampadaire au croisement de la rue du Lac et de la rue des Casernes ne s'allume pas.",
 *   "imageUrl": "https://www.example.com/image.jpg",
 *   "geolocation": {
 *       "type": "Point",
 *       "coordinates": [
 *           46.780338,
 *           6.637956
 *       ]
 *   },
 *   "tags": [
 *       "lampadaire",
 *       "éclairage public",
 *       "ampoule cassée"
 *   ],
 *   "status": "new",
 *   "createdAt": "2018-03-01T09:05:51.126Z",
 *   "id": "5a97c26fdba0205d0c99cdc3",
 *   "userHref": "/users/5a902740d1c0ec3f685e8802"
 * }
 *
 * @apiUse issueInRequestBody
 * @apiUse issueInPostRequestBody
 * @apiUse issueInResponseBody
 * @apiUse issueValidationError
 * 
 */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);
    // Save that document
    newIssue.save(function(err, savedIssue) {
      if (err) {
        return next(err);
      }
      // Send the saved document in the response with correct status
      res.status(201);
      res.send(savedIssue);
    });
  });

/**
 * @api {get} /issues Request the list of issues
 * @apiName GetIssues
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of issues ordered by date of creation (in descendant order).
 *
 * @apiUse issueInResponseBody
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
 * @api {get} /issues/:id Retrieve an issue
 * @apiName GetIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a single issue.
 * 
 * @apiExample Example
 * GET /issues/58b2926f5e1def0123e97281 HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 *
 * {
 *   "status": "new",
 *   "tags": [
 *       "lampadaire",
 *       "éclairage public",
 *       "ampoule cassée"
 *   ],
 *   "createdAt": "2018-03-01T09:05:51.126Z",
 *   "description": "Le lampadaire au croisement de la rue du Lac et de la rue des Casernes ne s'allume pas.",
 *   "imageUrl": "https://www.example.com/image.jpg",
 *   "geolocation": {
 *       "type": "Point",
 *       "coordinates": [
 *           46.780338,
 *           6.637956
 *       ]
 *   },
 *   "id": "5a97c26fdba0205d0c99cdc3",
 *   "userHref": "/users/5a902740d1c0ec3f685e8802"
 * }
 *
 *
 * @apiParam (URL path parameters) {String} id Unique identifier of the issue
 *
 * @apiUse issueInResponseBody
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
 * @apiDefine issueInRequestBody
 *
 * @apiParam (Request body) {String{0..1000}} [description] A detailed description of the issue
 * @apiParam (Request body) {String{0..500}} [imageUrl] A URL to a picture of the issue
 * @apiParam (Request body) {Point} geolocation A [GeoJSON point](https://docs.mongodb.com/manual/reference/geojson/#point) indicating where the issue is, e.g. :
 * 
 * `{ type: "Point", coordinates: [ 40, 5 ] }`
 *
 * @apiParam (Request body) {String[]} tags User-defined tags to describe the issue (e.g. "accident", "broken")
 * @apiParam (Request body) {String} userId A string corresponding to an existing user [12-byte hexadecimal string ObjectId value](https://docs.mongodb.com/manual/reference/method/ObjectId/), e.g. : `507f191e810c19729de860ea`
 * 
*/

/**
* @apiDefine issueInPostRequestBody
* 
* @apiParam (Request body) {String="new"} [status] The status of the issue. If not specified, defaults to `"new"` when the issue is created.
*/

/**
 * @apiDefine issueInUpdateRequestBody
 * 
 * @apiParam (Request body) {String="new","inProgress","canceled","completed"} [status] The status of the issue:
 *
 * * Defaults to `"new"` when the issue is created
 * * Change from `"new"` to `"inProgress"` to indicate that a city employee is working on the issue
 * * Change from `"new"` or `"inProgress"` to `"canceled"` to indicate that a city employee has determined this is not a real issue
 * * Change from `"inProgress"` to `"completed"` to indicate that the issue has been resolved
*/
 
/**
 * @apiDefine issueInResponseBody
 * 
 * @apiSuccess (Response body) {String} status The status of the issue:
 *
 * * `"new"` : default value when the issue is created
 * * `"inProgress"` : indicates that a city employee is working on the issue
 * * `"canceled"` : indicates that a city employee has determined this is not a real issue
 * * `"completed"` : indicates that the issue has been resolved
 *
 * @apiSuccess (Response body) {String} [description] A detailed description of the issue
 * @apiSuccess (Response body) {String} [imageUrl] A URL to a picture of the issue
 * @apiSuccess (Response body) {Point} geolocation A [GeoJSON point](https://docs.mongodb.com/manual/reference/geojson/#point) indicating where the issue is
 *
 * @apiSuccess (Response body) {String[]} tags User-defined tags to describe the issue
 * @apiSuccess (Response body) {String} userHref The user href of the user who reported the issue
 *
 * @apiSuccess (Response body) {Date} createdAt The date at which the issue was reported
 * @apiSuccess (Response body) {Date} [updatedAt] The date at which the issue was last modified
*/

/**
 * @apiDefine issueValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity Some of the issue's properties are invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 * HTTP/1.1 422 Unprocessable Entity
 * Content-Type: application/json
 * 
 * {
 *    "message": "Issue validation failed: userId: Path `userId` is required."
 * }
 */