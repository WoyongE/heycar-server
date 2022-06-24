import Joi from 'joi';
import { Deposit } from '../types';

const usernameValidationSchema = Joi.string().required();
const passwordValidationSchema = Joi.string().min(6).max(72).required();
const defaultDeposit: Deposit = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };

export { passwordValidationSchema, usernameValidationSchema, defaultDeposit };
