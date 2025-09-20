const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();

describe('Product External Tests (GraphQL)', () => {
    before( async () => {
        const validLoginUser = require('../fixture/request/login/validLogin.json')
        const responseLogin = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .send(validLoginUser);
        token = responseLogin.body.data.login.token;
    });

    describe('LISTAR PRODUTOS', () => {
        it('Quando listo os produtos cadastrados com usuário logado recebo a lista de produtos cadastrados', async () => {
            const listProducts = require('../fixture/request/products/listProducts.json')
            const expectedResponse = require('../fixture/response/products/quandoListoOsProdutosCadastradosComUsuarioLogadoReceboAListaDeProdutosCadastrados.json')
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set("Authorization", `Bearer ${token}`)
                .send(listProducts)
            expect(response.status).to.be.equal(200);
            expect(response.body).excludingEvery('quantity').to.deep.equal(expectedResponse)

        }),
        it('Quando listo produtos cadastrados sem usuário logado recebo mensagem de erro', async () => {
            const listProducts = require('../fixture/request/products/listProducts.json')
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(listProducts)
            expect(response.status).to.be.equal(200);
            expect(response.body).to.have.property('errors');
            expect(response.body.errors[0]).to.have.property('message', 'Autenticação obrigatória');
        })
    }),

    describe('CADASTRAR PRODUTOS', () => {
        it('Quando cadastro produto já cadastrado produto é incrementado e recebo mensagem de sucesso', async () => {
            const createProducts = require('../fixture/request/products/createProduct.json')
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set("Authorization", `Bearer ${token}`)
                .send(createProducts)
            expect(response.status).to.be.equal(200);
            expect(response.body.data.createProduct.message).to.equal('Produto já cadastrado, quantidade incrementada em 2.')
        }),
        it('Quando cadastro produtos sem usuário logado recebo mensagem de erro', async () => {
            const createProducts = require('../fixture/request/products/createProduct.json')
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(createProducts)
            expect(response.status).to.be.equal(200);
            expect(response.body).to.have.property('errors');
            expect(response.body.errors[0]).to.have.property('message', 'Autenticação obrigatória');
        });

        const createProductError = require('../fixture/request/products/createProductError.json');
        createProductError.forEach(test => {
            it(`Testando a regra de cadastro de produto: ${test.nome}`, async () => {
                const response = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .set("Authorization", `Bearer ${token}`)
                    .send(test.createProduct)
                expect(response.status).to.be.equal(200);
                expect(response.body.errors[0].message).to.equal(test.mensagemEsperada);
            })
        })
    })

    describe('REMOVER PRODUTO', () => {
        it('Quando removo um produto válido o produto é decrementado e recebo mensagem de sucesso', async () => {
            const removeProduct = require('../fixture/request/products/removeProduct.json');
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(removeProduct)
            expect(response.status).to.be.equal(200);
            expect(response.body.data.removeProduct).to.have.property('message', 'Produto removido com sucesso!');
        }),
        it('Quando removo um produto não existente recebo mensagem de erro', async () => {
            const removeProduct = require('../fixture/request/products/removeProduct.json');
            removeProduct.variables.productId = "999"
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(removeProduct)
            expect(response.status).to.be.equal(200);
            expect(response.body.errors[0]).to.have.property('message', 'Produto não encontrado');
        })
    })

})