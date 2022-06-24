const isDev = process.env.NODE_ENV === 'dev';
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
const accessTokenTimeToLive = isDev ? '120m' : '10m';

export { isDev, accessTokenSecret, refreshTokenSecret, accessTokenTimeToLive };
