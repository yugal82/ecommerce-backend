const express = require('express');
const { signup, login, logout, checkAuth } = require('../controllers/authController');
const { getUserById, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const passport = require('passport');
const { isAuthenticated } = require('../utils/utils');

const router = express.Router();

// auth related routes
router.get('/check', passport.authenticate('jwt'), checkAuth);
router.post('/signup', signup);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', logout);

// user data related routes
// the base url - http://localhost:8080/user
router.get('/', getAllUsers);
router.get('/own/:id', getUserById);
router.patch('/update-user', isAuthenticated(), updateUser);
router.delete('/delete-user', deleteUser);

module.exports = router;
