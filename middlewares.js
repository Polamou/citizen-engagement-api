const User = require('./models/user');
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
    }
  }
