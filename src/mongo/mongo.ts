import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://general:FvL8QE6ntZOffemH@cluster0.hn7ok.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(uri);

export { mongoClient };
