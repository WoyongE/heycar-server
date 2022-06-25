import chai, { expect } from 'chai';
import { database } from '../src/mongo/constants';
import { User } from '../@types/express';
import { Deposit, Role } from '../src/types';
import { basePath } from '../src/constants';
import { calculateTotalBalance } from '../src/balance/functions';

describe('Deposit', () => {
  let token: string;

  beforeEach(done => {
    database.dropDatabase().then(() => {
      const testUser: Partial<User> = {
        username: 'jane',
        password: 'jane123',
        role: Role.BUYER,
      };

      chai
        .request(basePath)
        .post('/users/signup')
        .send(testUser)
        .end((err, res) => {
          token = res.body.access_token;
          done();
        });
    });
  });

  describe('/POST deposit', () => {
    it("should deposit coins into user's account", done => {
      const deposit: Deposit = { 5: 10, 10: 40, 20: 3, 50: 2, 100: 1 };
      const balance = calculateTotalBalance(deposit);

      chai
        .request(basePath)
        .post('/balance/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send(deposit)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.have.property('balance').equal(balance);

          done();
        });
    });
  });
});
