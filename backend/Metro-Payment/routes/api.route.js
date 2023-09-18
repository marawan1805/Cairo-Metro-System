const router = require('express').Router();
const { createPaymentIntent, defaultPage } = require('../controller/payment');

router.post('/pay', createPaymentIntent);
router.get("/", defaultPage)
module.exports = router;