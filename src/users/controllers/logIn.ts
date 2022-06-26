import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { passwordValidationSchema, usernameValidationSchema } from '../constants';
import { usersCollection } from '../../mongo/collections';
import { JWTPayload, LoginResponse, User } from '../../types';
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
    const userDocument = (await usersCollection.findOne({ username })) as unknown as User | null;

    if (!userDocument) {
      response.sendStatus(404);
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, userDocument.password);

    if (!passwordIsValid) {
      response.sendStatus(401);
      return;
    }

    const jwtPayload: JWTPayload = {
      _id: userDocument._id,
    };

    const { access_token, refresh_token } = await generateTokens(jwtPayload);
    const responseObject: LoginResponse = {
      user: {
        _id: userDocument._id,
        role: userDocument.role,
        deposit: userDocument.deposit,
        username: userDocument.username,
      },
      access_token,
      refresh_token,
      other_sessions: Math.max(userDocument.tokens.length - 1, 0),
    };

    if (request.isBuyer) {
      responseObject.user.deposit = userDocument.deposit;
    }

    response.json(responseObject);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default logIn;
