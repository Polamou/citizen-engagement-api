const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');
const errors = require('../errors');
const middlewares = require('../middlewares');

/**
 * @api {post} /users/ Create a new user
 * @apiName PostUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Registers a new issue.
 *
 * @apiUse userParams
 * 
 * @apiExample Example
 * POST /users HTTP/1.1
 * Content-Type: application/json
 * 
{
	"firstName": "Marie-Jeanne",
	"lastName": "Rochat",
	"role": "citizen"
}
 *
 * @apiUse userInSuccessResponse
 *  
 * @apiSuccessExample 201 Created
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 *
{
    "firstName": "Marie-Jeanne",
    "lastName": "Rochat",
    "role": "citizen",
    "createdAt": "2018-03-19T15:30:37.133Z",
    "updatedAt": "2018-03-19T15:30:37.133Z",
    "links": [
        {
            "rel": "self",
            "href": "/users/5aafd79d3c5f2f1f18e41593"
        }
    ]
}
 *
 */
router.post('/', middlewares.filterUserReq, function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.bodyFiltered);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response with correct status
    res.status(201);
    res.send(savedUser);
  });
});

/**
 * @api {get} /users/ Retrieve the list of users
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a list of users ordered by date of creation (in descendant order).
 *
 * @apiExample Example
 * GET /users HTTP/1.1

 * @apiSuccessExample 200 OK
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 * 
[
    {
        "role": "citizen",
        "firstName": "Bob",
        "lastName": "Lesponge",
        "createdAt": "2018-03-16T15:18:35.754Z",
        "updatedAt": "2018-03-16T15:18:35.754Z",
        "links": [
            {
                "rel": "self",
                "href": "/users/5aabe04b68f49609145bfcd3"
            },
            {
                "rel": "issues",
                "href": "/issues/?user=5aabe04b68f49609145bfcd3"
            }
        ],
        "issuesCount": 2
    },
    {
        "role": "citizen",
        "firstName": "Marie-Jeanne",
        "lastName": "Rochat",
        "createdAt": "2018-03-19T15:30:37.133Z",
        "updatedAt": "2018-03-19T15:30:37.133Z",
        "links": [
            {
                "rel": "self",
                "href": "/users/5aafd79d3c5f2f1f18e41593"
            }
        ]
    }
]
 * 
 * @apiUse userInSuccessResponse
 */
router.get('/', function(req, res, next) {
  const queryUsers = User.find();

  queryUsers.sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }

    countIssuesByUser(users, function(err, results) {
      if (err) {
        return next(err);
      }
      res.send(serializeUsers(users,results));
    });
  })

});

/**
 * @api {get} /users/:id Retrieve a user
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a single user.
 *
 * @apiUse userId
 *
 * @apiUse userInSuccessResponse
 */
router.get('/:id', middlewares.findUserById, function(req, res, next) {
  countIssuesByUser([req.user], function(err, results) {
    if (err) {
      return next(err);
    }
    res.send(serializeUsers([req.user],results));
  });
});

/**
 * @api {patch} /users/:id Update a user
 * @apiName PatchUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Update a single user.
 *
 * @apiUse userParams
 * @apiUse userInSuccessResponse
 */
router.patch('/:id', middlewares.findUserById, middlewares.filterUserReq, function(req, res, next) {
  let userToPatch = req.user;
  let reqBody = req.bodyFiltered;
  userToPatch.set(reqBody);
  userToPatch.save(function(err, updatedUser) {
    if (err) {
      return next(err);
    }
    res.send(updatedUser);
  });
});
/**
 * @api {delete} /users/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Delete a single user.
 *
 * @apiUse userId
 *
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 204 No Content
 */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      return next(errors.notFound('No user found with ID ' + req.params.id));
    } else {
      res.status(204);
      res.send();
    }
  });
});

module.exports = router;

function countIssuesByUser(users, callback) {
  if (users.length <= 0) {
    return callback(undefined, []);
  }
  //Aggregate issues by issuer
  Issue.aggregate([{
      $match: {
        userId: {
          $in: users.map(user => user._id)
        }
      }
    },
    {
      $group: {
        _id: '$userId',
        issuesCount: {
          $sum: 1
        }
      }
    }
  ], callback);
}



function serializeUsers(users, issueCountAggregation){
  const usersJson = users.map(user => user.toJSON());

  issueCountAggregation.forEach(function(aggregationResult){
    const user = usersJson.find(user => user.links[0].href === '/users/'+aggregationResult._id.toString());
    user.issuesCount = aggregationResult.issuesCount;
    user.links.push({
      "rel": "issues",
      "href": "/issues/?user=" + aggregationResult._id.toString()
    });
  });

  return usersJson;

}

/**
 * @apiDefine userInSuccessResponse
 * @apiSuccess (Response body)  {String} role User's role (`"manager"` or `"citizen"`).
 * @apiSuccess (Response body)  {String} firstName  User's first name
 * @apiSuccess (Response body)  {String} lastName  User's last name
 * @apiSuccess (Response body)  {Number} [issuesCount] Number of issues associated with this user
 * @apiSuccess (Response body)  {Object[]} links An array of one or two objects with two properties each:
 * 
 * * `rel`: relationship between the user and the linked resource, either `self` or `issues`.
 * * `href`: relative hyperlink reference to the linked resource within the API context
 *
 */

/**
 * @apiDefine userId
 * @apiParam {String} id Unique identifier of the user
 */

/**
 * @apiDefine userParams
 * @apiParam {String{2..20}} firstName User's first name
 * @apiParam {String{2..20}} lastName User's last name
 * @apiParam {String="manager","citizen"} [role] User's role. If not specified, defaults to `"citizen"` when the user is created.
 */
