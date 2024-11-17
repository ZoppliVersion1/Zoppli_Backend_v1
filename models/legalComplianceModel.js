const mongoose = require("mongoose");
const { Schema } = mongoose;

const legalComplianceSchema = new mongoose.Schema({
entity_type: { type: String, enum: ['customer', 'restaurant', 'delivery_partner'],
required: true },
entity_id: { type: mongoose.Schema.Types.ObjectId, required: true },
gst_number: { type: String, required: false },
fssai_number: { type: String, required: false },
aadhaar_number: { type: String, required: false },
pan_number: { type: String, required: false },
compliance_status: { type: String, enum: ['pending', 'approved', 'rejected'], required:
true, default: 'pending' },
last_compliance_check: { type: Date, required: true, default: Date.now },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LegalCompliance",legalComplianceSchema );