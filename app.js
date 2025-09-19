// app.js
const express = require('express');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const authenticateToken = require('./middleware/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(express.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas de usuário
app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/users', userController.getUsers);

// Rotas de produto (protegidas)
app.post('/products', authenticateToken, (req, res) => productController.addProduct(req, res));
app.get('/products', authenticateToken, productController.getProducts);
app.delete('/products', authenticateToken, productController.removeProduct);

module.exports = app;
