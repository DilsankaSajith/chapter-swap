import express from 'express';
import {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks,
  addToFavorite,
  getFavoriteBooks,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getBooks).post(protect, createBook);
router.get('/top', getTopBooks);
router.get('/favorites', protect, getFavoriteBooks);
router
  .route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);
router.route('/:id/reviews').post(protect, createBookReview);
router.route('/:id/addToFavorite').put(protect, addToFavorite);

export default router;
