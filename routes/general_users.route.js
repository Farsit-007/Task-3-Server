const express = require('express');
const { postUser, getEmail } = require('../controllers/general_users.controller');
const router = express.Router();

router.post("/add-student", postUser);
router.get("/get-emails", getEmail)
module.exports = router;