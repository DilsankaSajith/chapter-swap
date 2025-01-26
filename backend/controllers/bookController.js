import { books } from "../data/books.js";

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  res.json(books);
};
