import mongoose from "mongoose";

const DataEncrypt = new mongoose.Schema({
    _id: String,
    holderId: String,
    issuerId: String,
    claimId: String,
    data: String,
    nonce: String
});

export default mongoose.model("DataEncrypt", DataEncrypt);