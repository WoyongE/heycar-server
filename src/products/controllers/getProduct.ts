import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { Role } from '../../types';

const getProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const productId = request.params.id;
    const filter = { _id: getObjectId(productId) };
    const isBuyer = request.role === Role.BUYER;
    const product = await productsCollection.findOne(filter);

    if (!product) {
      response.sendStatus(404);
      return;
    }

    if (isBuyer) {
      delete product.amount_available;
    }

    response.json(product);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getProduct;
