const { ObjectId } = require("mongodb");
const campaignCollection = require("../models/campaignData.model");
const emailRepliesCollection = require("../models/repliedEmail.modal");

exports.getReplies = async (req, res) => {
    const id = req.params.id;
    const email = await campaignCollection.findOne({ _id: new ObjectId(id) });
    const replies = await emailRepliesCollection.find({ subject: email.subject }).toArray();
    res.json({ email, replies });
}