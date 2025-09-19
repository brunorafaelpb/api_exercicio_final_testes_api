// userService.js
const { users } = require('../models/userModel');
const bcrypt = require('bcryptjs');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function registerUser(username, password) {
  if (findUserByUsername(username)) {
    throw new Error('Usuário já existe');
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
}

function validateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}

module.exports = {
  findUserByUsername,
  registerUser,
  validateUser,
  users,
};
