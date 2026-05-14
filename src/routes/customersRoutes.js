import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customersController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getCustomers);
router.get('/:customerId', getCustomerById);

export default router;