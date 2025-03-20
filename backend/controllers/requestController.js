import Request from "../models/requestModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Create a request
// @route   POST /api/requests
// @access  Private
export const createRequest = asyncHandler(async (req, res) => {
  const { owner, book } = req.body;

  const requestExists = await Request.findOne({
    owner,
    book,
    user: req.user._id,
  });

  if (requestExists) {
    res.status(400);
    throw new Error("You already requested this book");
  }

  const user = await User.findById(req.user._id).select("-password");

  if (user.points === 0) {
    res.status(403);
    throw new Error("Please earn points to make a request");
  }

  user.points = user.points - 1;
  await user.save();

  const request = new Request({ ...req.body, user: req.user._id });
  const createdRequest = await request.save();

  res.status(201).json(createdRequest);
});

// @desc    Get logged in user requests
// @route   GET /api/requests/myRequests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ user: req.user._id })
    .populate("book", "image title")
    .populate("owner", "name")
    .sort({ createdAt: -1 });
  res.status(200).json(requests);
});

// @desc    Get requests for the logged in user
// @route   GET /api/requests/requestsForMe
// @access  Private
export const getRequestsForMe = asyncHandler(async (req, res) => {
  const requests = await Request.find({ owner: req.user._id })
    .populate("book", "image title")
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.status(200).json(requests);
});

// @desc    Update request to arrived
// @route   PUT /api/requests/:id/arrived
// @access  Private
export const updateRequestToArrived = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(req.user._id).select("-password");
  const owner = await User.findById(request.owner);

  if (request) {
    if (!request.isAccepted) {
      res.status(400);
      throw new Error("You request is not accepted yet");
    }

    if (!request.isDelivered) {
      res.status(400);
      throw new Error("Book is not delivered yet");
    }
    request.isArrived = true;
    request.arrivedAt = Date.now();
    user.points = user.points + 1;
    owner.points = owner.points + 2;

    await user.save();
    await owner.save();
    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc    Update request to delivered
// @route   PUT /api/requests/:id/delivered
// @access  Private
export const updateRequestToDelivered = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (request) {
    request.isAccepted = true;
    request.isDelivered = true;
    request.deliveredAt = Date.now();
    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest);
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc    Accept request
// @route   PUT /api/requests/:id/accept
// @access  Private
export const acceptRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (request) {
    if (request.isAccepted) {
      res.status(400);
      throw new Error("You already accepted this request");
    }

    request.isAccepted = true;
    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest);
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private
export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(request.user);

  user.points = user.points + 1;
  await user.save();

  if (request) {
    await Request.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Request rejected" });
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc    Cancel request
// @route   DELETE /api/requests/:id
// @access  Private
export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  const user = await User.findById(req.user._id).select("-password");

  if (request) {
    await Request.deleteOne({ _id: request._id });
    user.points = user.points + 1;
    await user.save();
    res.status(200).json({ message: "Request canceled" });
  } else {
    res.status(404);
    throw new Error("Request not found");
  }
});

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private/Admin
export const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({}).populate("user owner", "name");
  res.status(200).json(requests);
});

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById({ _id: req.params.id })
    .populate("user", "name profilePicture email points")
    .populate("book", "title image author");
  if (request) {
    res.status(200).json(request);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});
