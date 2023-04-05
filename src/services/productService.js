const { ObjectId } = require('mongodb');
const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  findByName,
  findAllByCategoryId,
  searchByName,
  createMany,
} = require("../models/productModel");

const productsCollection = "products"

const getAllProducts = async () => getAll(productsCollection);

const getByIdProduct = async id => getById(productsCollection, id);

const createProduct = async productData => {
  const now = new Date();
  const productToCreate = {
    ...productData,
    categoryId: new ObjectId(productData.categoryId), // Converte categoryId para ObjectId
    createdAt: now,
    updatedAt: now,
  };
  return create(productsCollection, productToCreate);
};

const updateByIdProduct = async (id, productData) => {
  const now = new Date();
  const productToUpdate = {
    ...productData,
    updatedAt: now,
  }

  if (productData.categoryId) {
    productToUpdate.categoryId = new ObjectId(productData.categoryId);
  }

  return updateById(productsCollection, id, productToUpdate);
}

const deleteByIdProduct = async id => deleteById(productsCollection, id);

const findByNameProduct = async name => findByName(productsCollection, name);

const findAllByCategoryIdProduct = async categoryId => findAllByCategoryId(productsCollection, categoryId);

const searchByNameProduct = async name => searchByName(productsCollection, name);

const createManyProducts = async productsData => {
  const now = new Date();
  const productsToCreate = productsData.map(product => ({
    ...product,
    categoryId: new ObjectId(product.categoryId),
    createdAt: now,
    updatedAt: now,
  }));

  return createMany(productsCollection, productsToCreate);
}

module.exports = {
  getAllProducts,
  getByIdProduct,
  createProduct,
  updateByIdProduct,
  deleteByIdProduct,
  findByNameProduct,
  findAllByCategoryIdProduct,
  searchByNameProduct,
  createManyProducts,
};
