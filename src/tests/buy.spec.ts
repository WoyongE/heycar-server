import '../config';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Deposit, Product, Role } from '../types';
import { basePath } from '../constants';
import { database } from '../mongo/constants';
import { User } from '../../@types/express';

chai.use(chaiHttp);

describe('Buy', () => {
  let sellerToken: string;
  let buyerToken: string;
  let balance: number;
  let createdProduct: Product;

  const product = {
    cost: 100,
    name: 'White T-shirt',
    amount_available: 20,
  };

  beforeEach(done => {
    database.dropDatabase().then(() => {
      const seller: Partial<User> = {
        username: 'jane',
        password: 'jane123',
        role: Role.SELLER,
      };

      const buyer: Partial<User> = {
        username: 'john',
        password: 'john123',
        role: Role.BUYER,
      };

      chai
        .request(basePath)
        .post('/users/signup')
        .send(seller)
        .end((err, res) => {
          sellerToken = res.body.access_token;

          chai
            .request(basePath)
            .post('/products')
            .set('Authorization', `Bearer ${sellerToken}`)
            .send(product)
            .end((err1, res1) => {
              createdProduct = res1.body;

              chai
                .request(basePath)
                .post('/users/signup')
                .send(buyer)
                .end((err2, res2) => {
                  buyerToken = res2.body.access_token;

                  const deposit: Deposit = { 100: 1, 50: 0, 20: 0, 10: 0, 5: 0 };

                  chai
                    .request(basePath)
                    .post('/balance/deposit')
                    .send(deposit)
                    .set('Authorization', `Bearer ${buyerToken}`)
                    .end((err3, res3) => {
                      balance = res3.body.balance;
                      done();
                    });
                });
            });
        });
    });
  });

  describe('POST /buy', () => {
    it('Should buy a product if user has sufficient funds', done => {
      const quantity = 1;
      const totalAmount = createdProduct.cost * quantity;
      const newBalance = balance - totalAmount;
      const productParams = {
        product_id: createdProduct._id,
        quantity,
      };

      chai
        .request(basePath)
        .post('/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(productParams)
        .end((err1, res1) => {
          expect(res1.body.amount_spent).to.be.equal(totalAmount);
          expect(res1.body.quantity).to.be.equal(quantity);
          expect(res1.body.product._id).to.be.equal(createdProduct._id);
          expect(res1.body.balance).to.be.equal(newBalance);

          chai
            .request(basePath)
            .get(`/products/${createdProduct._id}`)
            .set('Authorization', `Bearer ${sellerToken}`)
            .send(productParams)
            .end((err2, res2) => {
              expect(res2.body.amount_available).to.be.equal(product.amount_available - quantity);
              done();
            });
        });
    });

    it('Should fail to buy product if user has insufficient funds', done => {
      const quantity = 2;
      const productParams = {
        product_id: createdProduct._id,
        quantity,
      };

      chai
        .request(basePath)
        .post('/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(productParams)
        .end((err2, res2) => {
          expect(res2).to.have.status(402);
          done();
        });
    });
  });
});
