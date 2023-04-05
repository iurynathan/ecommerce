const { ObjectId } = require('mongodb');
const { connect } = require('../db');

const getAll = async collection => {
  const categories = await (await connect()).collection(collection).find().toArray();
  return categories;
};

const getById = async (collection, id) => {
  if (!ObjectId.isValid(id)) return null;
  const category = await (await connect()).collection(collection).findOne({ _id: new ObjectId(id) });
  return category;
};

const create = async (collection, name) => {
  const { insertedId } = await (await connect()).collection(collection).insertOne({ name });
  return { _id: insertedId, name };
};

const updateById = async (collection, id, name) => {
  if (!ObjectId.isValid(id)) return null;
  const { value } = await (await connect()).collection(collection).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name } },
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
  const categories = await (await connect()).collection(collection).findOne({ name: name });
  return categories;
};

const searchByName = async (collection, name) => {
  const categories = await (await connect()).collection(collection).find({ name: { $regex: name, $options: 'i' } }).toArray();
  return categories;
};

const createMany = async (collection, categories) => {
  const { insertedIds } = await (await connect()).collection(collection).insertMany(categories);
  return insertedIds;
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  searchByName,
  createMany,
  findByName,
};
