const express = require('express');
const router = express.Router();
const {createSubscription, getAllSubscriptions, getAllPackages} = require('../controllers/SubscriptionController');

router.post('/',createSubscription);

router.get('/',getAllSubscriptions);

router.get('/packages',getAllPackages);

module.exports = router;