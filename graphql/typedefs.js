const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    token: String
  }

  type Product {
    id: ID!
    name: String!
    value: Float!
    quantity: Int!
  }

  type ProductResult {
    message: String!
    product: Product
  }

  type Query {
    products: [Product!]!
    users: [User!]!
  }

  type Mutation {
    createProduct(name: String!, value: Float!, quantity: Int!): ProductResult!
    removeProduct(id: ID!, quantity: Int!): ProductResult!
    registerUser(username: String!, password: String!): User!
    login(username: String!, password: String!): User!
    listProducts: [Product!]!
  }
`;

module.exports = typeDefs;
