import chai, { expect } from 'chai';
import { basePath } from '../src/constants';
import { Product, Role } from '../src/types';
import { insertProduct } from '../src/products/service';
import { database } from '../src/mongo/constants';
import { User } from '../@types/express';

describe('Product', () => {
  let token: string;
  let userId: string;

  beforeEach(done => {
    database.dropDatabase().then(() => {
      const testUser: Partial<User> = {
        username: 'jane',
        password: 'jane123',
        role: Role.SELLER,
      };

      chai
        .request(basePath)
        .post('/users/signup')
        .send(testUser)
        .end((err, res) => {
          token = res.body.accessToken;
          userId = res.body.user._id;
          done();
        });
    });
  });

  describe('/POST product', () => {
    it('should CREATE a product', done => {
      const product = {
        cost: 500,
        name: 'White T-shirt',
        amount_available: 20,
      };

      chai
        .request(basePath)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product)
        .end((err, res) => {
          const createdProduct = res.body;

          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(createdProduct.cost).to.be.equal(product.cost);
          expect(createdProduct.name).to.be.equal(product.name);
          expect(createdProduct.amount_available).to.be.equal(product.amount_available);

          done();
        });
    });
  });

  describe('/GET/:id product', () => {
    it("should READ a product it's id", done => {
      const product: Partial<Product> = {
        cost: 200,
        amount_available: 29,
        name: 'White T-shirt',
      };

      insertProduct(product as Product, userId).then(createdProduct => {
        chai
          .request(basePath)
          .get(`/products/${createdProduct._id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('cost');
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('slug');
            expect(res.body).to.have.property('seller_id');
            expect(res.body).to.have.property('amount_available');

            done();
          });
      });
    });
  });

  describe('/PUT/:id product', () => {
    it("should UPDATE a product it's id", done => {
      const product: Partial<Product> = {
        cost: 200,
        amount_available: 29,
        name: 'White T-shirt',
      };

      const productUpdate: Partial<Product> = {
        cost: 190,
        amount_available: 10,
        name: 'Blue T-shirt',
      };

      insertProduct(product as Product, userId).then(createdProduct => {
        chai
          .request(basePath)
          .put(`/products/${createdProduct._id}`)
          .send(productUpdate)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('_id').equal(createdProduct._id.toString());
            expect(res.body).to.have.property('cost').equal(productUpdate.cost);
            expect(res.body).to.have.property('name').equal(productUpdate.name);
            expect(res.body).to.have.property('slug').equal(createdProduct.slug);
            expect(res.body).to.have.property('seller_id').equal(createdProduct.seller_id.toString());
            expect(res.body).to.have.property('amount_available').equal(productUpdate.amount_available);

            done();
          });
      });
    });
  });

  describe('/DELETE/:id product', () => {
    it("should DELETE a product by it's id", done => {
      const product: Partial<Product> = {
        cost: 200,
        amount_available: 29,
        name: 'White T-shirt',
      };

      insertProduct(product as Product, userId).then(createdProduct => {
        chai
          .request(basePath)
          .delete(`/products/${createdProduct._id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });
    });
  });
});
