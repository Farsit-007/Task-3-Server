const client = require('../connection');

const smtpUsersCollection = client.db('task3').collection('users');

module.exports = smtpUsersCollection;
