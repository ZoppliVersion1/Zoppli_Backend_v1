const mongoose = require("mongoose");
const { Schema } = mongoose;

const deliveryPartnerSchema = new mongoose.Schema({
delivery_partner_id: { type: mongoose.Schema.Types.ObjectId, required: true,
unique: true },
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
aadhaar_number: { type: String, required: true },
dl_number: { type: String, required: true },
vehicle_type: { type: String, enum: ['bike', 'car', 'scooter'], required: true },
vehicle_registration_id: { type: mongoose.Schema.Types.ObjectId, ref:
'VehicleRegistration', required: true },
current_location: { latitude: { type: Number }, longitude: { type: Number } },
online_status: { type: Boolean, default: false },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DeliveryPartner",deliveryPartnerSchema );