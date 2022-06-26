import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { usersCollection } from '../../mongo/collections';
import { refreshTokenSecret } from '../../constants';
import { JWTPayload } from '../../types';
import { generateTokens } from '../functions';
import { getObjectId } from '../../utils';

const getToken = async (request: Request, response: Response): Promise<void> => {
  try {
    const authHeader = request.get('Authorization');

    if (!authHeader) {
      response.sendStatus(401);
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      response.sendStatus(401);
      return;
    }

    const userDocument = await usersCollection.findOne({ tokens: { $elemMatch: { refresh: token } } });

    if (!userDocument) {
      response.sendStatus(403);
      return;
    }

    try {
      const user = jwt.verify(token, refreshTokenSecret) as JWTPayload;
      const jwtPayload: JWTPayload = { _id: user._id };
      const { access_token, refresh_token } = await generateTokens(jwtPayload);

      await usersCollection.updateOne(
        { _id: getObjectId(user._id) },
        {
          $pull: {
            tokens: {
              refresh: token,
            },
          },
        }
      );

      response.json({ access_token, refresh_token });
    } catch (e) {
      console.log(e);
      response.sendStatus(403);
    }
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getToken;
