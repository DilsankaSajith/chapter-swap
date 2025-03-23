import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatController.js";
const router = express.Router();

router.route("/").get(protect, fetchChats).post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);
router.route("/grouprename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

export default router;
