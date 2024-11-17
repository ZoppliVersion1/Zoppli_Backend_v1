// Initiate payment controller
const razorpay = require('../config/razorpayConfig'); // Import Razorpay configuration
const Payment = require('../models/paymentModel'); // Payment model

exports.initiatePayment = async (req, res) => {
    const { order_id, amount, currency = 'INR', payment_method } = req.body;

    try {
        // Convert amount to smallest currency unit (e.g., paise for INR)
        const amountInPaise = Math.round(amount * 100);

        // Create a Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency,
            receipt: order_id,
            payment_capture: 1, // Auto-capture after successful payment
        });

        // Save the payment details to your DB
        const paymentRecord = new Payment({
            order_id,
            amount,
            currency,
            payment_method,
            transaction_id: razorpayOrder.id, // Use Razorpay order ID as the transaction ID
            payment_status: 'unpaid',
            payment_gateway_reference: razorpayOrder.id // Store the order reference for further tracking
        });

        await paymentRecord.save();

        res.status(200).json({ 
            success: true, 
            message: 'Payment initiated', 
            razorpayOrder
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ success: false, message: 'Error initiating payment', error });
    }
};


// Verify payment status controller
exports.verifyPayment = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
        // Verify payment signature using Razorpay's utility function
        const crypto = require('crypto');
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        // Find the payment record and update its status to paid
        const paymentRecord = await Payment.findOneAndUpdate(
            { transaction_id: razorpay_order_id },
            { payment_status: 'paid', updated_at: new Date() },
            { new: true }
        );

        if (!paymentRecord) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.status(200).json({ success: true, message: 'Payment verified', payment: paymentRecord });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment', error });
    }
};

// Retrieve payment status controller
exports.getPaymentStatusByOrder = async (req, res) => {
    const { order_id } = req.params;

    try {
        // Fetch payment status for the given order
        const paymentRecord = await Payment.findOne({ order_id });

        if (!paymentRecord) {
            return res.status(404).json({ success: false, message: 'No payment record found for this order' });
        }

        res.status(200).json({ success: true, payment_status: paymentRecord.payment_status, payment_details: paymentRecord });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ success: false, message: 'Error fetching payment status', error });
    }
};