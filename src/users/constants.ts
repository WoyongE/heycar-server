import Joi from 'joi';

const usernameValidationSchema = Joi.string().required().label('Username');
const passwordValidationSchema = Joi.string().min(6).max(72).required().label('Password');

export { passwordValidationSchema, usernameValidationSchema };
