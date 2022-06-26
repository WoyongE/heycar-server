import { Collection, MongoClient } from 'mongodb';

const databaseName = process.env.DATABASE_NAME;
const usersCollectionName = 'users';
const productsCollectionName = 'products';
const ordersCollectionName = 'orders';
const uri = `mongodb+srv://general:FvL8QE6ntZOffemH@cluster0.hn7ok.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);
const database = mongoClient.db(databaseName);
const getCollection = (collectionName: string): Collection => mongoClient.db(databaseName).collection(collectionName);

export { mongoClient, ordersCollectionName, productsCollectionName, usersCollectionName, database, databaseName, getCollection };
