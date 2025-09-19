const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
require('dotenv').config();

const app = require('../../../app');
const productsService = require('../../../services/productService');

describe('Product Controller Tests', () => {
    before(async () => {
            const credentials = require('../fixture/requests/login/postLogin.json');

            const respostaLogin = await request(app)
                .post('/login')
                .send(credentials);
            token = respostaLogin.body.token;
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('GET /products', () => {
        it('Quando listo os produtos cadastrados com usuário logado recebo 200', async () => {
            const productsServiceMock = sinon.stub(productsService, 'getProducts')
            productsServiceMock.returns({
                id: "3",
                name: "Borracha",
                value: 1,
                quantity: 10
            });
            const response = await request(app)
                .get('/products')
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id', '3');
            expect(response.body).to.have.property('name', 'Borracha');
            expect(response.body).to.have.property('value', 1);
            expect(response.body).to.have.property('quantity', 10);
        })
    })

    describe('POST /products', () => {
        it('Quando cadastro produto novo com todos os dados válidos recebo 201', async () => {
            const productsServiceMock = sinon.stub(productsService, 'addProduct');
            productsServiceMock.returns({
                message: 'Produto cadastrado com sucesso!',
                product: {
                    id: '99',
                    name: 'Hub USB',
                    value: 18,
                    quantity: 20
                }
            });
            const response = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": 'Borracha',
                    "value": 1,
                    "quantity": 4
                });
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message', 'Produto cadastrado com sucesso!');
        })
    })
})