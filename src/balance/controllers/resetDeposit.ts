import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { defaultDeposit } from '../../users/constants';

const resetDeposit = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user_id;
    await usersCollection.updateOne({ _id: getObjectId(id) }, { $set: { deposit: defaultDeposit } });

    response.sendStatus(200);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default resetDeposit;
