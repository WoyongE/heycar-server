import { ObjectId } from 'mongodb';

const getObjectId = (id: string): ObjectId => new ObjectId(id);

export { getObjectId };
