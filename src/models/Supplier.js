import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    company: { type: String, default: '' },
    deliveryDate: { type: Date, default: Date.now },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Deactive'],
      default: 'Active',
    },
  },
  { timestamps: true, versionKey: false }
);

export const Supplier = mongoose.model('Supplier', supplierSchema);