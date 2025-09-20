const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Product External Tests (REST)', () => {
    before(async () => {
            const credentials = require('../fixture/requests/login/postLogin.json');

            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(credentials);

            token = respostaLogin.body.token;
        });
    
    describe('GET /products', () => {
        it('Quando listo os produtos cadastrados com usuário logado recebo 200', async () => {
            
            const response = await request(process.env.BASE_URL_REST)
                .get('/products')
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(response.status).to.equal(200);
            expect(response.body[0]).to.have.property('id', '1');
            expect(response.body[0]).to.have.property('name', 'Mouse');
            expect(response.body[0]).to.have.property('value', 50);
            expect(response.body[0]).to.have.property('quantity');
        }),
        it('Quando listo os produtos cadastrados sem usuário logado recebo 401', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .get('/products')
                .send();
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token não informado');
        })
    })

    describe('POST /products', () => {
        it('Quando cadastro produto sem usuário logado recebo 401', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .send({
                    "name": "Hub USB",
                    "value": 18,
                    "quantity": 20
                });
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token não informado');
        }),
        it('Quando cadastro produto novo com todos os dados válidos recebo 201', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "Hub USB",
                    "value": 18,
                    "quantity": 20
                });
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'Produto cadastrado com sucesso!');
            expect(response.body.product).to.have.property('id');
            expect(response.body.product).to.have.property('name', 'Hub USB');
            expect(response.body.product).to.have.property('value', 18);
            expect(response.body.product).to.have.property('quantity');
        }),
        it('Quando cadastro produto existente com todos os dados válidos recebo 201', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": 'Teclado',
                    "value": 120,
                    "quantity": 2
                });
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'Produto já cadastrado, quantidade incrementada em 2.');
            expect(response.body.product).to.have.property('id');
            expect(response.body.product).to.have.property('name', 'Teclado');
            expect(response.body.product).to.have.property('value', 120);
            expect(response.body.product).to.have.property('quantity');
        }),
        it('Quando cadastro produto sem informar a quantidade recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "Cabo",
                    "value": 15
                });
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Nome, valor e quantidade obrigatórios');
        }),
        it('Quando cadastro produto sem informar o nome recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "value": 15,
                    "quantity": 10
                })
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Nome, valor e quantidade obrigatórios');
        }),
        it('Quando cadastro produto sem informar o valor recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "Headset",
                    "quantity": 10
                })
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Nome, valor e quantidade obrigatórios');
        }),
        it('Quando cadastro produto informando valor negativo recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": 'Mouse',
                    "value": -1,
                    "quantity": 2
                })
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Valor não pode ser negativo');
        }),
        it('Quando cadastro produto informando quantidade negativa recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": 'Mouse',
                    "value": 50,
                    "quantity": -1
                })
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Quantidade não pode ser negativa');
        })

    })

    describe('DELETE /product', () => {
        it('Quando deleto produto sem usuário logado recebo 401', async () =>{
            const response = await request(process.env.BASE_URL_REST)
                .delete('/products')
                .send({
                    "id": "2",
                    "quantity": 1
                })
            expect(response.status).to.equal(401)
            expect(response.body).to.have.property('error', 'Token não informado');
        }),
        it('Quando deleto produto com quantidade válida recebo 200', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .delete('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "id": "2",
                    "quantity": 1
                })
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message', 'Produto removido com sucesso!');
        }),
        it('Quando deleto produto com quantidade maior do que a quantidade em estoque recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .delete('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "id": "2",
                    "quantity": 100
                })
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Quantidade insuficiente para remoção');
        }),
        it('Quando deleto produto não existente no estoque recebo 400', async () => {
            const response = await request(process.env.BASE_URL_REST)
                .delete('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "id": "INEXISTENTE",
                    "quantity": 1
                })
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Produto não encontrado');
        })
    })
})