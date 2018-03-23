const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
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
{
  "description": "Il y a un campement de canards sans-papiers près du canal.",
  "imageUrl": "https://www.example.com/image98.jpg",
  "geolocation": {
      "type": "Point",
      "coordinates": [
          46.780345,
          6.637863
      ]
  },
  "tags": [
      "canard",
      "canal",
      "spécisme"
  ],
  "userId": "5aabe03a68f49609145bfcd2"
}
 *
 * @apiSuccessExample 201 Created
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 *
{
    "description": "Il y a un campement de canards sans-papiers près du canal.",
    "imageUrl": "https://www.example.com/image98.jpg",
    "geolocation": {
        "type": "Point",
        "coordinates": [
            46.780345,
            6.637863
        ]
    },
    "tags": [
        "canard",
        "canal",
        "spécisme"
    ],
    "status": "new",
    "createdAt": "2018-03-19T14:33:22.986Z",
    "updatedAt": "2018-03-19T14:33:22.986Z",
    "links": [
        {
            "rel": "self",
            "href": "/issues/5aafca325d2af51c587c49fa"
        },
        {
            "rel": "user",
            "href": "/users/5aabe03a68f49609145bfcd2"
        }
    ]
}
 *
 * @apiUse issueInRequestBody
 * @apiUse issueInPostRequestBody
 * @apiUse issueInResponseBody
 * @apiUse issueInPostResponseBody
 * @apiUse issueInPostValidationError
 *
 */
router.post('/', middlewares.filterIssueReq, function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.bodyFiltered);
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
 * @api {get} /issues Retrieve a list of issues
 * @apiName GetIssues
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a paginated list of issues ordered by date of creation (in descending order).
 *
 * @apiExample Example
 *     GET /issues HTTP/1.1
 * @apiExample Example with query parameter (filter by user)
 *     GET /issues?user=5a969cf53429176baf1ccc81 HTTP/1.1
 * @apiExample Example with query parameters (pagination)
 *     GET /issues?page=1&pageSize=10 HTTP/1.1
 *
 * @apiParam (URL query parameters) {String} [user] Select only the issues issued by the person with the specified ID (this parameter can be given multiple times)
 * @apiParam (URL query parameters) {String} [status] Select only the issues with the specified status (this parameter can be given multiple times)
 * @apiParam (URL query parameters) {number} [page] The page to retrieve (defaults to 1)<br />Size range: `1..`
 * @apiParam (URL query parameters) {number} [pageSize] The number of elements to retrieve in one page (defaults to 100)<br />Size range: `1..100`
 * @apiUse issueInResponseBody
 * @apiUse issueInGetOrPatchResponseBody
 *
 * @apiSuccess (Response headers) {String} link Links to the first, previous, next and last pages of the collection (if applicable), formatted as per [RFC 5988](https://tools.ietf.org/html/rfc5988).
 *
 * @apiSuccessExample 200 OK
HTTP/1.1 200 OK
Content-Type: application/json
Link <https://polamou-citizen-engagement-api.herokuapp.com/issues?page=2&pageSize=2>; rel="next", <https://polamou-citizen-engagement-api.herokuapp.com/issues?page=12&pageSize=2>; rel="last"

[
    {
        "status": "inProgress",
        "tags": [
            "tag",
            "graffiti",
            "château"
        ],
        "description": "Il y a deux tags très laids sur le mur du Château",
        "imageUrl": "https://www.example.com/image23.jpg",
        "geolocation": {
            "type": "Point",
            "coordinates": [
                46.780345,
                6.637863
            ]
        },
        "createdAt": "2018-03-19T08:16:10.551Z",
        "updatedAt": "2018-03-19T10:01:42.088Z",
        "links": [
            {
                "rel": "self",
                "href": "/issues/5aaf71ca3ad2ed2160c93639"
            },
            {
                "rel": "user",
                "href": "/users/5aabe04b68f49609145bfcd3"
            }
        ]
    },
    {
        "status": "new",
        "tags": [],
        "description": "Il y a un type bizarre avec un chien qui squatte devant la vitrine de la boucherie.",
        "imageUrl": "https://www.example.com/image34.jpg",
        "geolocation": {
            "type": "Point",
            "coordinates": [
                46.780345,
                6.637863
            ]
        },
        "createdAt": "2018-03-19T08:21:50.938Z",
        "updatedAt": "2018-03-19T08:21:50.938Z",
        "links": [
            {
                "rel": "self",
                "href": "/issues/5aaf731e3ad2ed2160c9363a"
            },
            {
                "rel": "user",
                "href": "/users/5aabe04b68f49609145bfcd3"
            }
        ]
    }
]

 * @apiUse issue_422_userId_ValidationError
 *
 */
  router.get('/', function(req, res, next) {
    const countQuery = queryIssues(req);

    countQuery.count(function(err,total){
      if (err){
        return next(err);
      }

      // On prépare la requête comme dans l'API exemple
      let query = queryIssues(req);

      // Utilisation de notre middleware de pagination
      query = middlewares.queryPaginate('issues', query, total, req, res);

      // Tri par date de création
      query.sort('createdAt').exec(function(err, issues) {
        if (err) {
          return next(err);
        }
        res.send(issues);
      });
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
 {
    "status": "new",
    "tags": [],
    "description": "Il y a un type bizarre avec un chien qui squatte devant la vitrine de la boucherie.",
    "imageUrl": "https://www.example.com/image34.jpg",
    "geolocation": {
        "type": "Point",
        "coordinates": [
            46.780345,
            6.637863
        ]
    },
    "createdAt": "2018-03-19T08:21:50.938Z",
    "updatedAt": "2018-03-19T08:21:50.938Z",
    "links": [
        {
            "rel": "self",
            "href": "/issues/5aaf731e3ad2ed2160c9363a"
        },
        {
            "rel": "user",
            "href": "/users/5aabe04b68f49609145bfcd3"
        }
    ]
}
 *
 * @apiParam (URL path parameters) {String} id Unique identifier ([12-byte hexadecimal string](https://docs.mongodb.com/manual/reference/method/ObjectId/)) of the issue
 *
 * @apiUse issueInResponseBody
 * @apiUse issueInGetOrPatchResponseBody
 *
 * @apiUse issue_404_issueId_ValidationError
 * @apiUse issue_422_issueId_ValidationError
 *
 */
router.get('/:id', middlewares.findIssueById, function(req, res, next) {
  res.send(req.issue);
});


/**
 * @api {patch} /issues/:id Update an issue
 * @apiName PatchIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Update a single issue.
 *
 *  **Notice** : Extra properties will be ignored by the API without further notice.
 *
 * @apiExample Example
 * PATCH /issues/5aaf71ca3ad2ed2160c93639 HTTP/1.1

{
    "description": "Il y a deux tags très laids sur le mur du Château",
    "imageUrl": "https://www.example.com/image23.jpg"
}

 * @apiSuccessExample 200 OK
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 *
{
    "status": "new",
    "tags": [
        "tag",
        "graffiti",
        "château"
    ],
    "description": "Il y a deux tags très laids sur le mur du Château",
    "imageUrl": "https://www.example.com/image23.jpg",
    "geolocation": {
        "type": "Point",
        "coordinates": [
            46.780345,
            6.637863
        ]
    },
    "createdAt": "2018-03-19T08:16:10.551Z",
    "updatedAt": "2018-03-19T09:55:12.994Z",
    "links": [
        {
            "rel": "self",
            "href": "/issues/5aaf71ca3ad2ed2160c93639"
        },
        {
            "rel": "user",
            "href": "/users/5aabe03a68f49609145bfcd2"
        }
    ]
}
 *
 *
 * @apiParam (URL path parameters) {String} id Unique identifier ([12-byte hexadecimal string](https://docs.mongodb.com/manual/reference/method/ObjectId/)) of the issue
 *
 * @apiUse issueInUpdateRequestBody
 *
 * @apiUse issueInResponseBody
 * @apiUse issueInGetOrPatchResponseBody
 *
 * @apiUse issue_404_issueId_ValidationError
 * @apiUse issue_422_issueId_ValidationError
 *
 *
 */
router.patch('/:id', middlewares.findIssueById, middlewares.filterIssueReq, middlewares.validateStatusChange, function(req, res, next) {
  let updatedIssue = req.issue;
  updatedIssue.set(req.bodyFiltered);
  updatedIssue.save(function(err, savedIssue){
    if (err){
      return next(err);
    }
    res.send(savedIssue);
  });

});

/**
 * @api {delete} /issues/:id Delete an issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 * @apiVersion 1.0.0
 * @apiDescription Delete a single issue.
 *
 * @apiExample Example
 * DELETE /issues/5aaf71ca3ad2ed2160c93639 HTTP/1.1
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 204 No content
 * Content-Type: application/json
 *
 * @apiParam (URL path parameters) {String} id Unique identifier ([12-byte hexadecimal string](https://docs.mongodb.com/manual/reference/method/ObjectId/)) of the issue, e.g. : `507f191e810c19729de860ea`
 *
 * @apiUse issue_404_issueId_ValidationError
 * @apiUse issue_422_issueId_ValidationError
 *
 */
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
  let query = Issue.find();

  if(Array.isArray(req.query.user)){
    const users = req.query.user.filter(ObjectId.isValid);
    query = query.where('userId').in(users);
  } else if (ObjectId.isValid(req.query.user)){
    query = query.where('userId').equals(req.query.user);
  }

  if(Array.isArray(req.query.status)){
    const statuses = req.query.status.filter(validateStatus);
    query = query.where('status').in(statuses);
  } else if (validateStatus(req.query.status)){
    query = query.where('status').equals(req.query.status);
  }
  return query;
}

function validateStatus(status){
  const availableStatus = ['new', 'inProgress','canceled','completed'];
  return availableStatus.includes(status);
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
 * @apiParam (Request body) {String[]} [tags] User-defined tags to describe the issue (e.g. "accident", "broken")
 * @apiParam (Request body) {String} userId Unique identifier ([12-byte hexadecimal string](https://docs.mongodb.com/manual/reference/method/ObjectId/)) of an existing user, e.g. : `507f191e810c19729de860ea`
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
 * @apiParam (Request body) {String{0..1000}} [description] A detailed description of the issue
 * @apiParam (Request body) {String{0..500}} [imageUrl] A URL to a picture of the issue
 * @apiParam (Request body) {Point} [geolocation] A [GeoJSON point](https://docs.mongodb.com/manual/reference/geojson/#point) indicating where the issue is, e.g. :
 *
 * `{ type: "Point", coordinates: [ 40, 5 ] }`
 *
 * @apiParam (Request body) {String[]} [tags] User-defined tags to describe the issue (e.g. "accident", "broken")
 * @apiParam (Request body) {String} userId Unique identifier ([12-byte hexadecimal string](https://docs.mongodb.com/manual/reference/method/ObjectId/)) of an existing user, e.g. : `507f191e810c19729de860ea`
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
 * @apiSuccess (Response body) {String} [description] A detailed description of the issue
 * @apiSuccess (Response body) {String} [imageUrl] A URL to a picture of the issue
 * @apiSuccess (Response body) {Point} geolocation A [GeoJSON point](https://docs.mongodb.com/manual/reference/geojson/#point) indicating where the issue is
 *
 * @apiSuccess (Response body) {String[]} tags User-defined tags to describe the issue. If no tag has been specified, returns an empty array: `"tags": []`.
 * @apiSuccess (Response body) {Object[]} links An array of two objects with two properties each:
 *
 * * `rel`: relationship between the issue and the linked resource, either `self` or `user`.
 * * `href`: relative hyperlink reference to the linked resource within the API context
 *
 * @apiSuccess (Response body) {Date} createdAt The date at which the issue was reported
 * @apiSuccess (Response body) {Date} updatedAt The date at which the issue was last modified
*/

/**
 * @apiDefine issueInPostResponseBody
 *
 * @apiSuccess (Response body) {String} status The status of the issue
 *
*/

/**
 * @apiDefine issueInGetOrPatchResponseBody
 *
 * @apiSuccess (Response body) {String} status The status of the issue:
 *
 * * `"new"` : default value when the issue is created
 * * `"inProgress"` : indicates that a city employee is working on the issue
 * * `"canceled"` : indicates that a city employee has determined this is not a real issue
 * * `"completed"` : indicates that the issue has been resolved
 *
*/

/**
 * @apiDefine issueInPostValidationError
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

/**
 * @apiDefine issue_404_issueId_ValidationError
 *
 * @apiError {Object} 404/NotFound The id specified is well-formed but no issue was found with this id.
 *
 * @apiErrorExample {json} 404 Not Found
 * HTTP/1.1 404 Not Found
 * Content-Type: application/json
 *
{
    "message": "No issue found with ID 5aaf71ca3ad2ed2160c93638"
}
 */

/**
 * @apiDefine issue_422_userId_ValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity The specified userId is invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 * HTTP/1.1 422 Unprocessable Entity
 * Content-Type: application/json
 *
 * {
 *    "message": "Issue validation failed: userId: Path `userId` is invalid."
 * }
 *
 */

/**
 * @apiDefine issue_422_issueId_ValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity The specified issueId is invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 * HTTP/1.1 422 Unprocessable Entity
 * Content-Type: application/json
 *
 * {
 *    "message": "Issue validation failed: issueId: Path `issueId` is invalid."
 * }
 *
 */
