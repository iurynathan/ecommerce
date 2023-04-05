const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  searchByName,
  createMany,
  findByName,
} = require("../models/categoryModel");

const categoriesCollection = "categories";

const getAllCategories = async () => getAll(categoriesCollection);

const getCategoryById = async id => getById(categoriesCollection, id);

const createCategory = async name => create(categoriesCollection, name);

const updateCategoryById = async (id, name) => updateById(categoriesCollection, id, name);

const deleteCategoryById = async id => deleteById(categoriesCollection, id);

const searchCategoryByName = async name => findByName(categoriesCollection, name);

const searchCategoriesByName = async name => searchByName(categoriesCollection, name);

const createMultipleCategories = async categories => createMany(categoriesCollection, categories);

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  searchCategoryByName,
  searchCategoriesByName,
  createMultipleCategories,
};
