import { Supplier } from '../models/Supplier.js';
import { createError } from '../utils/httpError.js';

const ALLOWED_SORT = new Set([
  'name',
  'company',
  'amount',
  'deliveryDate',
  'status',
  'createdAt',
]);

const parseSort = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };
  const desc = sortParam.startsWith('-');
  const field = desc ? sortParam.slice(1) : sortParam;
  if (!ALLOWED_SORT.has(field)) return { createdAt: -1 };
  return { [field]: desc ? -1 : 1 };
};

// GET /api/suppliers?name=...&status=...&sort=...&page=1&limit=10
export const getSuppliers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const sort = parseSort(req.query.sort);

    const [items, total] = await Promise.all([
      Supplier.find(filter).sort(sort).skip(skip).limit(limit),
      Supplier.countDocuments(filter),
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

// POST /api/suppliers
export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      status: 'success',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/suppliers/:supplierId
export const updateSupplier = async (req, res, next) => {
  try {
    const { supplierId } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!supplier) {
      return next(createError(404, 'Supplier not found'));
    }

    res.status(200).json({
      status: 'success',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};