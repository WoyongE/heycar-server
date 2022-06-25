import { mongoClient } from './mongo';

const databaseName = process.env.DATABASE_NAME;
const database = mongoClient.db(databaseName);
const usersCollectionName = 'users';
const productsCollectionName = 'products';
const ordersCollectionName = 'orders';

export { usersCollectionName, productsCollectionName, ordersCollectionName, databaseName, database };
