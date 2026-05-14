import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    photo: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    suppliers: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const Product = mongoose.model('Product', productSchema);