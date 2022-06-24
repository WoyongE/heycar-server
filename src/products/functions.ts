import { CustomHelpers } from 'joi';

const validateCost = (value: number, helpers: CustomHelpers) => {
  if (value % 5 !== 0) {
    return helpers.error('any.not_a_multiple');
  }

  return value;
};

export { validateCost };
