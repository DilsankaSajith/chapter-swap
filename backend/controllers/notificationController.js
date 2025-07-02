import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notificationModel.js";

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ receivers: req.user._id })
    .populate("book", "title image")
    .populate("sender", "profilePicture");
  res.status(200).json(notifications);
});
