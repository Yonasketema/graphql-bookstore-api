const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "please provid comment"],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
