import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

// @desc    Get all users
// @route   GET /api/chats/users?search=sajith
// @access  Private
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});
