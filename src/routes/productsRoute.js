const express = require('express');
const {
  handleGetAllProducts,
  handleGetByIdProduct,
  handleCreateProduct,
  handleUpdateByIdProduct,
  handleDeleteByIdProduct,
  handlefindAllByCategoryIdProduct,
  handleSearchByNameProduct,
  handleCreateManyProducts,
} = require('../controllers/productsController');

const productsRouter = express.Router();

productsRouter.get('/', handleGetAllProducts);
productsRouter.get('/:id', handleGetByIdProduct);
productsRouter.post('/', handleCreateProduct);
productsRouter.put('/:id', handleUpdateByIdProduct);
productsRouter.delete('/:id', handleDeleteByIdProduct);
productsRouter.get('/category/:id', handlefindAllByCategoryIdProduct);
productsRouter.get('/search/:name', handleSearchByNameProduct);
productsRouter.post('/multiple', handleCreateManyProducts);

module.exports = productsRouter;
