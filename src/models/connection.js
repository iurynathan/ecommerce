const { MongoClient } = require('mongodb');

const MONGO_DB_URL = 'mongodb://root:root@172.19.0.2:27017/ecommerce';
const DB_NAME = 'ecommerce';

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = async (db) => {
  if (db) {
    return db;
  }

  return MongoClient.connect(MONGO_DB_URL, OPTIONS)
    .then((conn) => conn.db(DB_NAME))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

module.exports = connection;

