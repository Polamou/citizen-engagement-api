const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const userSchema = new Schema({
  firstName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters']},
  lastName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters']},
  role: {type: String, enum:['citizen','manager'], default: 'citizen'},
  createdAt: {type: Date, default: Date.now}
});

userSchema.index({ firstName: 1, lastName: 1  }, { unique: true });

userSchema.methods.toJSON = function(){
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
