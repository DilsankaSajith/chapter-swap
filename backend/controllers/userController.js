import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    profilePicture,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    password,
  } = req.body;

  const userExists = await User.findOne({ email });
  const phoneExists = await User.findOne({ phone });

  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !postalCode ||
    !password
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (phoneExists) {
    res.status(400);
    throw new Error("Phone number already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    password,
    profilePicture,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.postalCode = req.body.postalCode || user.postalCode;

    if (req.body.password) {
      user.password = req.body.password || user.password;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Follow a user
// @route   PUT /api/users/:id/follow
// @access  Private
export const followUser = asyncHandler(async (req, res) => {
  if (req.user._id !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!user.followers.includes(req.user._id)) {
      await user.updateOne({ $push: { followers: req.user._id } });
      await currentUser.updateOne({ $push: { follwings: user._id } });
      res.status(200).json({ message: "User has been followed" });
    } else {
      res.status(403);
      throw new Error("You already followed this user");
    }
  } else {
    res.status(403);
    throw new Error("You cant follow yourself");
  }
});

// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
export const unfollowUser = asyncHandler(async (req, res) => {
  if (req.user._id !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (user.followers.includes(req.user._id)) {
      await user.updateOne({ $pull: { followers: req.user._id } });
      await currentUser.updateOne({ $pull: { follwings: user._id } });
      res.status(200).json({ message: "User has been unfollowed" });
    } else {
      res.status(403);
      throw new Error("You do not follow this user");
    }
  } else {
    res.status(403);
    throw new Error("You cant unfollow yourself");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});
