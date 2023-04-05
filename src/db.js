const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const DB_NAME = process.env.DB_NAME;

let db;
let client;

async function connect(mongoUri) {
  try {
  if (!db) {
    const uriToUse = mongoUri || MONGO_DB_URL;
    client = await MongoClient.connect(uriToUse, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(DB_NAME);
  }
  return db;
  } catch (err) {
    console.log(err);
  }
}

async function disconnect() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

module.exports = { connect, disconnect };
