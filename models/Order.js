const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, default: 1 }
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doorNo: { type: String, required: true },
  houseNo: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  mobile: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  address: addressSchema,
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Completed' },
  orderStatus: {
    type: String,
    enum: ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Order Confirmed'
  },
  estimatedDelivery: { type: String },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
