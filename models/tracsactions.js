// models/Transaction.js
const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['credit','debit'], required: true }, // credit = udhaar added, payment = paid back
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', TransactionSchema);
