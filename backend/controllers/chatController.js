import asyncHandler from "../middleware/asyncHandler.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// @desc    Access or create a chat
// @route   POST /api/chats
// @access  Private
export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("userId not sent");
  }

  let chatExist = await Chat.find({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chatExist = await User.populate(chatExist, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chatExist.length > 0) {
    res.status(200).json(chatExist[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.find({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).json(fullChat);
  }
});

// @desc    Fetch chats
// @route   GET /api/chats
// @access  Private
export const fetchChats = asyncHandler(async (req, res) => {
  let chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  res.status(200).json(chats);
});

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    res.status(400);
    throw new Error("More that 2 users are required to create a group chat");
  }

  users.push(req.user._id);

  const createdGroupChat = await Chat.create({
    chatName: req.body.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  const fullGroupChat = await Chat.findOne({ _id: createdGroupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
});

// @desc    Rename group chat
// @route   PUT /api/chats/grouprename
// @access  Private
export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Resource not found");
  } else {
    res.status(200).json(updatedChat);
  }
});

// @desc    Add user to group chat
// @route   PUT /api/chats/groupadd
// @access  Private
export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const userAddedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!userAddedChat) {
    res.status(404);
    throw new Error("Resource not found");
  } else {
    res.status(200).json(userAddedChat);
  }
});

// @desc    Remove user from group chat
// @route   PUT /api/chats/groupremove
// @access  Private
export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const userRemovedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!userRemovedChat) {
    res.status(404);
    throw new Error("Resource not found");
  } else {
    res.status(200).json(userRemovedChat);
  }
});
