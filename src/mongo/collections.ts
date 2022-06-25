import { database, ordersCollectionName, productsCollectionName, usersCollectionName } from './constants';

const usersCollection = database.collection(usersCollectionName);
const productsCollection = database.collection(productsCollectionName);
const ordersCollection = database.collection(ordersCollectionName);

export { usersCollection, productsCollection, ordersCollection };
