// productService.js
const { products } = require('../models/productModel');
let uuidv4;
import('uuid').then(mod => { uuidv4 = mod.v4; });

async function addProduct(name, value, quantity) {
  const existing = products.find(p => p.name === name);
  if (existing) {
    const oldQuantity = existing.quantity;
    existing.quantity += quantity;
    if (existing.value !== value) {
      existing.value = value;
    }
    return {
      message: `Produto já cadastrado, quantidade incrementada em ${quantity}.`,
      product: existing
    };
  }
  if (!uuidv4) {
    const mod = await import('uuid');
    uuidv4 = mod.v4;
  }
  const product = {
    id: uuidv4(),
    name,
    value,
    quantity,
  };
  products.push(product);
  return {
    message: 'Produto cadastrado com sucesso!',
    product
  };
}

function getProducts() {
  return products;
}

function removeProduct(id, quantity) {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Produto não encontrado');
  if (product.quantity < quantity) throw new Error('Quantidade insuficiente para remoção');
  product.quantity -= quantity;
  let message = 'Produto removido com sucesso!';
  if (product.quantity === 0) {
    const idx = products.indexOf(product);
    products.splice(idx, 1);
    message += ' Produto removido do estoque.';
  }
  return {
    message,
    product
  };
}

module.exports = {
  addProduct,
  getProducts,
  removeProduct,
};
