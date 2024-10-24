const client = require("../connection");

const general_EmailCollection = client.db('task3').collection('student_Email')
module.exports = general_EmailCollection;