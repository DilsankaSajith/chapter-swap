import asyncHandler from "../middleware/asyncHandler.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// @desc    Send message
// @route   POST /api/message
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error("Type something to send");
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  var message = await Message.create(newMessage);

  message = await message.populate("sender", "name profilePicture");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name profilePicture email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message,
  });

  res.status(200).json(message);
});

// @desc    Get all messages
// @route   GET /api/message/:chatId
// @access  Private
export const allMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name profilePicture email")
    .populate("chat");

  res.status(200).json(messages);
});
