import mongoose from "mongoose";

const PrivateKeyEncrypt = new mongoose.Schema({
    _id: String,
    holderId: String,
    keyEncrypt: String,
    lastUpdate: Number
});

export default mongoose.model("PrivateKeyEncrypt", PrivateKeyEncrypt);