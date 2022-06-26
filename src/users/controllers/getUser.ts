import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { User } from '../../types';
import { calculateTotalBalance } from '../../balance/functions';

const getUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user._id;
    const document = (await usersCollection.findOne(
      { _id: getObjectId(id) },
      { projection: { tokens: 0, password: 0 } }
    )) as unknown as User;

    const responseJSON: Record<string, any> = {
      ...document,
    };

    if (request.isBuyer) {
      responseJSON.balance = calculateTotalBalance(document.deposit);
    }

    response.json(responseJSON);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getUser;
