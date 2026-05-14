import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';
import { createError } from '../utils/httpError.js';

// GET /api/customers?name=...&page=1&limit=10
export const getCustomers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(filter),
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

// GET /api/customers/:customerId
export const getCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return next(createError(404, 'Customer not found'));
    }

    // İşlem geçmişi — name eşleşmesine göre (schema'da FK yok, isimle bağlanıyoruz)
    const orderHistory = await Order.find({ name: customer.name })
      .sort({ orderDate: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        customer,
        orderHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};