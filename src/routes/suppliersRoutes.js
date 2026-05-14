import { Router } from 'express';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
} from '../controllers/suppliersController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createSupplierSchema,
  updateSupplierSchema,
} from '../validators/supplierValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', getSuppliers);
router.post('/', validateBody(createSupplierSchema), createSupplier);
router.put('/:supplierId', validateBody(updateSupplierSchema), updateSupplier);

export default router;