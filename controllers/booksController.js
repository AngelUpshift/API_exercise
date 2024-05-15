const mongoose = require("mongoose");
const Book = require("../models/booksModel");
const asyncHandler = require("express-async-handler");

const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const postBook = asyncHandler(async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const bookToDelete = await Book.findByIdAndDelete(id);

    if (!bookToDelete) {
      res.status(404).json({ message: `cannot find any book with ID: ${id}` });
    }

    res.status(200).json(bookToDelete);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateBook = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body);

    if (!book) {
      res.status(404).json({ message: `cannot find any book with ID: ${id}` });
    }

    const updatedBook = await Book.findById(id);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
module.exports = {
  getBooks,
  postBook,
  deleteBook,
  updateBook,
};
