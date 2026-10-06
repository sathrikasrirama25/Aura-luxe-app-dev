const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  description: { type: String },
  images: [{ type: String }],
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: Number },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  material: { type: String },
  stockStatus: { type: String, default: 'In Stock' },
  offerLabel: { type: String },
  views: {
    front: String,
    side: String,
    back: String,
    top: String,
    detail: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
