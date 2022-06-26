import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const deleteUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user._id;
    await usersCollection.deleteOne({ _id: getObjectId(id) });

    response.status(204).send('User deleted');
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default deleteUser;
