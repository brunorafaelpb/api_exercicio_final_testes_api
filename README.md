# API de Estoque e Usuários

Esta API permite o registro e login de usuários, além do gerenciamento de produtos em estoque. Todas as operações de produto exigem autenticação via JWT.

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
  ```bash
  npm install
  ```

## Configuração do ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```
BASE_URL_REST=<URL>
```
Esse arquivo é necessário para que os testes funcionem corretamente.

## Executando a API REST

```bash
npm start
```

A API REST estará disponível em `http://localhost:3000`.

## Executando a API GraphQL

```bash
npm run start-graphql
```

A API GraphQL estará disponível em `http://localhost:4000/graphql`.

## Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

## Endpoints REST

### Registro de Usuário
- `POST /register`
  - Body: `{ "username": "string", "password": "string" }`

### Login
- `POST /login`
  - Body: `{ "username": "string", "password": "string" }`
  - Retorna: `{ "token": "JWT" }`

### Consultar Usuários
- `GET /users` (requer JWT)

### Adicionar Produto
- `POST /products` (requer JWT)
  - Body: `{ "name": "string", "value": number, "quantity": number }`

### Consultar Produtos
- `GET /products` (requer JWT)

### Remover Produto
- `DELETE /products` (requer JWT)
  - Body: `{ "id": "string", "quantity": number }`

## Testando a API GraphQL

Você pode acessar o playground Apollo em:
```
http://localhost:4000/graphql
```

### Exemplo de Query
```graphql
query {
  products {
    id
    nome
    preco
    quantidade
  }
}
```

### Exemplo de Mutation (login)
```graphql
mutation {
  login(username: "usuario", password: "senha") {
    token
    username
  }
}
```

### Autenticação nas Mutations
Para Mutations protegidas (ex: transferProduct), inclua o token JWT no header:
```
{
  "Authorization": "Bearer <seu_token_jwt>"
}
```

---
