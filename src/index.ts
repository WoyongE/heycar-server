import './config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import usersRouter from './users/router';
import { mongoClient } from './mongo/mongo';
import { basePath, isDev, port } from './constants';
import productsRouter from './products/router';
import balanceRouter from './balance/router';
import verifyToken from './verifyToken';
import verifyRole from './verifyRole';
import { Role } from './types';
import buyProduct from './buyer/controllers/buyProduct';
import { usersCollection } from './mongo/collections';
import { databaseName } from './mongo/constants';

const app = express();
const morganFormat = isDev ? 'dev' : 'combined';

app.use(helmet());
app.use(express.json());
app.use(morgan(morganFormat));

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/balance', verifyToken, verifyRole(Role.BUYER), balanceRouter);
app.use('/buy', verifyToken, verifyRole(Role.BUYER), buyProduct);

mongoClient.connect(() => {
  app.listen(port, () => {
    console.log(usersCollection);
    console.log(databaseName);
    usersCollection.findOne({}).then(value => {
      console.log(value);
    });
    console.log(`Server running on port ${basePath}`);
  });
});
