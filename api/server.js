const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/bookg", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("> DB connection successfully");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      //context
    });

    server.listen(4000).then(() => console.log("> App running on port 4000"));
  })
  .catch(() => console.log("> DB connection failed"));
