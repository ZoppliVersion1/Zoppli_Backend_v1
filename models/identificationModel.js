cosnt mongoose = require("mongoose");
const {Schema} = mongoose;

const identificationSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
doc_type: { type: String, required: true },
doc_url: { type: String, required: true }
});

module.exports = mongoose.model("Identification", identificationSchema);