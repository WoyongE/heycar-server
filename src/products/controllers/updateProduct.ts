import { Request, Response } from 'express';
import Joi from 'joi';
import { getObjectId } from '../../utils';
import { productsCollection } from '../../mongo/collections';

const updateProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const productId = request.params.id;
    const filter = { _id: getObjectId(productId) };
    const schema = Joi.object()
      .keys({
        cost: Joi.number(),
        amount_available: Joi.number(),
        name: Joi.string(),
      })
      .min(1);

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    await productsCollection.updateOne(filter, { $set: request.body });
    const product = await productsCollection.findOne(filter);

    response.json(product);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default updateProduct;
