import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllNotifications } from "../controllers/notificationController.js";

const router = express.Router();
router.route("/").get(protect, getAllNotifications);

export default router;
