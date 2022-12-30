import mongoose from "mongoose";

const EuenoDataEncrypt = new mongoose.Schema({
    _id: String,
    holderId: String,
    issuerId: String,
    claimId: String,
    url: String
});

export default mongoose.model("EuenoDataEncrypt", EuenoDataEncrypt);