// productController.js
const productService = require('../services/productService');

async function addProduct(req, res) {
  const { name, value, quantity } = req.body;
  if (!name || value == null || quantity == null) {
    return res.status(400).json({ error: 'Nome, valor e quantidade obrigatórios' });
  }
  if (value < 0) {
    return res.status(400).json({ error: 'Valor não pode ser negativo' });
  }
  if (quantity < 0) {
    return res.status(400).json({ error: 'Quantidade não pode ser negativa' });
  }
  try {
    const result = await productService.addProduct(name, value, quantity);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function getProducts(req, res) {
  res.json(productService.getProducts());
}

function removeProduct(req, res) {
  const { id, quantity } = req.body;
  if (!id || quantity == null) {
    return res.status(400).json({ error: 'ID e quantidade obrigatórios' });
  }
  try {
    const result = productService.removeProduct(id, quantity);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  addProduct,
  getProducts,
  removeProduct,
};
