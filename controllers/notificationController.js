const Notification = require('../models/notificationModel');
const mongoose = require('mongoose');

// Retrieve all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming `req.user._id` is set by authentication middleware

        const notifications = await Notification.find({ user_id: userId })
            .sort({ created_at: -1 }); // Latest notifications first

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving notifications', error });
    }
};

// Send a new notification to a user
exports.sendNotification = async (req, res) => {
    try {
        const { user_id, message, type } = req.body;

        // Validate required fields
        if (!user_id || !message || !type) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newNotification = new Notification({
            notification_id: new mongoose.Types.ObjectId(),
            user_id,
            message,
            type
        });

        await newNotification.save();

        res.status(201).json({ success: true, message: 'Notification sent successfully', data: newNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending notification', error });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const deletedNotification = await Notification.findByIdAndDelete(notificationId);
      
      if (!deletedNotification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
  
      res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting notification', error });
    }
  };