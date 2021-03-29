const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  categoryItem: { type: Array, required: true },
});

module.exports = mongoose.model('Category', categorySchema);