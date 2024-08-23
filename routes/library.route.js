const express = require("express");
const BookModel = require("../models/book.model");
const authorize = require("../middlewares/authorization.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const libraryRouter = express.Router();

libraryRouter.post(
  "/create-book",
  authMiddleware,
  authorize(["CREATOR"]),
  async (req, res) => {
    try {
      const { title, year, author } = req.body;
      const userId = req.user._id;

      const book = new BookModel({
        title,
        year,
        author,
        createdBy: userId,
      });

      await book.save();
      res.status(201).json({
        message: "Book created successfully",
        book,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error while creating: ${error.message}`,
      });
    }
  }
);

libraryRouter.get(
  "/view-books/:id",
  authorize(["VIEWER", "CREATOR"]),
  async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user._id;

    try {
      const book = await BookModel.findOne({ _id: bookId, createdBy: userId });

      if (!book) {
        return res.status(404).json({
          message: "Book not found or you don't have access to this book",
        });
      }

      res.status(200).json({
        message: "Book fetched successfully",
        book,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error while fetching book: ${error.message}`,
      });
    }
  }
);

libraryRouter.get(
  "/view-books",
  authorize(["VIEWER", "CREATOR"]),
  async (req, res) => {
    const createdBy = req.user._id;
    try {
      const books = await BookModel.find({ createdBy });

      res.status(200).json({
        message: "Books fetched successfully",
        books,
      });
    } catch (error) {
      res.status(404).json({
        message: `Error while fetching ${error}`,
      });
    }
  }
);

libraryRouter.get(
  "/view-AllBooks",
  authorize(["VIEW_ALL", "CREATOR", "VIEWER"]),
  async (req, res) => {
    try {
      const books = await BookModel.find();
      const userId = req.user._id;

      const booksWithOwnership = books.map((book) => ({
        ...book._doc,
        isOwner: book.createdBy.toString() === userId.toString(),
      }));

      res.status(200).json({
        message: "Books fetched successfully",
        books: booksWithOwnership,
      });
    } catch (error) {
      res.status(404).json({
        message: `Error while fetching ${error}`,
      });
    }
  }
);

libraryRouter.patch(
  "/update-book/:id",
  authorize(["CREATOR"]),
  async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user._id;
    const payload = req.body;
    try {
      const book = await BookModel.findOne({ _id: bookId });

      if (!book) {
        return res.status(404).send("book not found");
      }

      if (book.createdBy.toString() === userId.toString()) {
        const updatedBook = await BookModel.findByIdAndUpdate(
          { _id: bookId },
          payload
        );
        res.status(202).json({
          message: "Books updated successfully",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: `Error while updating ${error}`,
      });
    }
  }
);

libraryRouter.delete(
  "/delete-book/:id",
  authorize(["CREATOR"]),
  async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user._id;

    try {
      const book = await BookModel.findOne({ _id: bookId });

      if (!book) {
        return res.status(404).send("book not found");
      }

      if (book.createdBy.toString() === userId.toString()) {
        const book = await BookModel.findByIdAndDelete({ _id: bookId });
        res.status(204).json({
          message: "Books deleted successfully",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: `Error while deleting ${error}`,
      });
    }
  }
);

module.exports = libraryRouter;
