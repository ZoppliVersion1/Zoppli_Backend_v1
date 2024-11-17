const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantBankAccountSchema = new mongoose.Schema({
restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:
true },
account_number: { type: String, required: true },
ifsc_code: { type: String, required: true },
bank_name: { type: String, required: true }
});

module.exports = mongoose.model("RestaurantBankAccount", restaurantBankAccountSchema);