import Book from "../models/bookModel.js";

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.log(error.message);
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Public
export const createBook = async (req, res) => {
  try {
    const book = new Book({ ...req.body, user: "679760b1609ba3586e76b872" });
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    console.log(error.message);
  }
};
