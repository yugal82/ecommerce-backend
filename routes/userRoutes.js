const express = require('express');
const { signup, login } = require('../controllers/authController');
const { getUserById, getAllUsers } = require('../controllers/userController');

const router = express.Router();

// auth related routes
router.post('/signup', signup);
router.post('/login', login);

// user data related routes
// the base url - http://localhost:8080/user
router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router;
