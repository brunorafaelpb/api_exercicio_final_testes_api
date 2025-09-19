const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

module.exports = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const user = jwt.verify(token, SECRET);
      return { user };
    } catch (err) {
      throw new Error('Token inválido ou expirado');
    }
  }
  return {};
};
