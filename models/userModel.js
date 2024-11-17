const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, unique: true },
phone_number: { type: String, required: true },
waitlist_joined: { type: Boolean, default: false },
user_type: { type: String, default:"customer", enum: ['customer', 'restaurant_owner',
'delivery_partner'] },
user_photo: { type: String },
 refresh_tokens: [{ token: String, expiresAt: Date }],  // Array of refresh tokens for multiple devices to connect
 address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
   reset_otp: { type: String },
  otp_expiry: { type: Date },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);