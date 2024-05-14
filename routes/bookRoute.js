const express = require("express");
const router = express.Router();
const {
  postBook,
  getBooks,
  deleteBook,
  updateBook,
} = require("../controllers/booksController");

router.get("/", getBooks);

router.post("/", postBook);

router.delete("/:id", deleteBook);

router.put("/:id", updateBook);

module.exports = router;
