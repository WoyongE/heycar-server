import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from './constants';
import { JWTPayload } from './types';
import { usersCollection } from './mongo/collections';
import { getObjectId } from './utils';

const verifyToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
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

    try {
      const payload = (await jwt.verify(token, accessTokenSecret)) as JWTPayload;
      const userId = payload._id;
      const user = await usersCollection.findOne(
        { $and: [{ _id: getObjectId(userId) }, { access_token: token }] },
        { projection: { _id: 1, role: 1 } }
      );

      if (!user) {
        response.sendStatus(401);
        return;
      }

      request.user_id = userId;
      request.role = user.role;
      next();
    } catch (e) {
      console.log(e);
      response.sendStatus(403);
    }
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default verifyToken;
