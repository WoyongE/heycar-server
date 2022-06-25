import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { usersCollection } from '../../mongo/collections';
import { refreshTokenSecret } from '../../constants';
import { JWTPayload } from '../../types';
import { generateTokens } from '../functions';

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

    const tokenDocument = await usersCollection.findOne({ refresh_token: token }, { projection: {} });

    if (!tokenDocument) {
      response.sendStatus(403);
      return;
    }

    try {
      const user = (await jwt.verify(token, refreshTokenSecret)) as JWTPayload;
      const jwtPayload = { username: user.username, _id: user._id };
      const { access_token, refresh_token } = await generateTokens(jwtPayload);

      response.json({ access_token, refresh_token });
    } catch (e) {
      response.sendStatus(403);
      return;
    }
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default getToken;
