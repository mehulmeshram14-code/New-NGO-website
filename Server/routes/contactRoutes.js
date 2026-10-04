const express = require('express');
const router = express.Router();
const { submitContactMessage, getContactMessages } = require('../controllers/contactController');

router.route('/')
  .post(submitContactMessage)
  .get(getContactMessages);

module.exports = router;
