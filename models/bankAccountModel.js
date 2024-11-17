cosnt mongoose = require("mongoose");
const {Schema} = mongoose;

const bankAccountSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
account_number: { type: String, required: true },
ifsc_code: { type: String, required: true },
bank_name: { type: String, required: true }
});

module.exports = mongoose.model("BankAccount",bankAccountSchema);