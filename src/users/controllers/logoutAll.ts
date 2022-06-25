import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const logoutAll = async (request: Request, response: Response): Promise<void> => {
  try {
    if (request.user.tokens.length < 2) {
      response.sendStatus(422);
      return;
    }

    const id = request.user_id;
    await usersCollection.updateOne(
      { _id: getObjectId(id) },
      {
        $pull: {
          tokens: {
            access: {
              $ne: request.token,
            },
          },
        },
      }
    );

    response.sendStatus(200);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default logoutAll;
