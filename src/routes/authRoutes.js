import { Router } from 'express';
import { login, logout, getUserInfo } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.get('/logout', authenticate, logout);
router.get('/user-info', authenticate, getUserInfo);

export default router;