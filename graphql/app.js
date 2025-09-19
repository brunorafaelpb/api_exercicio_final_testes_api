const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const authenticate = require('./authenticate');
require('dotenv').config();

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authenticate(req)
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app });
}

startApollo();

module.exports = app;
