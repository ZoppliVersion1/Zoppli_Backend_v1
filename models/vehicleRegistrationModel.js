const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleRegistrationSchema = new mongoose.Schema({
registration_number: { type: String, required: true },
registration_expiry: { type: Date, required: true },
delivery_partner_id: { type: mongoose.Schema.Types.ObjectId, ref:
'DeliveryPartner', required: true }
});

module.exports = mongoose.model("VehicleRegistration", vehicleRegistrationSchema);