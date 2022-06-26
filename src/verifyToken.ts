import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from './constants';
import { JWTPayload, Role, User } from './types';
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
      const payload = jwt.verify(token, accessTokenSecret) as JWTPayload;
      const userId = payload._id;
      const user = (await usersCollection.findOne({ $and: [{ _id: getObjectId(userId) }] })) as unknown as User;

      if (!user) {
        response.sendStatus(404);
        return;
      }

      const { tokens } = user;

      if (!tokens.find(value => value.access === token)) {
        response.sendStatus(403);
        return;
      }

      if (!user) {
        response.sendStatus(401);
        return;
      }

      request.token = token;
      request.isBuyer = user.role === Role.BUYER;
      request.isSeller = user.role === Role.SELLER;
      request.user = {
        ...user,
        _id: user._id.toString(),
      };

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
