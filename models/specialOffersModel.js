const mongoose = require("mongoose");
const { Schema } = mongoose;

const specialOffersSchema = new mongoose.Schema({
dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
description: { type: String, required: true },
discount_percentage: { type: Number, required: true },
valid_from: { type: Date, required: true },
valid_until: { type: Date, required: true }
});

module.exports = mongoose.model("SpecialOffers", specialOffersSchema);