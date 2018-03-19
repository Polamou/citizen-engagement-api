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
 *
 * @apiUse userParams
 *
 * @apiSuccess (201 Created) {String} role Role of the user
 * @apiSuccess (201 Created) {String} firstName  First name of the user
 * @apiSuccess (201 Created) {String} lastName  Last name of the user
 * @apiSuccess (201 Created) {String} id  Unique identifier of the user
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
 * @api {get} /users/ Request the list of users
 * @apiName GetUsers
 * @apiGroup User
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
      const usersJson = users.map(user => user.toJSON());

      results.forEach(function(result) {
        const user = usersJson.find(user => user.links[0].href == "/users/" + result._id.toString());
        user.issuesCount = result.issuesCount;
        if (user.issuesCount > 0) {
          user.links.push({
            "rel": "issues",
            "href": "/issues/?user=" + result._id.toString()
          });
        }
      });

      res.send(usersJson);
    });
  })

});

/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
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

    let jsonUser = req.user.toJSON();
    let issuesCount = results[0].issuesCount;
    if (issuesCount > 0) {
      jsonUser.issuesCount = issuesCount;
      jsonUser.links.push({
        "rel": "issues",
        "href": "/issues/?user=" + results[0]._id.toString()
      });
    }
    res.send(jsonUser);
  });
});

/**
 * @api {patch} /users/:id Update a user's information
 * @apiName PatchUser
 * @apiGroup User
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
 *
 * @apiUse userId
 *
 * @apiSuccessExample {json} Success-Response:
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

/**
 * @apiDefine userInSuccessResponse
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {String} firstName  First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} id  Unique identifier of the user
 */

/**
 * @apiDefine userId
 * @apiParam {String} id Unique identifier of the user
 */

/**
 * @apiDefine userParams
 * @apiParam {String{2..20}} firstName First name of the user
 * @apiParam {String{2..20}} lastName Last name of the user
 * @apiParam {String="manager","citizen"} role Role of the user
 */
