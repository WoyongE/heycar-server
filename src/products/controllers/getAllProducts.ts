import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';

const getAllProducts = async (request: Request, response: Response): Promise<void> => {
  try {
    const projection: Record<string, number> = {};

    if (request.isBuyer) {
      projection.amount_available = 0;
    }

    const findCursor = productsCollection.find({}, { projection });
    const documents = await findCursor.toArray();

    response.json(documents);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getAllProducts;
