const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Array, required: true },
});

module.exports = mongoose.model('Image', imageSchema);