import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteNotification,
  getAllNotifications,
  readNotification,
} from "../controllers/notificationController.js";

const router = express.Router();
router.route("/").get(protect, getAllNotifications);
router.route("/:id").delete(protect, deleteNotification);
router.route("/:id/read").put(protect, readNotification);

export default router;
