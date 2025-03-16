import asyncHandler from "../middleware/asyncHandler.js";
import Book from "../models/bookModel.js";

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({}).sort({ createdAt: -1 });
  res.status(200).json(books);
});

// @desc    Create a book
// @route   POST /api/books
// @access  Public
export const createBook = asyncHandler(async (req, res) => {
  const book = new Book({ ...req.body, user: req.user._id });
  const createdBook = await book.save();

  res.status(201).json(createdBook);
});

// @desc    Fetch a product
// @route   GET /api/books/:id
// @access  Public

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    return res.json(book);
  }

  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private

export const updateBook = asyncHandler(async (req, res) => {
  const { title, author, description, category } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.category = category || book.category;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.deleteOne({ _id: book._id });
    res.status(200).json({ message: "Book deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});
