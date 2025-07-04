import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notificationModel.js";

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ receivers: req.user._id })
    .populate("book", "title image")
    .populate("sender", "profilePicture name")
    .sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    await Notification.deleteOne({ _id: notification._id });
    res.status(200).json({ message: "Notification deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Update notification to read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: "Notification read" });
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});
