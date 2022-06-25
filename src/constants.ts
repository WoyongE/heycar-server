import { Deposit } from './types';

const isDev = process.env.NODE_ENV === 'dev';
const isTest = process.env.NODE_ENV === 'test';
const port = process.env.PORT || 5009;
const basePath = `http://localhost:${port}`;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
const accessTokenTimeToLive = isDev ? '120m' : '10m';
const defaultDeposit: Deposit = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };

export { isDev, accessTokenSecret, refreshTokenSecret, accessTokenTimeToLive, defaultDeposit, basePath, port, isTest };
