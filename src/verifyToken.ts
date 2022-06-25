import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from './constants';
import { JWTPayload, User } from './types';
import { usersCollection } from './mongo/collections';
import { getObjectId } from './utils';

const verifyToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = request.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      response.sendStatus(401);
      return;
    }

    try {
      const payload = (await jwt.verify(token, accessTokenSecret)) as JWTPayload;
      const userId = payload._id;
      const user = (await usersCollection.findOne({ $and: [{ _id: getObjectId(userId) }] })) as unknown as User;
      const { tokens } = user;

      if (!tokens.find(value => value.access === token)) {
        response.sendStatus(403);
        return;
      }

      if (!user) {
        response.sendStatus(401);
        return;
      }

      request.user_id = userId;
      request.role = user.role;
      request.token = token;
      request.user = user;
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
