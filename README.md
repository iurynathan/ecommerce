
## Documentação da API

### Categorias

#### Retorna todas as categorias

```
  GET /categories
```
#### Retorna uma categoria

```
  GET /categories/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |

#### Cria uma nova categoria

```
  POST /categories
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Obrigatório**. O Nome da categoria |

#### Atualiza uma categoria

```
  PUT /categories/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |
| `name`      | `string` | **Obrigatório**. O Nome da categoria |

#### Exclui uma categoria

```
  DELETE /categories/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |

#### Retorna categorias com base no match com o nome

```
  GET /categories/search/:name
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Obrigatório**. O Nome da categoria |

#### Cria várias categorias

```
  POST /categories/multiple
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `categories`      | `string[]` | **Obrigatório**. Lista de nomes de categorias |

#
### Produtos

#### Retorna todos os produtos

```
  GET /products
```
#### Retorna todos os produtos

```
  GET /products/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |

#### Cria um novo produto

```
  POST /products
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Obrigatório**. O name da categoria |
| `categoryId`      | `string` | **Obrigatório**. O categoryId da categoria |
| `price`      | `number` | **Obrigatório**. O price da categoria |
| `description`      | `string` | **Obrigatório**. O description da categoria |
| `brand`      | `string` | **Obrigatório**. O brand da categoria |
| `stock`      | `number` | **Obrigatório**. O stock da categoria |

#### Atualiza um produto

```
  PUT /products/:id
```

precisa de pelo menos um parametro junto com o id

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |
| `name`      | `string` | **Opcional**. O name da categoria |
| `categoryId`      | `string` | **Opcional**. O categoryId da categoria |
| `price`      | `number` | **Opcional**. O price da categoria |
| `description`      | `string` | **Opcional**. O description da categoria |
| `brand`      | `string` | **Opcional**. O brand da categoria |
| `stock`      | `number` | **Opcional**. O stock da categoria |

#### Exclui um produto

```
  DELETE /products/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O id da categoria |

#### Retorna produtos com base no match com o nome

```
  GET /products/search/:name
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Obrigatório**. O Nome da categoria |

#### Cria vários produtos

```
  POST /products/multiple
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `products`      | `Product[]` | **Obrigatório**. Lista de produtos |

#
## Instalação

Configure as variáveis de ambiente no arquivo .env.

```bash
  MONGO_URI=<sua_string_de_conexão_com_o_mongodb>
  PORT=<porta_para_a_API>
```

Caso use o docker para subir o mongoDB

```bash
  docker-compose up
  docker exec -it mongodb_container mongosh
  use <nome-da-collection>
  use admin
  db.auth(<user>, <password>)
  db.createUser({ user: "meu_usuario_admin", pwd: "minha_senha", roles: ["dbAdmin"] })
  db.grantRolesToUser("meu_usuario_admin", [{ role: "readWrite", db: "nome_do_banco_de_dados", collection: "nome_da_colecao" }])
```
Iniciando aplicação

```bash
  yarn ou npm install
  yarn dev ou npm run dev
```