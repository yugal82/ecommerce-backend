const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// require all the routes here
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Define all the middleware functions here

// Define all the Routes here
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
