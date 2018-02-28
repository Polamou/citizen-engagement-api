const express = require('express');
const router = express.Router();
const User = require('../models/user');
const errors = require ('../errors');
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
/* POST new user */
router.post('/', middlewares.filterUserReq, function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.filteredBody);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.status(201);
    res.send(savedUser);
  });
});

/**
 * @api {get} /users/ Request the list of users
 * @apiName GetUsers
 * @apiGroup Users
 *
 *
 * @apiUse userInSuccessResponse
 */
/* GET users listing */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiUse userInSuccessResponse
 */
/* GET user by id */
router.get('/:id', middlewares.findUserById, function(req, res, next) {
  res.send(req.user);
});

<<<<<<< HEAD

/* PATCH user by id */
router.patch('/:id', middlewares.findUserById, function(req, res, next) {
  let updatedUser = req.user;
  updatedUser.set(req.body);
  updatedUser.save(function(err, savedUser){
    if (err){
      return next(err);
    }
    res.send(savedUser);
  });

=======
/**
 * @api {patch} /users/:id Update a user's information
 * @apiName PatchUser
 * @apiGroup User
 *
 * @apiUse userParams
 * @apiUse userInSuccessResponse
*/
/* PATCH user by id */
router.patch('/:id', middlewares.findUserById, middlewares.filterUserReq, function(req, res, next) {
  let userToPatch = req.user;
  let reqBody = req.filteredBody;
  userToPatch.set(reqBody);
  userToPatch.save(function(err,updatedUser){
    if (err){
      return next(err);
    }
    res.send(updatedUser);
  });
>>>>>>> dev-users-routes
});
/**
 * @api {delete} /users/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 */
/* DELETE user by id */
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


/**
 * @apiDefine userInSuccessResponse
 * @apiSuccess {String} role Role of the user
 * @apiSuccess {String} firstName  First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} id  Unique identifier of the user
 */

 /**
  * @apiDefine userId
  * @apiParam {Number} id Unique identifier of the user
  */

  /**
   * @apiDefine userParams
   * @apiParam {String{2..20}} firstName First name of the user
   * @apiParam {String{2..20}} lastName Last name of the user
   * @apiParam {String="manager","citizen"} role Role of the user
   */
