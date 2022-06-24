import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const getProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const productId = request.params.id;
    const filter = { _id: getObjectId(productId) };
    const product = await productsCollection.findOne(filter, { projection: { seller_id: 0 } });

    if (!product) {
      response.sendStatus(404);
      return;
    }

    response.json(product);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getProduct;
