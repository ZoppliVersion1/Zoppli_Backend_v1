const mongoose = require("mongoose");
const { Schema } = mongoose;


const menuSchema = new mongoose.Schema({
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    menu_name: { type: String, required: true },
    menu_description: { type: String, required: false },
    // menu_category: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages'], required: true },
    menu_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Updated
    available_days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  

  module.exports = mongoose.model("Menu", menuSchema);