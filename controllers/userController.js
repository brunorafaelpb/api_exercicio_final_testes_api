// userController.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const SECRET = 'supersecret';

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
  }
  try {
    const user = userService.registerUser(username, password);
    res.status(201).json({ username: user.username });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
  }
  if (!userService.validateUser(username, password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}

function getUsers(req, res) {
  res.json(userService.users);
}

module.exports = {
  register,
  login,
  getUsers,
};
