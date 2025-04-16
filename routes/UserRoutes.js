const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login, register, profile } = require('../controllers/UserController');

require('dotenv').config();

router.post('/register',register);
router.post('/login',login);
router.get('/profile',profile);

module.exports = router;