require("dotenv").config({ path: ".env" });

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");

const db = require("./db");

const { verifyAndGetUser } = require("./auth");

mongoose
  .connect("mongodb://127.0.0.1:27017/bookg", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successfully");
  })
  .catch(() => console.log("> DB connection failed"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  async context({ req }) {
    const token = req.headers.authorization;
    const user = await verifyAndGetUser(token);

    return {
      ...db,
      user,
    };
  },
});

server
  .listen(4000)
  .then(({ url }) => console.log(`> 🚀 Apollo running on port ${url}`))
  .catch(() => console.log("> Apollo server not running"));
