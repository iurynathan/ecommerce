const { ObjectId } = require('mongodb');
const { getCategoryById } = require('../services/categoryService');
const { connect } = require('../db');

const categoryIsInUse = async categoryId => {
  const product = await (await connect()).collection('products').findOne({ categoryId: new ObjectId(categoryId) });
  return !!product;
};

const hasValidCategory = async product => {
  const categoryExists = await getCategoryById(product.categoryId);
  return !!categoryExists;
};

module.exports = {
  categoryIsInUse,
  hasValidCategory,
};
