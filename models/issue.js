const GeoJSON = require('mongoose-geojson-schema');
const idvalidator = require('mongoose-id-validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the User Schema
const issueSchema = new Schema({
  status: {type: String, enum:['new','inProgress', 'canceled', 'completed'], default: 'new'},
  description: {type: String, maxlength: [1000, 'Too many letters'], required: false},
  imageUrl: {type: String, maxlength: [500, 'Too many letters'], required: false},
  geolocation: {type: mongoose.Schema.Types.Point, required: true},
  tags: [{ type: String, maxlength: 50}],
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date}
});

// Le plugin 'mongoose-id-validator' permet de vérifier si l'userId
// correspond effectivement à l'id d'un user existant
issueSchema.plugin(idvalidator);

issueSchema.methods.toJSON = function(){
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Issue', issueSchema);
