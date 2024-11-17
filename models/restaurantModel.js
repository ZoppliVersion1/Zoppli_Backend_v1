const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menu_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }], // Supports multiple menus
  gst_number: { type: String, required: true },
  fssai_number: { type: String, required: true },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  operating_hours: { type: Map, of: String, required: true },
  overall_rating: { type: Number, default: 0 },
  delivery_time_estimate: { type: String, required: true },
  image_urls: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
