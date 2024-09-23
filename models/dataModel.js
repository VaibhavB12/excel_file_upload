// models/dataModel.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: String,
  age: Number,
  email: String,
  zip: Number,
});

const DataModel = mongoose.model('Data', dataSchema);
module.exports = DataModel;
