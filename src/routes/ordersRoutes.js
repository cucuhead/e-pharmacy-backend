import { Router } from 'express';
import { getOrders } from '../controllers/ordersController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getOrders);

export default router;