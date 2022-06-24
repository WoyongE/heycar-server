import Joi from 'joi';

const usernameValidationSchema = Joi.string().required();
const passwordValidationSchema = Joi.string().min(6).max(72).required();

export { passwordValidationSchema, usernameValidationSchema };
