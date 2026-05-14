import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    image: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    spent: { type: Number, default: 0 },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    country: { type: String, default: 'Ukraine' },
    registerDate: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export const Customer = mongoose.model('Customer', customerSchema);