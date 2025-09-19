// userModel.js
const bcrypt = require('bcryptjs');

const users = [{
    username: 'bruno', 
    password: bcrypt.hashSync('1234', 8)
  },
  {
    username: 'fernanda', 
    password: bcrypt.hashSync('4321', 8)
  }];

module.exports = {
  users,
};
