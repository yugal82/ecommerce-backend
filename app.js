const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/userModel');
const { isAuthenticated, sanitizeUser, cookieExtractor } = require('./utils/utils');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.static('build'));
app.use(cookieParser());
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
const wishlistRoutes = require('./routes/wishlistRoutes');

const opts = {};
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

// passportJs strategies
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (user === null) {
        done(null, false, { message: 'User not found' });
      } else {
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            const jwtToken = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
            done(null, { id: user.id, role: user.role, jwtToken });
          } else done(err, false, { message: 'Invalid credentials' });
        });
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).exec();
      if (user) return done(null, { role: user.role, id: user.id, email: user.email });
      else return done(null, false);
    } catch (error) {
      return done(null, false);
    }
  })
);

// this creates a session variable on req.user on being called from callbacks
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
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
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', isAuthenticated(), cartRoutes);
app.use('/order', isAuthenticated(), orderRoutes);
app.use('/wishlist', isAuthenticated(), wishlistRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
