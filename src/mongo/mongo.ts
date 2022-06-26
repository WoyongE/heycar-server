import { MongoClient } from 'mongodb';

const databaseName = process.env.DATABASE_NAME;
const usersCollectionName = 'users';
const productsCollectionName = 'products';
const ordersCollectionName = 'orders';
const uri = 'mongodb+srv://general:FvL8QE6ntZOffemH@cluster0.hn7ok.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(uri);
const database = mongoClient.db(databaseName);

export { mongoClient, ordersCollectionName, productsCollectionName, usersCollectionName, database, databaseName };
