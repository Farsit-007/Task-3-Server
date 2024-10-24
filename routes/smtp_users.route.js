const express = require('express');
const { postSmtp, getSmtp, deleteSmtp, getById, updateSmtp, formData } = require('../controllers/smtp_users.controller');
const router = express.Router();



router.post("/add-users", postSmtp);
router.get('/get-email', getSmtp)
router.delete('/delete-smtp-email/:id', deleteSmtp)
router.get('/get-email/:id',getById)
router.patch('/update-smtp-user/:id',updateSmtp)
router.get('/get-email-drop', formData)
module.exports = router;