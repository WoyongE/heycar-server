import { Request, Response } from 'express';
import { productsCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const deleteProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const productId = request.params.id;
    const filter = { _id: getObjectId(productId) };
    await productsCollection.deleteOne(filter);

    response.status(204).send('Product deleted');
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default deleteProduct;
