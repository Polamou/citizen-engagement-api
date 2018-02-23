const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const userSchema = new Schema({
  firstName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters']},
  lastName: {type: String, minlength: [2, 'Too few letters'], maxlength: [20, 'Too many letters']},
  role: {type: String, enum:['citizen','manager'], default: 'citizen'},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
