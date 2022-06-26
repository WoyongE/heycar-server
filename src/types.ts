import { ObjectId } from 'mongodb';

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

export interface User {
  _id: string;
  username: string;
  password: string;
  role: Role;
  deposit: Deposit;
  tokens: { access: string; refresh: string }[];
}

export interface Product {
  _id: string;
  cost: number;
  name: string;
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

export type LoginResponse = {
  user: Partial<User>;
  access_token: string;
  refresh_token: string;
  other_sessions: number;
};

export type JWTPayload = {
  username: string;
  _id: string;
};
