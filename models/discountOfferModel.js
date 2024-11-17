const mongoose = require("mongoose");
const { Schema } = mongoose;

const discountOfferSchema = new mongoose.Schema({
restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:
false },
dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: false },
discount_amount: { type: Number, required: true },
promotion_code: { type: String, required: true, unique: true },
validity: {
start_date: { type: Date, required: true },
end_date: { type: Date, required: true }
},
minimum_order_value: { type: Number, required: false },
conditions: { type: String, required: false },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DiscountOffer", discountOfferSchema);