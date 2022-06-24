import express from 'express';
import getProduct from './controllers/getProduct';
import getAllProducts from './controllers/getAllProducts';
import addProduct from './controllers/addProduct';
import deleteProduct from './controllers/deleteProduct';
import updateProduct from './controllers/updateProduct';
import verifyToken from '../verifyToken';
import verifyRole from '../verifyRole';
import { Role } from '../types';
import verifySeller from './middlewares/verifySeller';

const productsRouter = express.Router();

productsRouter.get('/', verifyToken, getAllProducts);
productsRouter.post('/', verifyToken, verifyRole(Role.SELLER), addProduct);
productsRouter.get('/:id', verifyToken, getProduct);
productsRouter.delete('/:id', verifyToken, verifyRole(Role.SELLER), verifySeller, deleteProduct);
productsRouter.put('/:id', verifyToken, verifyRole(Role.SELLER), verifySeller, updateProduct);

export default productsRouter;
