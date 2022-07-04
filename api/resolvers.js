const Book = require("./db/Book");

const resolvers = {
  Query: {
    async books(_, { input }) {
      let query = Book.find();

      if (input && input.genre) {
        query = Book.find({ genre: input.genre });
      }

      return await query;
    },
  },
  Mutation: {
    async newBook(_, { input }) {
      const book = await Book.create(input);
      return book;
    },
  },
};

module.exports = resolvers;
