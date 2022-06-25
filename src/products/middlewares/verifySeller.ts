import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { productsCollection } from '../../mongo/collections';
import { Product } from '../../types';
import { getObjectId } from '../../utils';

const verifySeller = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = request.params.id;
    const schema = Joi.object().keys({
      product_id: Joi.string().length(24).required(),
    });

    const result = schema.validate({ product_id: productId });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const filter = { _id: getObjectId(productId) };
    const product = (await productsCollection.findOne(filter, { projection: { seller_id: 1 } })) as unknown as Product;

    if (!product) {
      response.sendStatus(404);
      return;
    }

    if (request.user_id !== product.seller_id.toString()) {
      response.sendStatus(403);
      return;
    }

    next();
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default verifySeller;
