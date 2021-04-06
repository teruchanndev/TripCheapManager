const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  itemService: { type: Array },
  included: { type: Array, require: true },
  notIncluded: { type: Array },
  timeStart: { type: Date, require: true },
  timeStop: { type: Date, require: true },
  dayActive: { type: Date }
});

module.exports = mongoose.model('Service', serviceSchema);