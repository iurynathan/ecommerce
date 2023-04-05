const { ObjectId } = require('mongodb');
const connection = require('../models/connection');

const categoryIsInUse = async categoryId => {
  const product = await (await connection()).collection('products').findOne({ categoryId: new ObjectId(categoryId) });
  return !!product;
};

module.exports = {
  categoryIsInUse
};
