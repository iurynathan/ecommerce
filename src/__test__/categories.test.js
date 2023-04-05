const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const { connect, disconnect } = require('../db');
const createServer = require('../server');

describe('Testa funcionalidades da rota /categories', () => {
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
    await db.collection('categories').deleteMany({});
  });

  afterAll(async () => {
    await disconnect();
    await mongoServer.stop();
  });

  describe('Ao criar uma categoria com nome válido já existente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).post('/categories').send({ name: 'teste' });
    });

    it('retorna o código de status "201"', () => {
      expect(response.status).to.be.equal(201);
    });

    it('retorna um objeto com a propriedade "name" contendo o valor "teste"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.be.equal('teste');
    });
  });

  describe('Quando o nome da categoria é válido mas já existe', () => {
    let response;

    beforeEach(async () => {
      await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).post('/categories').send({ name: 'teste' });
    });

    it('retorna o código de status "409"', () => {
      expect(response.status).to.be.equal(409);
    });

    it('retorna um objeto e o valor da chave "message" é "Category already exists"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Category already exists');
    });
  });
  
  describe('quando o nome da categoria é inválido', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).post('/categories').send({ name: '' });
    });

    it('retorna o código de status "400"', () => {
      expect(response.status).to.be.equal(400);
    });

    it('retorna um objeto e o valor da chave "message" é "name" is required', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('"name" is required');
    });
  });

  describe('criando varias categorias', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).post('/categories/multiple').send([
        { name: 'teste1' },
        { name: 'teste2' },
        { name: 'teste3' },
      ]);
    });

    it('retorna o código de status "201"', () => {
      expect(response.status).to.be.equal(201);
    });

    it('retorna um objeto com três itens', () => {
      expect(response.body).to.be.an('object');
      expect(Object.keys(response.body)).to.have.lengthOf(3);
    });
  });

  describe('buscando todas as categorias', () => {
    let response;

    beforeEach(async () => {
      await db.collection('categories').insertMany([
        { name: 'teste1' },
        { name: 'teste2' },
        { name: 'teste3' },
      ]);
      response = await supertest(app).get('/categories');
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um array com três itens', () => {
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(3);
    });
  });

  describe('buscando uma categoria por id', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).get(`/categories/${insertedId}`);
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um objeto e o valor da chave "name" é "teste"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.be.equal('teste');
    });
  });

  describe('buscando uma categoria por id inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).get('/categories/123');
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('retorna um objeto e o valor da chave "message" é "Category not found"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Category not found');
    });
  });

  describe('buscando uma categoria por um regex nome válido', () => {
    let response;

    beforeEach(async () => {
      await db.collection('categories').insertMany([
        { name: 'teste1' },
        { name: 'teste2' },
        { name: 'teste3' },
      ]);
      response = await supertest(app).get('/categories/search/teste');
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um array com três itens', () => {
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(3);
    });
  });

  describe('atualiando uma categoria por id', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).put(`/categories/${insertedId}`).send({ name: 'teste2' });
    });

    it('retorna o código de status "200"', () => {
      expect(response.status).to.be.equal(200);
    });

    it('retorna um objeto e o valor da chave "name" é "teste2"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.name).to.be.equal('teste2');
    });
  });

  describe('atualiando uma categoria por id inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).put('/categories/123').send({ name: 'teste2' });
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('retorna um objeto e o valor da chave "message" é "Category not found"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Category not found');
    });
  });

  describe('atualiando uma categoria por um nome inválido', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).put(`/categories/${insertedId}`).send({ name: '' });
    });

    it('retorna o código de status "400"', () => {
      expect(response.status).to.be.equal(400);
    });

    it('retorna um objeto e o valor da chave "message" é "name" is required', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('"name" is required');
    });
  });

  describe('atualiando uma categoria por um nome já existente', () => {
    let response;

    beforeEach(async () => {
      await db.collection('categories').insertOne({ name: 'teste2' });
      const { insertedId } = await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).put(`/categories/${insertedId}`).send({ name: 'teste2' });
    });

    it('retorna o código de status "409"', () => {
      expect(response.status).to.be.equal(409);
    });

    it('retorna um objeto e o valor da chave "message" é "Category already exists"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Category already exists');
    });
  });

  describe('deletando uma categoria por id', () => {
    let response;

    beforeEach(async () => {
      const { insertedId } = await db.collection('categories').insertOne({ name: 'teste' });
      response = await supertest(app).delete(`/categories/${insertedId}`);
    });

    it('retorna o código de status "204"', () => {
      expect(response.status).to.be.equal(204);
    });
  });

  describe('deletando uma categoria por id inexistente', () => {
    let response;

    beforeEach(async () => {
      response = await supertest(app).delete('/categories/123');
    });

    it('retorna o código de status "404"', () => {
      expect(response.status).to.be.equal(404);
    });

    it('retorna um objeto e o valor da chave "message" é "Category not found"', () => {
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.be.equal('Category not found');
    });
  });
});
