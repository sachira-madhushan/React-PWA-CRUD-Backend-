const express = require('express');
const router = express.Router();
const { getAllUsers, changeUserStatus, addSubscription } = require('../controllers/AdminController');

router.get('/users',getAllUsers);
router.post('/users',changeUserStatus);
router.get('/subscriptions',addSubscription);

module.exports = router;