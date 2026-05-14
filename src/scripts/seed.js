import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Supplier } from '../models/Supplier.js';
import { Order } from '../models/Order.js';
import { IncomeExpense } from '../models/IncomeExpense.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'seed-data');

// --- Helpers to clean dirty JSON values ---

// "3,450.75" → 3450.75 | "+99.99" → 99.99 | "-49.88" → -49.88 | "à§³ 6952.53" → 6952.53
const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value)
    .replace(/[^\d.\-+]/g, '') // strip everything except digits, dot, minus, plus
    .replace(/^\+/, ''); // strip leading +
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
};

// "Mar 1, 2024" → Date object
const parseDate = (value) => {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const readJSON = async (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
};

// --- Transformers ---

const transformCustomer = (c) => ({
  image: c.image || '',
  name: c.name,
  email: c.email,
  spent: parseNumber(c.spent),
  phone: c.phone || '',
  address: c.address || '',
  country: c.country || 'Ukraine',
  registerDate: parseDate(c.register_date),
});

const transformProduct = (p) => ({
  photo: p.photo || '',
  name: p.name,
  suppliers: p.suppliers || '',
  stock: parseNumber(p.stock),
  price: parseNumber(p.price),
  category: p.category || 'Medicine',
});

const transformSupplier = (s) => ({
  name: s.name,
  address: s.address || '',
  company: s.suppliers || s.company || '',
  deliveryDate: parseDate(s.date || s.deliveryDate),
  amount: parseNumber(s.amount),
  status: s.status === 'Deactive' ? 'Deactive' : 'Active',
});

const transformOrder = (o) => ({
  photo: o.photo || '',
  name: o.name,
  address: o.address || '',
  products: parseNumber(o.products),
  price: parseNumber(o.price),
  status: o.status || 'Pending',
  orderDate: parseDate(o.order_date),
});

const transformIncomeExpense = (i) => ({
  name: i.name,
  email: i.email || '',
  amount: parseNumber(i.amount),
  type: ['Income', 'Expense', 'Error'].includes(i.type) ? i.type : 'Expense',
});

// --- Main seed flow ---

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in .env');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log(`✓ Connected to ${mongoose.connection.name}\n`);

    // Wipe existing data
    console.log('Wiping existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Customer.deleteMany({}),
      Product.deleteMany({}),
      Supplier.deleteMany({}),
      Order.deleteMany({}),
      IncomeExpense.deleteMany({}),
    ]);
    console.log('✓ Cleared\n');

    // Seed default admin user (per spec: Clayton Santos / vendor@gmail.com)
    console.log('Seeding admin user...');
    await User.create({
      name: 'Clayton Santos',
      email: 'vendor@gmail.com',
      password: '123456', // hashed automatically via pre-save hook
    });
    console.log('✓ User: vendor@gmail.com / 123456\n');

    // Read and transform JSON files
    console.log('Reading JSON files...');
    const [customers, products, suppliers, orders, incomeExpenses] = await Promise.all([
      readJSON('customers.json'),
      readJSON('products.json'),
      readJSON('suppliers.json'),
      readJSON('orders.json'),
      readJSON('Income-Expenses.json'),
    ]);

    // Insert in parallel
    console.log('Inserting data...');
    const [c, p, s, o, ie] = await Promise.all([
      Customer.insertMany(customers.map(transformCustomer)),
      Product.insertMany(products.map(transformProduct)),
      Supplier.insertMany(suppliers.map(transformSupplier)),
      Order.insertMany(orders.map(transformOrder)),
      IncomeExpense.insertMany(incomeExpenses.map(transformIncomeExpense)),
    ]);

    console.log('\n--- Seed Summary ---');
    console.log(`✓ Customers: ${c.length}`);
    console.log(`✓ Products: ${p.length}`);
    console.log(`✓ Suppliers: ${s.length}`);
    console.log(`✓ Orders: ${o.length}`);
    console.log(`✓ Income/Expenses: ${ie.length}`);
    console.log('--------------------\n');

    console.log('✓ Seed completed successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();