const general_EmailCollection = require("../models/generalUser.model");

exports.postUser = async (req, res) => {
    const user_email = req.body.stu_email;
    const existingStudent = await general_EmailCollection.findOne({ stu_email: user_email });
    if (existingStudent) {
        return res.status(400).send({ message: "Email already exists" });
    }
    const result = await general_EmailCollection.insertOne({ stu_email: user_email });
    res.send(result);
}


exports.getEmail = async (req, res) => {
    const result = await general_EmailCollection.find().toArray()
    res.send(result)
}