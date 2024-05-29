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
// This is your test secret API key.
// const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY);
const path = require('path');

const { isAuthenticated, sanitizeUser, cookieExtractor } = require('./utils/utils');

const app = express();

// // webhook
// const endpointSecret = 'whsec_ccfc4bd2803496daeee7078ce90690eb86c342be60973d2d99e54f5b407924a2';
// app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
//   const sig = request.headers['stripe-signature'];
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }
//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

const opts = {};
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://ecommerce-clothing-ui.vercel.app/',
    // credentials: true,
  })
);

// app.use(express.static(path.resolve(__dirname, 'build')));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));
app.set('trust proxy', 1);

// require all the routes here
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

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
            const jwtToken = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
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

// // Payment intent
// app.post('/create-payment-intent', async (req, res) => {
//   const { totalAmount, orderId } = req.body;
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: totalAmount * 100,
//     currency: 'inr',
//     automatic_payment_methods: {
//       enabled: true,
//     },
//     metadata: {
//       orderId,
//     },
//   });

//   res.json({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

// Define all the Routes here
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', isAuthenticated(), cartRoutes);
app.use('/order', isAuthenticated(), orderRoutes);
app.use('/wishlist', isAuthenticated(), wishlistRoutes);
app.use('/payment', paymentRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

module.exports = app;
