import { NextFunction, Request, Response } from 'express';
import { Role } from './types';

const verifyRole =
  (role: Role) =>
  (request: Request, response: Response, next: NextFunction): void => {
    if (role !== request.user.role) {
      response.sendStatus(403);
      return;
    }

    next();
  };

export default verifyRole;
