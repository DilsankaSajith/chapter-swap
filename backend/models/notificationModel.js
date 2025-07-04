import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: false,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: false,
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: [
        "Followed",
        "Book Added",
        "Requested",
        "Accepted",
        "Rejected",
        "Canceled",
        "Delivered",
        "Arrived",
      ],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
