import { Request, Response } from 'express';
import { usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';

const logout = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = request.user._id;

    await usersCollection.updateOne(
      { _id: getObjectId(id) },
      {
        $pull: {
          tokens: {
            access: request.token,
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

export default logout;
