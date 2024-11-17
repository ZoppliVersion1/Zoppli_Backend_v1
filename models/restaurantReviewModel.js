const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantReviewSchema = new mongoose.Schema({
restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:
true },
customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
review_text: { type: String },
rating: { type: Number, required: true },
photos: [{ type: String, required: false }],
created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RestaurantReview", restaurantReviewSchema);