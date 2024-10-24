const express = require('express')
const { getReplies } = require('../controllers/replied_email.controller');
const router = express.Router();
 router.get("/get-email-reply/:id", getReplies);
module.exports = router;