const mongoose = require("mongoose");
const { Schema } = mongoose;

const ownerIdentificationSchema = new mongoose.Schema({
restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:
true },
doc_type: { type: String, required: true },
doc_url: { type: String, required: true }
});

module.exports = mongoose.model("OwnerIdentification", ownerIdentificationSchema);