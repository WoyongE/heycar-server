import { mongoClient } from './mongo';
import { databaseName, ordersCollectionName, productsCollectionName, usersCollectionName } from './constants';

const database = mongoClient.db(databaseName);
const usersCollection = database.collection(usersCollectionName);
const productsCollection = database.collection(productsCollectionName);
const ordersCollection = database.collection(ordersCollectionName);

export { usersCollection, productsCollection, ordersCollection };
