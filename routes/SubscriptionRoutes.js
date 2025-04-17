const express = require('express');
const router = express.Router();
const {createSubscription} = require('../controllers/SubscriptionController');

router.post('/',createSubscription);

// router.post('/users',changeUserStatus);
// router.get('/subscriptions',addSubscription);

module.exports = router;