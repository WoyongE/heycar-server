import './config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './users/router';
import { mongoClient } from './mongo/mongo';
import { isDev } from './constants';
import productsRouter from './products/router';
import balanceRouter from './balance/router';
import verifyToken from './verifyToken';
import verifyRole from './verifyRole';
import { Role } from './types';
import buyProduct from './buyer/controllers/buyProduct';

const app = express();
const port = process.env.PORT;
const morganFormat = isDev ? 'dev' : 'combined';

app.use(express.json());
app.use(helmet());
app.use(morgan(morganFormat));

app.use('/users', router);
app.use('/products', productsRouter);
app.use('/balance', verifyToken, verifyRole(Role.BUYER), balanceRouter);
app.use('/buy', verifyToken, verifyRole(Role.BUYER), buyProduct);

mongoClient.connect(() => {
  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
});
