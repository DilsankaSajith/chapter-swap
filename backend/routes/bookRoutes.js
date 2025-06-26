import express from "express";
import {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  createBookReview,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(getBooks).post(protect, createBook);
router
  .route("/:id")
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);
router.route("/:id/reviews").post(protect, createBookReview);

export default router;
