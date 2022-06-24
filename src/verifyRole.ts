import { NextFunction, Request, Response } from 'express';
import { Role } from './types';

const verifyRole =
  (role: Role) =>
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      if (role !== request.role) {
        response.sendStatus(403);
        return;
      }

      next();
    } catch (e) {
      console.log(e);
      response.sendStatus(500);
    }
  };

export default verifyRole;
