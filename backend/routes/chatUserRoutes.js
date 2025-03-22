import express from "express";
import { allUsers } from "../controllers/chatUserController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, allUsers);

export default router;
