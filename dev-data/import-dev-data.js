const fs = require("fs");
const mongoose = require("mongoose");

const Book = require("./../api/db/book");

DATABASE_URL = "mongodb://127.0.0.1:27017/bookg";

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("> DB connection successfully"))
  .catch(() => console.log("> DB connection failed"));

const port = process.env.PORT || 8000;

//READ JSON FILE

const books = JSON.parse(fs.readFileSync("./books.json", "utf-8"));

const importData = async () => {
  try {
    await Book.create(books);
    console.log("> Data successfully loaded !");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// Delete data from DB

const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log("> Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

switch (process.argv[2]) {
  case "--import":
    importData();
    break;
  case "--delete":
    deleteData();
    break;
  default:
    process.exit();
}

//  node import-dev-data.js --import
