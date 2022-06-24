import { Request, Response } from 'express';
import Joi from 'joi';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { calculateTotalBalance } from '../functions';

const deposit = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      5: Joi.number(),
      10: Joi.number(),
      20: Joi.number(),
      50: Joi.number(),
      100: Joi.number(),
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const id = request.user_id;
    const query = { _id: getObjectId(id) };
    const transformedIncQuery = Object.keys(request.body).reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [`deposit.${currentValue}`]: request.body[currentValue],
      }),
      {}
    );

    await usersCollection.updateOne(query, { $inc: transformedIncQuery });
    const updatedDocument = await usersCollection.findOne(query, { projection: { deposit: 1, _id: 0 } });

    if (!updatedDocument) {
      response.sendStatus(500);
      return;
    }

    const rawDeposit = updatedDocument.deposit;

    response.json({
      balance_denominations: rawDeposit,
      balance: calculateTotalBalance(rawDeposit),
    });
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default deposit;
