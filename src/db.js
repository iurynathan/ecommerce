const { MongoClient } = require('mongodb');

const MONGO_DB_URL = 'mongodb://root:root@172.19.0.2:27017/ecommerce';
const DB_NAME = 'ecommerce';

let db;
let client;

async function connect(mongoUri) {
  if (!db) {
    const uriToUse = mongoUri || MONGO_DB_URL;
    client = await MongoClient.connect(uriToUse, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(DB_NAME);
  }
  return db;
}

async function disconnect() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

module.exports = { connect, disconnect };

