import { Request, Response } from 'express';
import Joi from 'joi';
import { ordersCollection, productsCollection, usersCollection } from '../../mongo/collections';
import { getObjectId } from '../../utils';
import { calculateTotalBalance } from '../../balance/functions';
import { Deposit, OrderResponse, Product, User } from '../../types';

const buyProduct = async (request: Request, response: Response): Promise<void> => {
  try {
    const schema = Joi.object().keys({
      product_id: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
    });

    const result = schema.validate(request.body, { abortEarly: false });

    if (result.error) {
      response.status(400).json(result.error.details);
      return;
    }

    const { product_id, quantity } = request.body;
    const productQuery = { _id: getObjectId(product_id) };
    const product = (await productsCollection.findOne(productQuery)) as unknown as Product | null;

    if (!product) {
      response.status(404).send('Product not found');
      return;
    }

    const userId = request.user_id;
    const findUserQuery = { _id: getObjectId(userId) };
    const userDocument = (await usersCollection.findOne(findUserQuery, { projection: { deposit: 1 } })) as unknown as User;
    const userTotalBalance = calculateTotalBalance(userDocument.deposit);
    const orderTotal = product.cost * quantity;

    if (userTotalBalance < orderTotal) {
      response.sendStatus(402);
      return;
    }

    await ordersCollection.insertOne({
      quantity,
      user_id: getObjectId(userId),
      product_id: getObjectId(product_id),
    });

    let cost = orderTotal;
    const balanceDenominations = userDocument.deposit;
    const sortedDepositedDenominations = Object.keys(balanceDenominations)
      .map(value => +value)
      .sort((a, b) => b - a);

    for (const key of sortedDepositedDenominations) {
      const denomination = key as keyof Deposit;
      const availableCoinsForDenomination = balanceDenominations[denomination];
      const numberOfCoinsForDenomination = Math.floor(cost / denomination);
      const numberOfCoinsToDeduct = Math.min(availableCoinsForDenomination, numberOfCoinsForDenomination);

      cost -= numberOfCoinsToDeduct * denomination;
      balanceDenominations[denomination] = +balanceDenominations[denomination] - numberOfCoinsToDeduct;
    }

    const responseAsJSON: OrderResponse = {
      amount_spent: orderTotal,
      quantity,
      balance_denominations: balanceDenominations,
      balance: calculateTotalBalance(balanceDenominations),
      product: {
        _id: product._id,
        cost: product.cost,
        name: product.name,
        slug: product.slug,
        amount_available: product.amount_available,
      },
    };

    await usersCollection.updateOne(findUserQuery, { $set: { deposit: balanceDenominations } });

    response.json(responseAsJSON);
  } catch (e) {
    console.log(e);
    response.sendStatus(500);
  }
};

export default buyProduct;
