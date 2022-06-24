import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';

const getAllProducts = async (request: Request, response: Response): Promise<void> => {
  try {
    const findCursor = productsCollection.find({}, { projection: { seller_id: 0 } });
    const documents = await findCursor.toArray();

    response.json(documents);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getAllProducts;
