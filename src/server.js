const express = require('express');
const categoriesRouter = require('./routes/categoryRoute');
const productsRouter = require('./routes/productsRoute');

function createServer() {
  const app = express();

  app.get('/', (_req, res) => {
    res.send('Response OK');
  });

  app.use(express.json());

  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);

  return app;
}

module.exports = createServer;
