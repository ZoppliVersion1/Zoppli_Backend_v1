const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  delivery_partner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  delivery_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  order_status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
  payment_status: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  total_amount: { type: Number, required: true },
  order_priority: { type: String, enum: ['normal', 'express'], default: 'normal' },
  items: [
    {
      dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },  // Price at time of order
      total_price: { type: Number, required: true }  // quantity * price
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
