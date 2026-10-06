const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Alex Johnson' },
  email: { type: String, default: 'alex.johnson@example.com' },
  mobile: { type: String, default: '+91 98765 43210' },
  addresses: [{
    id: String,
    name: String,
    doorNo: String,
    houseNo: String,
    street: String,
    city: String,
    state: String,
    pinCode: String,
    mobile: String,
    isDefault: { type: Boolean, default: true }
  }],
  cart: [{
    productId: String,
    name: String,
    brand: String,
    image: String,
    price: Number,
    originalPrice: Number,
    size: String,
    color: String,
    quantity: { type: Number, default: 1 }
  }],
  wishlist: [{ type: String }] // product IDs
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
