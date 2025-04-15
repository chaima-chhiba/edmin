
const Notification = require('../models/Notifications');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



module.exports = {
  createNotification,
  getNotifications,

};
