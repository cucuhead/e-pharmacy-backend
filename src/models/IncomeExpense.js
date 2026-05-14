import mongoose from 'mongoose';

const incomeExpenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['Income', 'Expense', 'Error'],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const IncomeExpense = mongoose.model('IncomeExpense', incomeExpenseSchema);