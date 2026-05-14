import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Supplier } from '../models/Supplier.js';
import { IncomeExpense } from '../models/IncomeExpense.js';

// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    // Parallel — 5 queries at once for performance
    const [
      productsCount,
      suppliersCount,
      customersCount,
      recentCustomers,
      incomeExpenses,
    ] = await Promise.all([
      Product.countDocuments(),
      Supplier.countDocuments(),
      Customer.countDocuments(),
      Customer.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email spent country image'),
      IncomeExpense.find()
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          allProducts: productsCount,
          allSuppliers: suppliersCount,
          allCustomers: customersCount,
        },
        recentCustomers,
        incomeExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};