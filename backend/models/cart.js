const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  nameTicket: { type: String },
  imageTicket: { type: String },
  dateStart: { type: String },
  dateEnd: { type: String },
  idTicket: { type: String },
  idCustomer: { type: String },
  idCreator: { type: String },
  itemService: { type: Array }
});

module.exports = mongoose.model('Cart', cartSchema);
