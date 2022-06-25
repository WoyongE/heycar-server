import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { calculateTotalBalance } from '../../balance/functions';
import { User } from '../../types';

const getUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user_id;
    const document = (await usersCollection.findOne(
      { _id: getObjectId(id) },
      { projection: { access_token: 0, refresh_token: 0, password: 0 } }
    )) as unknown as User;

    response.json({
      ...document,
      balance: calculateTotalBalance(document.deposit),
    });
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getUser;
