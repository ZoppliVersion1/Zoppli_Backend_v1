const mongoose = require("mongoose");
const { Schema } = mongoose;

const supportTicketSchema = new mongoose.Schema({
ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
issue_type: { type: String, enum: ['delivery', 'order', 'payment', 'technical', 'general'],
required: true },
description: { type: String, required: true },
status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], required: true,
default: 'open' },
assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTeam',
required: false },
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SupportTicket",supportTicketSchema );