const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/userModel');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

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
const { isAuthenticated, sanitizeUser } = require('./utils/utils');

// passportJs strategies
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: 'User not found' });
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
        if (crypto.timingSafeEqual(user.password, hashedPassword)) {
          const jwtToken = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
          done(null, jwtToken);
        } else done(null, false, { message: 'Invalid credentials' });
      });
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) return done(null, user);
      else return done(null, false);
    } catch (error) {
      return done(error, false);
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

// Define all the middleware functions here

// Define all the Routes here
app.use('/product', isAuthenticated(), productRoutes);
app.use('/user', userRoutes);
app.use('/cart', isAuthenticated(), cartRoutes);
app.use('/order', isAuthenticated(), orderRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
