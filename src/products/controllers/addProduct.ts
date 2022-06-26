import { Request, Response } from 'express';
import Joi from 'joi';
import { Product } from '../../types';
import { validateCost } from '../functions';
import { insertProduct } from '../service';

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

    const product = await insertProduct(request.body as Product, request.user._id);

    response.json(product);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default addProduct;
