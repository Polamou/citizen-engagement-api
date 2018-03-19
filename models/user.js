const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const userSchema = new Schema({
  firstName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters'], required: true},
  lastName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters'], required: true},
  role: {type: String, enum:['citizen','manager'], default: 'citizen'}
},
{
  timestamps: true
});

userSchema.index({ firstName: 1, lastName: 1  }, { unique: true });

userSchema.methods.toJSON = function(){
  let obj = this.toObject();
  obj.links = [{
    "rel" :"self",
    "href":"/users/"+obj._id
    }];
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
