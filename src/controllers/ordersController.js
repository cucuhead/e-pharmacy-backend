import { Order } from '../models/Order.js';

// Allowed sort fields (güvenlik: arbitrary field sort'una izin vermiyoruz)
const ALLOWED_SORT = new Set([
  'name',
  'price',
  'products',
  'status',
  'orderDate',
  'createdAt',
]);

// "?sort=price" → { price: 1 }
// "?sort=-price" → { price: -1 }
// Default: en yeni önce (orderDate desc)
const parseSort = (sortParam) => {
  if (!sortParam) return { orderDate: -1 };

  const desc = sortParam.startsWith('-');
  const field = desc ? sortParam.slice(1) : sortParam;

  if (!ALLOWED_SORT.has(field)) return { orderDate: -1 };

  return { [field]: desc ? -1 : 1 };
};

// GET /api/orders?name=...&status=...&sort=...&page=1&limit=10
export const getOrders = async (req, res, next) => {
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
      Order.find(filter).sort(sort).skip(skip).limit(limit),
      Order.countDocuments(filter),
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