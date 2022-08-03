const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: Array,
      required: [true, "a book must have title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "a book must have author"],
    },
    publicationDate: {
      type: Date,
      default: Date.now,
    },
    genre: {
      type: String,
      required: [true, "a book must have a type"],
      enum: ["FICTION", "BIO", "HISTORICAL", "STARTUP", "SCIENCE", "COMIC"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    img: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.virtual("comments", {
  ref: "comment",
  foreignField: "book",
  localField: "_id",
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
