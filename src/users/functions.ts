import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { accessTokenSecret, accessTokenTimeToLive, refreshTokenSecret } from '../constants';
import { usersCollection } from '../mongo/collections';
import { getObjectId } from '../utils';

const generateTokens = async (jwtPayload: JWTPayload): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = jwt.sign(jwtPayload, accessTokenSecret, { expiresIn: accessTokenTimeToLive });
  const refreshToken = jwt.sign(jwtPayload, refreshTokenSecret, { expiresIn: '1y' });

  await usersCollection.updateOne(
    { _id: getObjectId(jwtPayload._id) },
    { $set: { refresh_token: refreshToken, access_token: accessToken } }
  );

  return { accessToken, refreshToken };
};

export { generateTokens };
