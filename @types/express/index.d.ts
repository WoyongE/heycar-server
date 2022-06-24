import { Express } from 'express';

type User = import('../../src/types').User;

declare global {
  namespace Express {
    interface Request {
      role: User['role'];
      user_id: User['_id'];
    }
  }
}
