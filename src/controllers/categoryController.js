const statusCodes = require('http-status-codes').StatusCodes;
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  searchCategoriesByName,
  createMultipleCategories,
  searchCategoryByName,
} = require('../services/categoryService');
const { categoryIsInUse } = require('../validators/categoriesValidators');

const handleGetAllCategories = async (_req, res) => {
  const categories = await getAllCategories();

  return res.status(statusCodes.OK).json(categories);
};

const handleGetCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryById(id);

  if (!category) return res.status(statusCodes.NOT_FOUND).json({ message: 'Category not found' });

  return res.status(statusCodes.OK).json(category);
};

const handleCreateCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(statusCodes.BAD_REQUEST).json({ message: '"name" is required' });

  const categoryExists = await searchCategoryByName(name);

  if (categoryExists) return res.status(statusCodes.CONFLICT).json({ message: 'Category already exists' });

  const category = await createCategory(name);

  return res.status(statusCodes.CREATED).json(category);
};

const handleUpdateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(statusCodes.BAD_REQUEST).json({ message: '"name" is required' })

  const categoryExists = await searchCategoryByName(name);

  if (categoryExists) return res.status(statusCodes.CONFLICT).json({ message: 'Category already exists' });;

  const category = await updateCategoryById(id, name);

  if (!category) return res.status(statusCodes.NOT_FOUND).json({ message: 'Category not found' });

  return res.status(statusCodes.OK).json(category);
};

const handleDeleteCategoryById = async (req, res) => {
  const { id } = req.params;

  if (await categoryIsInUse(id)) return res.status(statusCodes.BAD_REQUEST).json({ message: 'Category in use' });

  const category = await deleteCategoryById(id);

  if (!category) return res.status(statusCodes.NOT_FOUND).json({ message: 'Category not found' });

  return res.status(statusCodes.NO_CONTENT).json();
};

const handleSearchCategoriesByName = async (req, res) => {
  const { name } = req.params;
  const categories = await searchCategoriesByName(name);

  return res.status(statusCodes.OK).json(categories);
};

const handleCreateMultipleCategories = async (req, res) => {
  const categories = req.body;
  const insertedIds = await createMultipleCategories(categories);

  return res.status(statusCodes.CREATED).json(insertedIds);
};

module.exports = {
  handleGetAllCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategoryById,
  handleDeleteCategoryById,
  handleSearchCategoriesByName,
  handleCreateMultipleCategories,
};
