import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  createReport,
  getAllReports,
} from '../controllers/reportController.js';
const router = express.Router();

router
  .route('/')
  .get(protect, admin, getAllReports)
  .post(protect, createReport);

export default router;
