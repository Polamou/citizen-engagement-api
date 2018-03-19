const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');
const errors = require ('../errors');
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
 * @apiSuccess (201 Created) {String} role Role of the user
 * @apiSuccess (201 Created) {String} firstName  First name of the user
 * @apiSuccess (201 Created) {String} lastName  Last name of the user
 * @apiSuccess (201 Created) {String} createdAt  The date at which the user was created
 * @apiSuccess (201 Created) {String} updatedAt  The date at which the user was last updated
 * @apiSuccess (201 Created) {String} id  Unique identifier of the user
 *  
 * @apiSuccessExample 201 Created
 * HTTP/1.1 201 Created
 * Content-Type: application/json
 *
{
    "firstName": "Marie-Jeanne",
    "lastName": "Rochat",
    "role": "citizen",
    "createdAt": "2018-03-19T11:46:21.427Z",
    "updatedAt": "2018-03-19T11:46:21.427Z",
    "id": "5aafa30d3ad2ed2160c9363c"
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
 * @apiUse userInSuccessResponse
 */
router.get('/', function(req, res, next) {
  const queryUsers = User.find();

  queryUsers.sort('name').exec( function (err,users){
    if (err){
      return next(err);
    }
    countIssuesByUser(users, function(err,results){
      if(err){
        return next(err);
      }
      const usersJson = users.map(user => user.toJSON());

      results.forEach(function(result){
        const user = usersJson.find(user => user.links[0].href == "/users/"+result._id.toString());
        user.issuesCount = result.issuesCount;
        if (user.issuesCount > 0){
          user.links.push(
            {
            "rel" : "issues",
            "href" : "/issues/?user="+result._id.toString()
          }
        );
        }
      });

      res.send(usersJson);
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
  res.send(req.user);
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
  userToPatch.save(function(err,updatedUser){
    if (err){
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
      return next(errors.notFound('No user found with ID '+req.params.id));
    } else {
      res.status(204);
      res.send();
    }
  });
});

module.exports = router;

function countIssuesByUser(users, callback){
  if (users.length <= 0){
    return callback(undefined,[]);
  }
  //Aggregate issues by issuer
  Issue.aggregate([
    {
      $match:{
        userId: {
          $in: users.map(user => user._id)
        }
      }
    },
    {
      $group: {
        _id: '$userId',
        issuesCount:{
          $sum:1
        }
      }
    }
  ],callback);
}

/**
 * @apiDefine userInSuccessResponse
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {String} firstName  First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} id  Unique identifier of the user
 * @apiSuccess {Number} [issuesCount] Number of issues associated with this user
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
