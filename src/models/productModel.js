const { ObjectId } = require('mongodb');
const { connect } = require('../db');

const getAll = async collection => {
  const products = await (await connect()).collection(collection).aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $addFields: {
        category: '$category.name',
      },
    },
  ]).toArray();

  return products;
};

const getById = async (collection, id) => {
  if (!ObjectId.isValid(id)) return null;
  const product = await (await connect()).collection(collection).aggregate([
    {
      $match: { _id: new ObjectId(id) },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $addFields: {
        category: '$category.name',
      },
    },
  ]).toArray();

  return product[0] || null;
};

const create = async (collection, productData) => {
  const { insertedId } = await (await connect()).collection(collection).insertOne({ ...productData });
  return { _id: insertedId, ...productData };
};

const updateById = async (collection, id, productData) => {
  if (!ObjectId.isValid(id)) return null;
  const { value } = await (await connect()).collection(collection).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...productData } },
    { returnDocument: 'after' },
  );
  return value;
};

const deleteById = async (collection, id) => {
  if (!ObjectId.isValid(id)) return null;
  const { deletedCount } = await (await connect()).collection(collection).deleteOne({ _id: new ObjectId(id) });
  return deletedCount;
};

const findByName = async (collection, name) => {
  const product = await (await connect()).collection(collection).findOne({ name: name });
  return product;
};

const findAllByCategoryId = async (collection, categoryId) => {
  const products = await (await connect()).collection(collection).aggregate([
    {
      $match: { categoryId: new ObjectId(categoryId) },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $addFields: {
        category: '$category.name',
      },
    },
  ]).toArray();

  return products.length > 0 ? products : null;
};

const searchByName = async (collection, name) => {
  const products = await (await connect())
    .collection(collection)
    .aggregate([
      {
        $match: {
          name: { $regex: name, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
        },
      },
      {
        $addFields: {
          category: '$category.name',
        },
      },
    ])
    .toArray();

  return products;
};


const createMany = async (collection, productsData) => {
  const { insertedIds } = await (await connect()).collection(collection).insertMany(productsData, { ordered: false });
  return insertedIds;
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  findByName,
  findAllByCategoryId,
  searchByName,
  createMany,
};
