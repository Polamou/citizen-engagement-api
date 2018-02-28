module.exports ={
  prettifyErrors: function(err){
        if (err.name === 'ValidationError'){
          err.status = 422;
        }
        if (err.code === 11000){
          err.status = 409;
          err.message = "Dupplicate error, firstName and lastName already in use."
        }
        return err;
    },
    getUserById: function(req,res,next){
      const User = require('./models/user');
      User.findById(req.params.id).exec(function(err, user){
        if (err){
          return(next(err));
        } else if (!user){
          return res.status(404).send('No person found with ID' + req.params.id);
        }
        req.user = user;
        next();
      });
    }
  }
