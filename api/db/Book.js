const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  year: String,
  author: String,
  genre: String,
});

const Book = new mongoose.model("Book", bookSchema);

module.exports = Book;
