import express from 'express';
import resetDeposit from './controllers/resetDeposit';
import deposit from './controllers/deposit';

const balanceRouter = express.Router();

balanceRouter.get('/reset', resetDeposit);
balanceRouter.post('/deposit', deposit);

export default balanceRouter;
