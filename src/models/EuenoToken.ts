import mongoose from "mongoose";

const EuenoToken = new mongoose.Schema({
    token: String
});

export default mongoose.model("EuenoToken", EuenoToken);