const express = require('express');
const router = express.Router();
const { subscribeNewsletter } = require('../controllers/newsletterController');

router.route('/')
  .post(subscribeNewsletter);

module.exports = router;
