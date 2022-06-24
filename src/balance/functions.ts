import { Deposit, User } from '../types';

const calculateTotalBalance = (deposit: User['deposit']) =>
  Object.keys(deposit).reduce(
    (previousValue, currentValue) => previousValue + +currentValue * deposit[currentValue as unknown as keyof Deposit],
    0
  );

export { calculateTotalBalance };
