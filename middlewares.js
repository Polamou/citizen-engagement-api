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
    }
  }
