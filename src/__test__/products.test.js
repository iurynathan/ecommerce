const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const { connect, disconnect } = require('../db');
const createServer = require('../server');
const { ObjectId } = require('mongodb');

describe('Valida funcionalidades da rota /products', () => {
  let mongoServer;
  let app;
  let db;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    db = await connect(mongoUri);
    app = createServer();
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
  });

  afterAll(async () => {
    await disconnect();
    await mongoServer.stop();
  });

  describe('Ao criar um produto com nome válido já existente', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      response = await supertest(app).post('/products').send({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
    });

    it('retorna o código de status "201"', () => {
      expect(response.status).to.be.equal(201);
    });

    it('retorna um objeto com a propriedade "name" contendo o valor "teste"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.be.equal('Arroz Integral 5kg');
      expect(ObjectId.isValid(response.body.categoryId)).to.be.true;
      expect(response.body.price).to.be.equal(5.99);
      expect(response.body.description).to.be.equal("Arroz integral de alta qualidade, 5kg");
      expect(response.body.brand).to.be.equal("Arroz novo");
      expect(response.body.stock).to.be.equal(10);
    });
  });

  describe('Quando o nome do produto é válido mas já existe', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      await db.collection('products').insertOne({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
      response = await supertest(app).post('/products').send({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
    });

    it('retorna o código de status "409"', () => {
      expect(response.status).to.be.equal(409);
    });

    it('retorna um objeto e o valor da chave "message" é "Product already exists"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Product already exists');
    });
  });

  describe('Quando falta algum campo obrigatório ao criar um produto', () => {
    describe('Quando falta o campo "name"', () => {
      let response;

      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          categoryId: insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        });
      });

      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });

      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
        expect(response.body.message).to.include('name');
      });
    });

    describe('Quando falta o campo "brand"', () => {
      let response;

      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          name: "Arroz Integral 5kg",
          categoryId: insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          stock: 10
        });
      });

      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });

      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
        expect(response.body.message).to.include('brand');
      });
    });

    describe('Quando falta o campo "stock"', () => {
      let response;

      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          name: "Arroz Integral 5kg",
          categoryId: insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
        });
      });

      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });

      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
        expect(response.body.message).to.include('stock');
      });
    });

    describe('Quando falta o campo "categoryId"', () => {
      let response;

      beforeEach(async () => {
        response = await supertest(app).post('/products').send({
          name: "Arroz Integral 5kg",
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        });
      });

      it('retorna o código de status "404"', () => {
        expect(response.status).to.be.equal(404);
      });

      it('retorna um objeto e o valor da chave "message" é igual a "Category not found"', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Category not found');
      });
    });

    describe('Quando falta o campo "price"', () => {
      let response;

      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          name: "Arroz Integral 5kg",
          categoryId: insertedId,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        });
      });

      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });

      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
        expect(response.body.message).to.include('price');
      });
    });

    describe('Quando falta o campo "description"', () => {
      let response;

      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          name: "Arroz Integral 5kg",
          categoryId: insertedId,
          price: 5.99,
          brand: "Arroz novo",
          stock: 10
        });
      });

      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });

      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
        expect(response.body.message).to.include('description');
      });
    });
    describe('Quando falta todos os campos exceto categoryId', () => {
      let response;
  
      beforeEach(async () => {
        const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
        response = await supertest(app).post('/products').send({
          categoryId: insertedId,
        });
      });
  
      it('retorna o código de status "400"', () => {
        expect(response.status).to.be.equal(400);
      });
  
      it('retorna um objeto e o valor da chave "message" informa os campos que estão faltando', () => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.include('Os seguintes campos são obrigatórios');
          expect(response.body.message).to.include('name');
          expect(response.body.message).to.include('price');
          expect(response.body.message).to.include('brand');
          expect(response.body.message).to.include('description');
      });
    });
  });

  describe('Ao buscar um produto pelo id com sucesso', () => {
    let response;
    let insertedProduct;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      insertedProduct = await db.collection('products').insertOne({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
      response = await supertest(app).get(`/products/${insertedProduct.insertedId}`);
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto possui a chave "_id"', () => {
      expect(response.body).to.have.a.property('_id');
    });

    it('o objeto possui a chave "name"', () => {
      expect(response.body).to.have.a.property('name');
    });

    it('o objeto possui a chave "price"', () => {
      expect(response.body).to.have.a.property('price');
    });

    it('o objeto possui a chave "brand"', () => {
      expect(response.body).to.have.a.property('brand');
    });

    it('o objeto possui a chave "description"', () => {
      expect(response.body).to.have.a.property('description');
    });

    it('o objeto possui a chave "stock"', () => {
      expect(response.body).to.have.a.property('stock');
    });

    it('o objeto possui a chave "categoryId"', () => {
      expect(response.body).to.have.a.property('category');
    });

    it('o valor da chave "_id" é igual ao "id" inserido', () => {
      expect(response.body._id).to.be.equal(insertedProduct.insertedId.toString());
    });

    it('o valor da chave "name" é igual ao "name" inserido', () => {
      expect(response.body.name).to.be.equal('Arroz Integral 5kg');
    });

    it('o valor da chave "price" é igual ao "price" inserido', () => {
      expect(response.body.price).to.be.equal(5.99);
    });

    it('o valor da chave "brand" é igual ao "brand" inserido', () => {
      expect(response.body.brand).to.be.equal('Arroz novo');
    });

    it('o valor da chave "description" é igual ao "description" inserido', () => {
      expect(response.body.description).to.be.equal('Arroz integral de alta qualidade, 5kg');
    });

    it('o valor da chave "stock" é igual ao "stock" inserido', () => {
      expect(response.body.stock).to.be.equal(10);
    });

    it('o valor da chave "category" representa a categoria correta', () => {
      expect(response.body.category).to.be.equal('Alimentos');
    });
  });

  describe('Ao buscar todos os produtos com sucesso', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      await db.collection('products').insertMany([
        {
          name: "Arroz Integral 5kg",
          categoryId: insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Feijão Preto 1kg",
          categoryId: insertedId,
          price: 3.99,
          description: "Feijão preto de alta qualidade, 1kg",
          brand: "Feijão novo",
          stock: 20
        },
        {
          name: "Macarrão Espaguete 500g",
          categoryId: insertedId,
          price: 2.99,
          description: "Macarrão espaguete de alta qualidade, 500g",
          brand: "Macarrão novo",
          stock: 30
        }
      ]);
      response = await supertest(app).get('/products');
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um array', () => {
      expect(response.body).to.be.an('array');
    });

    it('o array possui 3 itens', () => {
      expect(response.body).to.have.lengthOf(3);
    });

    it('cada item do array possui a chave "_id"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('_id');
      });
    });

    it('cada item do array possui a chave "name"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('name');
      });
    });

    it('cada item do array possui a chave "price"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('price');
      });
    });

    it('cada item do array possui a chave "brand"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('brand');
      });
    });

    it('cada item do array possui a chave "description"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('description');
      });
    });

    it('cada item do array possui a chave "stock"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('stock');
      });
    });

    it('cada item do array possui a chave "category"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.a.property('category');
      });
    });
  });

  describe('Ao buscar um produto inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).get('/products/5f5e5d5c5b5a595857565554');
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('o valor da chave "message" é igual a "Product not found"', () => {
      expect(response.body.message).to.be.equal('Product not found');
    });
  });

  describe('Ao buscar um produto com id inválido', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).get('/products/123');
    });

    it('retorna o código de status "422"', () => {
      expect(response.status).to.be.equal(422);
    });

    it('o valor da chave "message" é igual a "Invalid id"', () => {
      expect(response.body.message).to.be.equal('Invalid id');
    });
  });

  describe('Ao atualizar um produto com sucesso', () => {
    let response;
    let insertedProduct;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      insertedProduct = await db.collection('products').insertOne({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
      response = await supertest(app).put(`/products/${insertedProduct.insertedId}`).send({
        name: "Arroz Integral 1kg",
        description: "Arroz integral de alta qualidade, 1kg",
      });
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('o valor da chave "message" é igual a "Product updated successfully"', () => {
      expect(response.body.message).to.be.equal('Product updated successfully');
    });
  });

  describe('Ao atualizar um produto inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).put('/products/5f5e5d5c5b5a595857565554').send({
        name: "Arroz Integral 1kg",
        description: "Arroz integral de alta qualidade, 1kg",
      });
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('o valor da chave "message" é igual a "Product not found"', () => {
      expect(response.body.message).to.be.equal('Product not found');
    });
  });

  describe('Ao atualizar um produto com id inválido', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).put('/products/123').send({
        name: "Arroz Integral 1kg",
        description: "Arroz integral de alta qualidade, 1kg",
      });
    });

    it('retorna o código de status "422"', () => {
      expect(response.status).to.be.equal(422);
    });

    it('o valor da chave "message" é igual a "Invalid id"', () => {
      expect(response.body.message).to.be.equal('Invalid id');
    });
  });

  describe('Ao deletar um produto com sucesso', () => {
    let response;
    let insertedProduct;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'Alimentos' });
      insertedProduct = await db.collection('products').insertOne({
        name: "Arroz Integral 5kg",
        categoryId: insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
      response = await supertest(app).delete(`/products/${insertedProduct.insertedId}`);
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('o valor da chave "message" é igual a "Product deleted successfully"', () => {
      expect(response.body.message).to.be.equal('Product deleted successfully');
    });
  });

  describe('Ao deletar um produto inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).delete('/products/5f5e5d5c5b5a595857565554');
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('o valor da chave "message" é igual a "Product not found"', () => {
      expect(response.body.message).to.be.equal('Product not found');
    });
  });

  describe('Ao deletar um produto com id inválido', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).delete('/products/123');
    });

    it('retorna o código de status "422"', () => {
      expect(response.status).to.be.equal(422);
    });

    it('o valor da chave "message" é igual a "Invalid id"', () => {
      expect(response.body.message).to.be.equal('Invalid id');
    });
  });

  describe('Ao buscar produtos por categoria', () => {
    let response;
    let insertedCategory;

    beforeEach(async () => {
      insertedCategory = await db.collection('categories').insertOne({ name: 'Alimentos' });
      await db.collection('products').insertMany([
        {
          name: "Arroz Integral 5kg",
          categoryId: insertedCategory.insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Feijão Preto 1kg",
          categoryId: insertedCategory.insertedId,
          price: 3.99,
          description: "Feijão preto de alta qualidade, 1kg",
          brand: "Feijão novo",
          stock: 10
        },
        {
          name: "Feijão Preto 5kg",
          categoryId: insertedCategory.insertedId,
          price: 15.99,
          description: "Feijão preto de alta qualidade, 5kg",
          brand: "Feijão novo",
          stock: 10
        },
        {
          name: "Feijão Carioca 1kg",
          categoryId: insertedCategory.insertedId,
          price: 3.99,
          description: "Feijão carioca de alta qualidade, 1kg",
          brand: "Feijão novo",
          stock: 10
        },
        {
          name: "Feijão Carioca 5kg",
          categoryId: insertedCategory.insertedId,
          price: 15.99,
          description: "Feijão carioca de alta qualidade, 5kg",
          brand: "Feijão novo",
          stock: 10
        },
      ]);
      response = await supertest(app).get(`/products/category/${insertedCategory.insertedId}`);
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um array', () => {
      expect(response.body).to.be.an('array');
    });

    it('o array possui 5 itens', () => {
      expect(response.body).to.have.lengthOf(5);
    });

    it('cada item do array possui a chave "name"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('name');
      });
    });

    it('cada item do array possui a chave "description"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('description');
      });
    });

    it('cada item do array possui a chave "price"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('price');
      });
    });

    it('cada item do array possui a chave "brand"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('brand');
      });
    });

    it('cada item do array possui a chave "stock"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('stock');
      });
    });

    it('cada item do array possui a chave "category"', () => {
      response.body.forEach((product) => {
        expect(product).to.have.property('category');
      });
    });
  });

  describe('Ao buscar produtos por categoria inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).get('/products/category/5f5e5d5c5b5a595857565554');
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('o valor da chave "message" é igual a "No products found for the given category"', () => {
      expect(response.body.message).to.be.equal('No products found for the given category');
    });
  });

  describe('Ao buscar produtos por categoria com id inválido', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).get('/products/category/123');
    });

    it('retorna o código de status "422"', () => {
      expect(response.status).to.be.equal(422);
    });

    it('o valor da chave "message" é igual a "Invalid id"', () => {
      expect(response.body.message).to.be.equal('Invalid id');
    });
  });

  describe('Ao buscar um produto por nome regex', () => {
    let response;
    let insertedProduct;

    beforeEach(async () => {
      const insertedCategory = await db.collection('categories').insertOne({ name: 'Alimentos' });
      insertedProduct = await db.collection('products').insertOne({
        name: "Arroz Integral 5kg",
        categoryId: insertedCategory.insertedId,
        price: 5.99,
        description: "Arroz integral de alta qualidade, 5kg",
        brand: "Arroz novo",
        stock: 10
      });
      response = await supertest(app).get(`/products/search/arroz`);
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um array', () => {
      expect(response.body).to.be.an('array');
    });

    it('o array possui 1 item', () => {
      expect(response.body).to.have.lengthOf(1);
    });

    it('o item do array possui a chave "name"', () => {
      expect(response.body[0]).to.have.property('name');
    });

    it('o item do array possui a chave "description"', () => {
      expect(response.body[0]).to.have.property('description');
    });

    it('o item do array possui a chave "price"', () => {
      expect(response.body[0]).to.have.property('price');
    });

    it('o item do array possui a chave "brand"', () => {
      expect(response.body[0]).to.have.property('brand');
    });

    it('o item do array possui a chave "stock"', () => {
      expect(response.body[0]).to.have.property('stock');
    });

    it('o item do array possui a chave "category"', () => {
      expect(response.body[0]).to.have.property('category');
    });
  });

  describe('Ao criar mutiplos produtos', () => {
    let response;
    let insertedCategory;

    beforeEach(async () => {
      insertedCategory = await db.collection('categories').insertOne({ name: 'Alimentos' });
      response = await supertest(app).post('/products/multiple').send([
        {
          name: "Arroz Integral 5kg",
          categoryId: insertedCategory.insertedId,
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Integral 1kg",
          categoryId: insertedCategory.insertedId,
          price: 2.99,
          description: "Arroz integral de alta qualidade, 1kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Branco 5kg",
          categoryId: insertedCategory.insertedId,
          price: 5.99,
          description: "Arroz branco de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Branco 1kg",
          categoryId: insertedCategory.insertedId,
          price: 2.99,
          description: "Arroz branco de alta qualidade, 1kg",
          brand: "Arroz novo",
          stock: 10
        },
      ]);
    });

    it('retorna o código de status "201"', () => {
      expect(response.status).to.be.equal(201);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o array possui 4 itens', () => {
      expect(Object.keys(response.body)).to.have.lengthOf(4);
    });
  });

  describe('Ao criar mutiplos produtos mas faltou campo ou categoria não existe', () => {
    let response;
    let insertedCategory;

    beforeEach(async () => {
      response = await supertest(app).post('/products/multiple').send([
        {
          name: "Arroz Integral 5kg",
          categoryId: "5f5e5d5c5b5a595857565554",
          price: 5.99,
          description: "Arroz integral de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Integral 1kg",
          categoryId: "5f5e5d5c5b5a595857565554",
          price: 2.99,
          description: "Arroz integral de alta qualidade, 1kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Branco 5kg",
          price: 5.99,
          description: "Arroz branco de alta qualidade, 5kg",
          brand: "Arroz novo",
          stock: 10
        },
        {
          name: "Arroz Branco 1kg",
          brand: "Arroz novo",
          stock: 10
        },
      ]);
    });

    it('retorna o código de status "400"', () => {
      expect(response.status).to.be.equal(400);
    });

    it('o valor da chave "message" é igual a "No valid products"', () => {
      expect(response.body.message).to.be.equal('No valid products');
    });
  });
});
