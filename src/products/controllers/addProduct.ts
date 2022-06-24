import { Request, Response } from 'express';
import Joi from 'joi';
import slugify from 'slugify';
import { productsCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { Product } from '../../types';
import { validateCost } from '../functions';

const addProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      cost: Joi.number().required().custom(validateCost).messages({ 'any.not_a_multiple': '"cost" must be a multiple of 5' }),
      amount_available: Joi.number().integer().required(),
      name: Joi.string().required(),
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const { cost, name, amount_available } = request.body;
    const slug = slugify(name, { lower: true });
    const existingSlugsCursor = productsCollection.find({ slug: { $regex: slug } });
    const existingSlugsDocuments = await existingSlugsCursor.toArray();
    const numberOfExistingSlugs = existingSlugsDocuments.length;
    const transformedSlug = numberOfExistingSlugs ? `${slug}-${numberOfExistingSlugs}` : slug;
    const product: Product = {
      cost,
      name,
      seller_id: getObjectId(request.user_id),
      amount_available,
      slug: transformedSlug,
    };

    const insertResult = await productsCollection.insertOne(product);

    response.json({ id: insertResult.insertedId });
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default addProduct;
