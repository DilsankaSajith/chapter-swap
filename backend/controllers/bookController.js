import asyncHandler from "../middleware/asyncHandler.js";
import Book from "../models/bookModel.js";

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const books = await Book.find({ ...keyword }).sort({ createdAt: -1 });
  res.status(200).json(books);
});

// @desc    Create a book
// @route   POST /api/books
// @access  Public
export const createBook = asyncHandler(async (req, res) => {
  /* user, title, isbn, author, description, image, category */

  if (
    !req.body.title ||
    !req.body.isbn ||
    !req.body.author ||
    !req.body.description ||
    !req.body.image ||
    !req.body.category
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const book = new Book({ ...req.body, user: req.user._id });
  const createdBook = await book.save();

  res.status(201).json(createdBook);
});

// @desc    Fetch a book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "user",
    "_id name profilePicture"
  );

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

// @desc    Review a book
// @route   POST /api/books/:id/reviews
// @access  Private
export const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const book = await Book.findById(req.params.id);
  if (book) {
    const alreadyReviewed = book.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Book already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating =
      book.reviews.reduce((acc, review) => acc + review.rating, 0) /
      book.reviews.length;

    await book.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Get top rated books
// @route   GET /api/books/top
// @access  Public
export const getTopBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(books);
});

// @desc    Add and remove from favorites
// @route   PUT /api/books/:id/addToFavorite
// @access  Private
export const addToFavorite = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    if (!book.favoritedBy.includes(req.user._id)) {
      await book.updateOne({ $push: { favoritedBy: req.user._id } });
      res.status(200).json({ message: "Book has been added to favorites" });
    } else {
      await book.updateOne({ $pull: { favoritedBy: req.user._id } });
      res.status(200).json({ message: "Book has been removed from favorites" });
    }
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Get favorite books
// @route   GET /api/books/favorites
// @access  Private

export const getFavoriteBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ favoritedBy: req.user._id });
  if (!books) {
    res.status(400).json({ message: "No books in favorites" });
  }
  res.status(200).json(books);
});
