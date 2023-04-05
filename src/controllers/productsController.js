const statusCodes = require('http-status-codes').StatusCodes;
const { ObjectId } = require('mongodb');
const {
  getAllProducts,
  getByIdProduct,
  createProduct,
  updateByIdProduct,
  deleteByIdProduct,
  searchByNameProduct,
  findAllByCategoryIdProduct,
  createManyProducts,
  findByNameProduct,
} = require("../services/productService");
const validateFields = require('../validators/productsValidators');

const handleGetAllProducts = async (_req, res) => {
  const products = await getAllProducts();
  return res.status(statusCodes.OK).json(products);
};

const handleGetByIdProduct = async (req, res) => {
  const { id } = req.params;

  if (ObjectId.isValid(id) === false) return res.status(statusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Invalid id' });

  const product = await getByIdProduct(id);

  if (!product) return res.status(statusCodes.NOT_FOUND).json({ message: 'Product not found' });

  return res.status(statusCodes.OK).json(product);
};

const handleCreateProduct = async (req, res) => {
  const expectedFields = ['name', 'categoryId', 'price', 'description', 'brand', 'stock'];
  const productData = {};
  const validation = validateFields(req.body, expectedFields);
  const productExists = await findByNameProduct(req.body.name);

  if (productExists) return res.status(statusCodes.CONFLICT).json({ message: 'Product already exists' });

  if (!validation.success) {
    return res.status(statusCodes.BAD_REQUEST).json({ message: validation.message });
  }
  
  expectedFields.forEach(field => {
    if (req.body[field]) {
      productData[field] = req.body[field];
    }
  });

  const createdProduct = await createProduct(productData);
  return res.status(statusCodes.CREATED).json(createdProduct);
};

const handleUpdateByIdProduct = async (req, res) => {
  const { id } = req.params;

  if (ObjectId.isValid(id) === false) return res.status(statusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Invalid id' });

  const expectedFields = ['name', 'categoryId', 'price', 'description', 'brand', 'stock'];
  const productData = req.body;

  Object.keys(productData).forEach(key => {
    if (!expectedFields.includes(key)) {
      delete productData[key];
    }
  });

  const updatedProduct = await updateByIdProduct(id, productData);

  if (!updatedProduct) return res.status(statusCodes.NOT_FOUND).json({ message: 'Product not found' });

  return res.status(statusCodes.OK).json({ message: 'Product updated successfully' });
};

const handleDeleteByIdProduct = async (req, res) => {
  const { id } = req.params;
  const product = await deleteByIdProduct(id);

  if (ObjectId.isValid(id) === false) return res.status(statusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Invalid id' });

  if (!product) return res.status(statusCodes.NOT_FOUND).json({ message: 'Product not found' });

  return res.status(statusCodes.OK).json({ message: 'Product deleted successfully' });
};

const handlefindAllByCategoryIdProduct = async (req, res) => {
  const { id } = req.params;

  if (ObjectId.isValid(id) === false) return res.status(statusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Invalid id' });

  const products = await findAllByCategoryIdProduct(id);

  if (!products) return res.status(statusCodes.NOT_FOUND).json({ message: 'No products found for the given category' });

  return res.status(statusCodes.OK).json(products);
};

const handleSearchByNameProduct = async (req, res) => {
  const { name } = req.params;
  const products = await searchByNameProduct(name);
  return res.status(statusCodes.OK).json(products);
};

const handleCreateManyProducts = async (req, res) => {
  const productsData = req.body;
  const expectedFields = ['name', 'categoryId', 'price', 'description', 'brand', 'stock'];

  const validProducts = productsData.filter(product => {
    const validation = validateFields(product, expectedFields);
    return validation.success;
  });

  const insertedIds = await createManyProducts(validProducts);
  return res.status(statusCodes.CREATED).json(insertedIds);
};


module.exports = {
  handleGetAllProducts,
  handleGetByIdProduct,
  handleCreateProduct,
  handleUpdateByIdProduct,
  handleDeleteByIdProduct,
  handlefindAllByCategoryIdProduct,
  handleSearchByNameProduct,
  handleCreateManyProducts,
};
