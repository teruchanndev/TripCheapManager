const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nameShop: { type: String },
  imageAvt: { type: String },
  imageCover: { type: String },
  desShop: { type: String },
  follower: { type: Number },
  watching: {type: Number }

}, { timestamps: { createdAt: 'created_at' } });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
