const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
payment_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true
},
order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
payment_status: { type: String, enum: ['paid', 'unpaid', 'failed', 'refunded'], default:
'unpaid' },
payment_method: { type: String, enum: ['credit_card', 'UPI', 'cash_on_delivery',
'net_banking', 'wallet'], required: true },
transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction',
required: true },
refund_status: { type: String, enum: ['initiated', 'completed', 'not_applicable'],
required: false },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);