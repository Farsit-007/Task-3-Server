
const { ObjectId } = require("mongodb");
const campaignCollection = require("../models/campaignData.model");
const smtpUsersCollection = require("../models/smtpUser.model");

exports.postData = async (req, res) => {
    const campaign = req.body;
    const result = await campaignCollection.insertOne(campaign);
    res.send(result)
}

exports.getData = async (req, res) => {
    const result = await campaignCollection.find().toArray()
    res.send(result)
}

exports.deleteData = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await campaignCollection.deleteOne(query)
    res.send(result)
}

exports.updateData = async (req, res) => {
    const id = req.params.id
    const reqt = req.body;
    const query = { _id: new ObjectId(id) }
    const updatedoc = {
        $set: { ...reqt }
    }
    const result = await campaignCollection.updateOne(query, updatedoc)
    res.send(result)
}

exports.getDataById = async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await campaignCollection.findOne(query)
    res.send(result)
}