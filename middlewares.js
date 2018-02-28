const _ = require('lodash');
const errors = require ('./errors');
const User = require('./models/user');
module.exports ={
    findUserById: function(req,res,next){
      User.findById(req.params.id).exec(function(err, user){
        if (err){
          return next(err);
        } else if (!user){
          return next(errors.notFound('User not found'));
        }
        req.user = user;
        next();
      });
    },
    filterUserReq: function (req, res, next){
      req.filteredBody = _.pick(req.body,['firstName','lastName','role']);
      next();
    }
  }
