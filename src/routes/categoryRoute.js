const express = require('express');
const {
  handleGetAllCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategoryById,
  handleDeleteCategoryById,
  handleSearchCategoriesByName,
  handleCreateMultipleCategories,
} = require('../controllers/categoryController');

const categoriesRouter = express.Router();

categoriesRouter.get('/', handleGetAllCategories);
categoriesRouter.get('/:id', handleGetCategoryById);
categoriesRouter.post('/', handleCreateCategory);
categoriesRouter.put('/:id', handleUpdateCategoryById);
categoriesRouter.delete('/:id', handleDeleteCategoryById);
categoriesRouter.get('/search/:name', handleSearchCategoriesByName);
categoriesRouter.post('/multiple', handleCreateMultipleCategories);

module.exports = categoriesRouter;