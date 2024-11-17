const mongoose = require("mongoose");
const { Schema } = mongoose;

const dishReviewSchema = new mongoose.Schema({
review_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
review_text: { type: String },
rating: { type: Number, required: true },
created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DishReview", dishReviewSchema );