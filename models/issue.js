const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const issueSchema = new Schema({
  status: {type: String, enum:['new','inProgress', 'canceled', 'completed'], default: 'new'},
  description: {type: String, maxlength: [1000, 'Too many letters'], required: false},
  imageUrl: {type: String, maxlength: [500, 'Too many letters'], required: false},
  coordonnees: {type: "Point", coordinates:[number]},
  tags: [{ type: String, maxlength: 50 }],
  createdAt: {type: Date, default: Date.now},
  updateAt: {type: Date},
});


module.exports = mongoose.model('Issue', issueSchema);
