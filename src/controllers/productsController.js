import { Product } from '../models/Product.js';
import { createError } from '../utils/httpError.js';

const ALLOWED_SORT = new Set([
  'name',
  'price',
  'stock',
  'category',
  'suppliers',
  'createdAt',
]);

const parseSort = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };

  const desc = sortParam.startsWith('-');
  const field = desc ? sortParam.slice(1) : sortParam;

  if (!ALLOWED_SORT.has(field)) return { createdAt: -1 };

  return { [field]: desc ? -1 : 1 };
};

// GET /api/products?name=...&category=...&sort=...&page=1&limit=10
export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const sort = parseSort(req.query.sort);

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:productId
export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:productId
export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return next(createError(404, 'Product not found'));
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted',
      data: { _id: product._id },
    });
  } catch (error) {
    next(error);
  }
};