const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: Boolean, required: true },
  price: { type: Number, required: true },
  percent: { type: Number },
  category: { type: String },
  categoryService: { type: String },
  price_reduce: { type: Number },
  city: { type: String },
  trademark: {type: String}, //thương hiệu
  quantity: { type: Number }, //số lượng
  // imagePath: {type: String, required: true },
  imagePath: {type: Array},
  services: { type: Array },
  address: { type: String },
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Ticket', ticketSchema);
