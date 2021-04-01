const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  name: { type: String, required: true },
  districts: { type: Object, required: true },
});

module.exports = mongoose.model('City', citySchema);