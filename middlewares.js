const User = require('./models/user');
const Issue = require('./models/issue');

module.exports ={
    findUserById: function(req,res,next){
      User.findById(req.params.id).exec(function(err, user){
        if (err){
          return next(err);
        } else if (!user){
          let err = new Error();
          err.message = 'No person found with ID ' + req.params.id;
          err.status = 404;
          return next(err);
        }
        req.user = user;
        next();
      });
    },
    findIssueById: function(req,res,next){
      Issue.findById(req.params.id).exec(function(err, issue){
        if (err){
          return next(err);
        } else if (!issue){
          let err = new Error();
          err.message = 'No issue found with ID ' + req.params.id;
          err.status = 404;
          return next(err);
        }
        req.issue = issue;
        next();
      });
    }
  }
