const userService = require('../services/userService');
const productService = require('../services/productService');

const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

module.exports = {
  Query: {
    products: () => productService.getProducts(),
    users: () => userService.users.map(u => ({ username: u.username })),
  },
  Mutation: {
    createProduct: async (_, { name, value, quantity }, context) => {
      if (!context.user) throw new Error('Autenticação obrigatória');
      if (!name || value == null || quantity == null) {
        throw new Error('Nome, valor e quantidade obrigatórios');
      }
      if (value < 0) {
        throw new Error('Valor não pode ser negativo');
      }
      if (quantity < 0) {
        throw new Error('Quantidade não pode ser negativa');
      }
      return await productService.addProduct(name, value, quantity);
    },
    removeProduct: async (_, { id, quantity }, context) => {
      if (!context.user) throw new Error('Autenticação obrigatória');
      if (!id || quantity == null) {
        throw new Error('ID e quantidade obrigatórios');
      }
      return productService.removeProduct(id, quantity);
    },
    listProducts: () => productService.getProducts(),
    registerUser: async (_, { username, password }) => {
      if (!username || !password) throw new Error('Usuário e senha obrigatórios');
      const user = userService.registerUser(username, password);
      return { username: user.username };
    },
    login: async (_, { username, password }) => {
      if (!username || !password) throw new Error('Usuário e senha obrigatórios');
      const valid = userService.validateUser(username, password);
      if (!valid) throw new Error('Usuário ou senha inválidos');
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      return { username, token };
    },
  },
};
