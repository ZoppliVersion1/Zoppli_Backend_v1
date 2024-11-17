const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema({
transaction_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique:
true },
order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required:
true },
payment_method: { type: String, required: true, enum: ['credit_card', 'UPI',
'cash_on_delivery', 'net_banking', 'wallet'] },
transaction_status: { type: String, required: true, enum: ['success', 'failed', 'pending'],
default: 'pending' },
transaction_amount: { type: Number, required: true },
transaction_date: { type: Date, default: Date.now },
refund_details: {
refund_status: { type: String, required: false },
refund_amount: { type: Number, required: false },
refund_date: { type: Date, required: false }
}
});

module.exports = mongoose.model("Transaction", transactionSchema);