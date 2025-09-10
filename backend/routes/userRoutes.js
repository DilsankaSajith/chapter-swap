import express from 'express';
import {
  authUser,
  deleteUser,
  followUser,
  getAllUsers,
  getOtherUserProfile,
  getUserProfile,
  logout,
  makeAdmin,
  registerUser,
  unfollowUser,
  updateUserProfile,
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getAllUsers).post(registerUser);
router.route('/auth').post(authUser);
router.route('/logout').post(logout);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .get(getOtherUserProfile)
  .put(protect, admin, makeAdmin)
  .delete(protect, admin, deleteUser);
router.route('/:id/follow').put(protect, followUser);
router.route('/:id/unfollow').put(protect, unfollowUser);

export default router;
