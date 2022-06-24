import { Request, Response } from 'express';
import Joi from 'joi';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { usernameValidationSchema } from '../constants';

const updateUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      username: usernameValidationSchema,
      role: Joi.string().valid('buyer', 'seller'),
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const id = request.user_id;
    await usersCollection.updateOne({ _id: getObjectId(id) }, { $set: request.body });

    response.sendStatus(200);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default updateUser;
