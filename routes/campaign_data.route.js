const express = require('express');
const { postData, getData, deleteData, updateData, getDataById } = require('../controllers/campaign_data.controller');
const router = express.Router();

router.post("/campaign-details", postData);
router.get("/campaign-details", getData)
router.delete('/delete-campaign/:id', deleteData)
router.patch('/campaign-details-update/:id', updateData)
router.get('/get-campaign-data/:id', getDataById)

module.exports = router;