import express from "express";
import {
  authUser,
  followUser,
  getAllUsers,
  getOtherUserProfile,
  getUserProfile,
  logout,
  registerUser,
  unfollowUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getAllUsers).post(registerUser);
router.route("/auth").post(authUser);
router.route("/logout").post(logout);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").get(getOtherUserProfile);
router.route("/:id/follow").put(protect, followUser);
router.route("/:id/unfollow").put(protect, unfollowUser);

export default router;
