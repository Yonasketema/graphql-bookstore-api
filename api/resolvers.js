const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");

const { authenticated, authorized } = require("./auth");
const { signToken } = require("./utils");

const resolvers = {
  Query: {
    async allbooks(_, __, ctx) {
      const books = await ctx.Book.find();
      return books;
    },
    async bookgenre(_, { input }, ctx) {
      const books = await ctx.Book.find({ genre: input.genre });
      return books;
    },
    async book(_, { input }, ctx) {
      const book = await ctx.Book.findById(ObjectId(input)).populate(
        "comments"
      );

      return book;
    },
  },
  Mutation: {
    async signup(_, { input }, ctx) {
      const { name, email, password, passwordConfirm, role } = input;

      const user = await ctx.User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        role: role,
      });

      const token = signToken(user.id);

      return { token, id: user.id };
    },
    async login(_, { input }, ctx) {
      const { email, password } = input;

      const user = await ctx.User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Error("Incorrect email or password");
      }

      const token = signToken(user.id);

      return { token: token, id: user.id };
    },
    comment: authenticated(async (_, { input }, ctx) => {
      const { comment, book } = input;

      const { user, Comments } = ctx;

      const newComment = await Comments.create({
        comment,
        book,
        user: user.id,
      });

      return newComment;
    }),
    saveBook: authenticated(async (_, { bookId }, ctx) => {
      const { user, User } = ctx;
      const newUser = await User.findByIdAndUpdate(
        user.id,
        {
          $push: { savedBooks: bookId },
        },
        {
          new: true,
        }
      );

      if (!newUser) {
        throw new Error("No user found with is ID");
      }

      return newUser;
    }),
    unSaveBook: authenticated(async (_, { bookId }, ctx) => {
      const { user, User } = ctx;
      const newUser = await User.findByIdAndUpdate(
        user.id,
        {
          $pull: { savedBooks: bookId },
        },
        {
          new: true,
        }
      );

      if (!newUser) {
        throw new Error("No user found with is ID");
      }

      return newUser;
    }),

    like: authenticated(async (_, { bookId }, ctx) => {
      const { user, Book } = ctx;
      const book = await Book.findByIdAndUpdate(
        bookId,
        {
          $push: { likes: user.id },
        },
        {
          new: true,
        }
      );

      if (!book) {
        throw new Error("No book found with is ID");
      }

      return book;
    }),
    disLike: authenticated(async (_, { bookId }, ctx) => {
      const { user, Book } = ctx;
      const book = await Book.findByIdAndUpdate(
        bookId,
        {
          $pull: { likes: user.id },
        },
        {
          new: true,
        }
      );

      if (!book) {
        throw new Error("No book found with is ID");
      }

      return book;
    }),
    createBook: authenticated(
      authorized("ADMIN", async (_, { input }, ctx) => {
        console.log("hello create");

        const { Book } = ctx;
        const book = await Book.create(input);

        return book;
      })
    ),
  },
};

module.exports = resolvers;
