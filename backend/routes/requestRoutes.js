import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  acceptRequest,
  cancelRequest,
  createRequest,
  getMyRequests,
  getRequestById,
  getRequests,
  getRequestsForMe,
  rejectRequest,
  updateRequestToArrived,
  updateRequestToDelivered,
} from "../controllers/requestController.js";

const router = express.Router();

router.route("/").post(protect, createRequest).get(protect, getRequests);
router.route("/myRequests").get(protect, getMyRequests);
router.route("/requestsForMe").get(protect, getRequestsForMe);
router
  .route("/:id")
  .get(protect, getRequestById)
  .delete(protect, cancelRequest);
router.route("/:id/arrived").put(protect, updateRequestToArrived);
router.route("/:id/delivered").put(protect, updateRequestToDelivered);
router.route("/:id/accept").put(protect, acceptRequest);
router.route("/:id/reject").delete(protect, rejectRequest);

export default router;
