const express = require('express');
const { signup, login } = require('../controllers/authController');
const { getUserById, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const passport = require('passport');

const router = express.Router();

// auth related routes
router.post('/signup', signup);
router.post('/login', passport.authenticate('local'), login);

// user data related routes
// the base url - http://localhost:8080/user
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/update-user/:id', updateUser);
router.delete('/delete-user', deleteUser);

module.exports = router;
