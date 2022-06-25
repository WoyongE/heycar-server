import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';
import { Role } from '../../types';

const getAllProducts = async (request: Request, response: Response): Promise<void> => {
  try {
    const isBuyer = request.role === Role.BUYER;
    const projection: Record<string, number> = {};

    if (isBuyer) {
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
