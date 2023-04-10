import mongoose from "mongoose";

const DataBackup = new mongoose.Schema({
    _id: String,
    holderId: String,
    issuerId: String,
    claimId: String,
    data: String
});

export default mongoose.model("DataBackup", DataBackup);