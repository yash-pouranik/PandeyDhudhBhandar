// models/Customer.js
const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  balance: { type: Number, default: 0 }, // positive = customer owes you
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Customer', CustomerSchema);
