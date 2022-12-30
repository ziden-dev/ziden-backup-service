import mongoose from "mongoose";

const EuenoPrivateKeyEncrypt = new mongoose.Schema({
    _id: String,
    holderId: String,
    url: String,
    lastUpdate: Number
});

export default mongoose.model("EuenoPrivateKeyEncrypt", EuenoPrivateKeyEncrypt);