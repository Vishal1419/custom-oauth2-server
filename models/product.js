const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
