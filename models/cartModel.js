const mongoose = require("mongoose");

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },  // Price at the time of adding to cart
  total_price: { type: Number, required: true }  // Calculated as quantity * price
});

// Main Cart Schema
const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [cartItemSchema],
  subtotal: { type: Number, required: true },  // Sum of total_price of each item
  delivery_fee: { type: Number, default: 0 },
  tax_amount: { type: Number, required: true },  // Calculated tax
  total_amount: { type: Number, required: true },  // subtotal + delivery_fee + tax_amount
  status: { type: String, enum: ['active', 'checked_out'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
