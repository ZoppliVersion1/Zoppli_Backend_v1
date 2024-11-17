const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
message: { type: String, required: true },
status: { type: String, enum: ['read', 'unread'], default: 'unread' },
type: { type: String, required: true },
created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);