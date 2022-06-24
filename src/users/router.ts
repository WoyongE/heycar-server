import express from 'express';
import signUp from './controllers/signUp';
import logIn from './controllers/logIn';
import getToken from './controllers/getToken';
import verifyToken from '../verifyToken';
import deleteUser from './controllers/deleteUser';
import updateUser from './controllers/updateUser';
import getUser from './controllers/getUser';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/token', getToken);
router.get('/', verifyToken, getUser);
router.put('/', verifyToken, updateUser);
router.delete('/', verifyToken, deleteUser);

export default router;
