const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const customerSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number},
  fullName: { type: String },
  address: { type: String },
}, { timestamps: { createdAt: 'created_at' } });

customerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Customer', customerSchema);
