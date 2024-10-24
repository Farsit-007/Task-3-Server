const client = require("../connection");

const emailRepliesCollection = client.db('task3').collection('email_replies')
module.exports = emailRepliesCollection;