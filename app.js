const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customers');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

mongoose.connect('mongodb://localhost:27017/milkudhaar', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req,res)=> res.redirect('/customers'));
app.use('/customers', customerRoutes);

// list page route
const Customer = require('./models/customer');
app.get('/customers', async (req,res)=>{
  const customers = await Customer.find().sort({name:1});
  res.render('customers', { customers });
});

app.listen(3000, ()=> console.log('Listening on 3000'));
