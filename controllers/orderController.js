const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

// Place an order
exports.placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user._id, status: 'active' }).populate('items.dish_id');
        
        if (!cart) {
            return res.status(404).json({ message: 'No active cart found' });
        }

        // Create the order from cart items
        const order = new Order({
            customer_id: req.user._id,
            restaurant_id: cart.restaurant_id,
            delivery_address_id: req.body.delivery_address_id,  // Delivery address from user
            total_amount: cart.total_amount,
            items: cart.items.map(item => ({
                dish_id: item.dish_id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price
            })),
            order_priority: req.body.order_priority || 'normal'  // Default is normal
        });

        const savedOrder = await order.save();
        await Cart.findOneAndDelete({ user_id: req.user._id, status: 'active' });  // Clear the cart

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve order history for the user
exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ customer_id: req.user._id })
            .populate('restaurant_id')
            .populate('items.dish_id')
            .sort({ created_at: -1 });  // Sort by latest

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin/Owner/Delivery)
exports.updateOrderStatus = async (req, res) => {
    const { order_id, new_status } = req.body;

    try {
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.order_status === 'delivered' || order.order_status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot update a completed or cancelled order' });
        }

        // Update the order status only if valid
        const allowedStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(new_status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        order.order_status = new_status;
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order (User)
exports.cancelOrder = async (req, res) => {
    const { order_id } = req.body;

    try {
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow cancellation in specific states
        if (order.order_status !== 'pending' && order.order_status !== 'confirmed') {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }

        order.order_status = 'cancelled';
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
