import express from 'express';
import signUp from './controllers/signUp';
import logIn from './controllers/logIn';
import getToken from './controllers/getToken';
import verifyToken from '../verifyToken';
import deleteUser from './controllers/deleteUser';
import updateUser from './controllers/updateUser';
import getUser from './controllers/getUser';

const usersRouter = express.Router();

usersRouter.post('/signup', signUp);
usersRouter.post('/login', logIn);
usersRouter.get('/token', getToken);
usersRouter.get('/', verifyToken, getUser);
usersRouter.put('/', verifyToken, updateUser);
usersRouter.delete('/', verifyToken, deleteUser);

export default usersRouter;
