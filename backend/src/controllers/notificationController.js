import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    // Return user-specific notifications and general broadcast notifications (recipient: null)
    const notifications = await Notification.find({
      $or: [{ recipient: req.user._id }, { recipient: null }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      $or: [{ recipient: req.user._id }, { recipient: null }],
      isRead: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { $or: [{ recipient: req.user._id }, { recipient: null }], isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const createBroadcastNotification = async (req, res, next) => {
  try {
    const { title, marathiTitle, message, marathiMessage, type } = req.body;
    const notification = await Notification.create({
      recipient: null, // Broadcast
      title,
      marathiTitle: marathiTitle || '',
      message,
      marathiMessage: marathiMessage || '',
      type: type || 'System',
    });

    res.status(201).json({
      success: true,
      message: 'Broadcast notification sent successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
