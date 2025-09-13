// routes/customers.js (snippets)
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Transaction = require('../models/tracsactions');

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.render('customers', { customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).send("Server error");
  }
});


// Create customer
router.post('/add', async (req, res) => {
  const { name, phone, address } = req.body;
  const c = new Customer({ name, phone, address });
  await c.save();
  res.redirect('/customers');
});

// Add transaction (credit or payment)
// Add transaction (credit or debit)
router.post('/:id/transaction', async (req, res) => {
  const { id } = req.params;
  const { type, amount, note } = req.body;
  const amt = parseFloat(amount);

  // THIS IS THE FIX: Changed 'payment' to 'debit'
  if (!['credit', 'debit'].includes(type) || isNaN(amt)) {
    return res.status(400).send('Invalid');
  }

  const t = new Transaction({ customer: id, type, amount: amt, note });
  await t.save();

  // update customer's balance: credit increases what they owe; debit decreases it
  const sign = (type === 'credit') ? 1 : -1;
  await Customer.findByIdAndUpdate(id, { $inc: { balance: sign * amt } });

  res.redirect(`/customers/${id}`);
});

// Customer ledger
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  const transactions = await Transaction.find({ customer: id }).sort({ date: 1 });

  let totalPaid = 0;
  let totalCredit = 0;
  transactions.forEach(t => {
    if (t.type === 'payment') totalPaid += t.amount;
    if (t.type === 'credit') totalCredit += t.amount;
  });

  res.render('customer_ledger', { customer, transactions, totalPaid, totalCredit });
});

module.exports = router;
