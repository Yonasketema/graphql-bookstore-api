const { gql } = require("apollo-server");

const typeDefs = gql`
  enum bookGenre {
    HISTORICAL
    FICTION
    BIO
  }

  input bookInput {
    genre: String
  }
  input newBookInput {
    title: String!
    year: String!
    author: String!
    genre: String!
  }

  type Book {
    title: String!
    year: String!
    author: String!
    genre: String!
    id: ID!
  }

  type Query {
    books(input: bookInput): [Book]!
  }
  type Mutation {
    newBook(input: newBookInput!): Book!
  }
`;

module.exports = typeDefs;
