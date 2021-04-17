const express = require("express");
const EmailController = require("../controllers/emails");

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/send', EmailController.sendEmail);

module.exports = router;
