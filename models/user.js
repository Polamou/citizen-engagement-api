const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const userSchema = new Schema({
  firstName: {type: String, min: 2, max: 20},
  lastName: {type: String, min: 2, max: 20},
  role: {type: String, enum:['citizen','manager'],default: 'citizen'},
  createdAt: {type: Date, default: Date.now}
});

mongoose.model('User', userSchema);
