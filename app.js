const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

app.use(express.json());
app.use(cors());

// require all the routes here
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Define all the middleware functions here
app.use(
  session({
    secret: 'ecommerce-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));

// Define all the Routes here
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    });
  })
);

// this creates a session variable on req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

// this changes a session variable on req.user when called from authorized requests
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
