import { Deposit } from './types';

const nodeEnv = process.env.NODE_ENV;
const port = process.env.PORT;
const isDev = nodeEnv === 'dev' || nodeEnv === 'test';
const basePath = `http://localhost:${port}`;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
const defaultDeposit: Deposit = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };

export { isDev, accessTokenSecret, refreshTokenSecret, defaultDeposit, basePath, port };
