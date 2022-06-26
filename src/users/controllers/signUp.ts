import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { usersCollection } from '../../mongo/collections';
import { passwordValidationSchema, usernameValidationSchema } from '../constants';
import { JWTPayload } from '../../types';
import { generateTokens } from '../functions';
import { defaultDeposit } from '../../constants';

const signUp = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      username: usernameValidationSchema,
      password: passwordValidationSchema,
      role: Joi.string().valid('buyer', 'seller'),
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const { username, password, role } = request.body;
    const userDocument = await usersCollection.findOne({ username });

    if (userDocument) {
      response.status(409).send('User already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const document: Record<any, any> = {
      username,
      password: hashedPassword,
      role,
    };

    if (request.isBuyer) {
      document.deposit = defaultDeposit;
    }

    const documentInsertOneResult = await usersCollection.insertOne(document);
    const documentId = documentInsertOneResult.insertedId;
    const jwtPayload: JWTPayload = {
      username,
      _id: documentId.toString(),
    };

    const { access_token, refresh_token } = await generateTokens(jwtPayload);
    const responseObject = {
      user: {
        username,
        _id: documentId,
      },
      access_token,
      refresh_token,
    };

    response.json(responseObject);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default signUp;
