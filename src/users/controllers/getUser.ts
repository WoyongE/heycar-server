import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { User, UserResponse } from '../../types';

const getUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user._id;
    const document = (await usersCollection.findOne({ _id: getObjectId(id) }, { projection: { password: 0 } })) as unknown as User;

    const responseJSON: UserResponse = {
      user: {
        _id: document._id.toString(),
        role: document.role,
        deposit: document.deposit,
        username: document.username,
      },
      other_sessions: document.tokens.length - 1,
    };

    response.json(responseJSON);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getUser;
