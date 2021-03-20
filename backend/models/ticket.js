const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  percent: { type: Number },
  category: { type: String }
});

module.exports = mongoose.model('Ticket', ticketSchema);
