import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { passwordValidationSchema, usernameValidationSchema } from '../constants';
import { usersCollection } from '../../mongo/collections';
import { User } from '../../types';
import { generateTokens } from '../functions';

const logIn = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      username: usernameValidationSchema,
      password: passwordValidationSchema,
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const { username, password } = request.body;
    const userDocument = (await usersCollection.findOne(
      { username },
      { projection: { access_token: 0, refresh_token: 0 } }
    )) as unknown as User | null;

    if (!userDocument) {
      response.sendStatus(404);
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, userDocument.password);

    if (!passwordIsValid) {
      response.sendStatus(401);
      return;
    }

    const responseObject: Partial<User> = userDocument;

    delete responseObject.password;
    delete responseObject.refresh_token;

    const jwtPayload = {
      username: userDocument.username,
      _id: userDocument._id,
    };

    const { accessToken, refreshToken } = await generateTokens(jwtPayload);

    response.json({ user: responseObject, accessToken, refreshToken });
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default logIn;
