import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', getProducts);
router.post('/', validateBody(createProductSchema), createProduct);
router.put('/:productId', validateBody(updateProductSchema), updateProduct);
router.delete('/:productId', deleteProduct);

export default router;