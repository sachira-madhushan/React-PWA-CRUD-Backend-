const express = require('express');
const router = express.Router();
const {createSubscription, getAllSubscriptions} = require('../controllers/SubscriptionController');

router.post('/',createSubscription);

router.get('/',getAllSubscriptions);


module.exports = router;