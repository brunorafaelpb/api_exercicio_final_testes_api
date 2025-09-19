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
node server.js
```

A API REST estará disponível em `http://localhost:3000`.

## Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

## Endpoints

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

## Regras de Negócio
- Não é possível registrar usuários duplicados.
- Login exige usuário e senha.
- Adicionar produto com nome repetido incrementa a quantidade.
- Não é possível remover produto deixando quantidade menor que zero.
- Todas as operações de produto exigem autenticação JWT.

## Testes
Você pode usar ferramentas como Supertest para testar tanto a API REST (`app.js`) quanto a API GraphQL (`graphql/app.js`) sem iniciar o servidor.

---
