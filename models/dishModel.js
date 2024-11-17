const mongoose = require("mongoose");
const { Schema } = mongoose;

const dishSchema = new mongoose.Schema({
    menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String, required: true }],
    calories: { type: Number },
    allergens: [{ type: String }],
    price: { type: Number, required: true },
    tax_amount: { type: Number },
    delivery_fee: { type: Number },
    total_price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    image_url: { type: String }, // Add image URL
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Updated
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

  

module.exports = mongoose.model("Dish", dishSchema);