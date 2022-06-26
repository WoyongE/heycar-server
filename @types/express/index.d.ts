// eslint-disable-next-line
import { Express } from 'express';

type User = import('../../src/types').User;

declare global {
  namespace Express {
    interface Request {
      user: User;
      token: string;
      isBuyer: boolean;
      isSeller: boolean;
    }
  }
}
