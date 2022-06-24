import { ObjectId, OptionalId } from 'mongodb';

export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export type Deposit = {
  5: number;
  10: number;
  20: number;
  50: number;
  100: number;
};

export interface User extends OptionalId<any> {
  username: string;
  password: string;
  refresh_token: string;
  role: Role;
  deposit: Deposit;
}

export interface Product extends OptionalId<any> {
  cost: number;
  name: number;
  seller_id: ObjectId;
  amount_available: number;
  slug: string;
}

export type OrderResponse = {
  amount_spent: number;
  product: Partial<Product>;
  quantity: number;
  balance_denominations: Deposit;
  balance: number;
};

export type JWTPayload = {
  username: string;
  _id: string;
};
