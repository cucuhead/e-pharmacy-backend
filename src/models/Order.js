import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    photo: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    products: { type: Number, default: 0 },
    price: { type: Number, required: true },
 status: {
  type: String,
  enum: ['Completed', 'Confirmed', 'Pending', 'Cancelled', 'Processing', 'Shipped', 'Delivered'],
  default: 'Pending',
},
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

export const Order = mongoose.model('Order', orderSchema);