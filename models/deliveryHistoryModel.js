const mongoose = require("mongoose");
const { Schema } = mongoose;

const deliveryHistorySchema = new mongoose.Schema({
delivery_partner_id: { type: mongoose.Schema.Types.ObjectId, ref:
'DeliveryPartner', required: true },
order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
delivery_date: { type: Date, required: true }
});

module.exports = mongoose.model("DeliveryHistory", deliveryHistorySchema);