const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new mongoose.Schema({
feedback_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true
},
order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
rating: { type: Number, required: false },
feedback_text: { type: String, required: false },
created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback",	feedbackSchema );