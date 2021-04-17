const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  html: { type: String, required: true }
});

module.exports = mongoose.model('Email', emailSchema);