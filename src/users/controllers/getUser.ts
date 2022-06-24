import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const getUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user_id;
    const document = await usersCollection.findOne(
      { _id: getObjectId(id) },
      { projection: { access_token: 0, refresh_token: 0, password: 0 } }
    );

    response.json(document);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getUser;
