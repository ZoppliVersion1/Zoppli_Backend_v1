// adminController.js

// Imports
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const Order = require('../models/orderModel');

// Manage Users Section

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password for security
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update user information
exports.updateUserByAdmin = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, phone_number, user_type } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { name, email, phone_number, user_type },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a user
exports.deleteUserByAdmin = async (req, res) => {
    const { user_id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(user_id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Manage Restaurants Section

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ success: true, restaurants });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update restaurant information
exports.updateRestaurantByAdmin = async (req, res) => {
    const { restaurant_id } = req.params;
    const { name, address, cuisine, contact } = req.body;

    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurant_id,
            { name, address, cuisine, contact },
            { new: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a restaurant
exports.deleteRestaurantByAdmin = async (req, res) => {
    const { restaurant_id } = req.params;

    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurant_id);

        if (!deletedRestaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Manage Orders Section

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user restaurant').exec();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const { order_id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete an order
exports.deleteOrderByAdmin = async (req, res) => {
    const { order_id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(order_id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
