const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/userModel');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: 'ecommerce-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));

// require all the routes here
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: 'User not found' });
      } else if (user.password === password) {
        done(null, user);
      } else done(null, false, { message: 'Invalid credentials' });
    } catch (error) {
      done(error);
    }
  })
);

// this creates a session variable on req.user on being called from callbacks
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes a session variable on req.user when called from authorized requests
passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.user) next();
  else return res.sendStatus(401);
};
// Define all the middleware functions here

// Define all the Routes here
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', isAuthenticated, cartRoutes);
app.use('/order', isAuthenticated, orderRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
