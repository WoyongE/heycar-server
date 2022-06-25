import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { accessTokenSecret, accessTokenTimeToLive, refreshTokenSecret } from '../constants';
import { usersCollection } from '../mongo/collections';
import { getObjectId } from '../utils';

const generateTokens = async (jwtPayload: JWTPayload): Promise<{ access_token: string; refresh_token: string }> => {
  const access_token = jwt.sign(jwtPayload, accessTokenSecret, { expiresIn: accessTokenTimeToLive });
  const refresh_token = jwt.sign(jwtPayload, refreshTokenSecret, { expiresIn: '1y' });

  await usersCollection.updateOne(
    { _id: getObjectId(jwtPayload._id) },
    { $push: { tokens: { refresh: refresh_token, access: access_token } } }
  );

  return { access_token, refresh_token };
};

export { generateTokens };
