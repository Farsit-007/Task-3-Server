const client = require("../connection");

 const campaignCollection = client.db('task3').collection('campaign_details')
module.exports = campaignCollection;