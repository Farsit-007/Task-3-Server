const { ObjectId } = require("mongodb");
const smtpUsersCollection = require("../models/smtpUser.model");

exports.postSmtp = async (req, res) => {
    const smtpConfig = req.body;
    const result = await smtpUsersCollection.insertOne(smtpConfig);
    res.send(result)
}

exports.getSmtp = async (req, res) => {
    const result = await smtpUsersCollection.find().toArray()
    res.send(result)
}

exports.deleteSmtp = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await smtpUsersCollection.deleteOne(query)
    res.send(result)
}

exports.getById =  async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await smtpUsersCollection.findOne(query)
    res.send(result)
}

exports.updateSmtp =  async (req, res) => {
    const id = req.params.id
    const reqt = req.body;
    const query = { _id: new ObjectId(id) }
    const updatedoc = {
        $set: { ...reqt }
    }
    const result = await smtpUsersCollection.updateOne(query, updatedoc)
    res.send(result)
}


exports.formData = async (req, res) => {
    const result = await smtpUsersCollection.find().toArray()
    res.send(result)
}


