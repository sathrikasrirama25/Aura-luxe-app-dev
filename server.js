const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB, getMongoStatus } = require('./config/db');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const clientDistPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Load local fallback data
const productsFilePath = path.join(__dirname, 'data', 'products.json');
const dbFilePath = path.join(__dirname, 'data', 'db.json');

let localProducts = [];
try {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  localProducts = JSON.parse(data);
} catch (e) {
  console.error('Error reading products.json:', e);
}

// In-memory / persistent JSON fallback state
let fallbackDB = {
  cart: [],
  wishlist: ["shoe-01", "women-01", "men-01", "beauty-01"],
  orders: [
    {
      orderId: "LXC-92841",
      items: [
        {
          productId: "shoe-01",
          name: "Nike Air Zoom Pegasus 40",
          brand: "Nike",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
          price: 7999,
          size: "9",
          color: "Crimson Red",
          quantity: 1
        }
      ],
      totalAmount: 7999,
      discountAmount: 3996,
      deliveryCharge: 0,
      address: {
        name: "Alex Johnson",
        doorNo: "402",
        houseNo: "Block B, Skyline Heights",
        street: "Koramangala 4th Block",
        city: "Bengaluru",
        state: "Karnataka",
        pinCode: "560034",
        mobile: "9876543210"
      },
      paymentMethod: "PhonePe UPI",
      paymentStatus: "Completed",
      orderStatus: "Delivered",
      estimatedDelivery: "Delivered on 28 Sep",
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      orderId: "LXC-81723",
      items: [
        {
          productId: "men-01",
          name: "Ralph Lauren Classic Fit Oxford Cotton Shirt",
          brand: "Ralph Lauren",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80",
          price: 5999,
          size: "40",
          color: "Light Blue",
          quantity: 1
        }
      ],
      totalAmount: 5999,
      discountAmount: 2901,
      deliveryCharge: 0,
      address: {
        name: "Alex Johnson",
        doorNo: "402",
        houseNo: "Block B, Skyline Heights",
        street: "Koramangala 4th Block",
        city: "Bengaluru",
        state: "Karnataka",
        pinCode: "560034",
        mobile: "9876543210"
      },
      paymentMethod: "Google Pay UPI",
      paymentStatus: "Completed",
      orderStatus: "Shipped",
      estimatedDelivery: "Arriving by Tomorrow",
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  user: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    mobile: "+91 98765 43210",
    savedAddress: {
      name: "Alex Johnson",
      doorNo: "402",
      houseNo: "Block B, Skyline Heights",
      street: "Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560034",
      mobile: "9876543210"
    }
  }
};

// Initialize persistent db.json if exists
if (fs.existsSync(dbFilePath)) {
  try {
    const saved = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    fallbackDB = { ...fallbackDB, ...saved };
  } catch (err) {
    console.warn('Could not parse existing db.json, using defaults.');
  }
} else {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(fallbackDB, null, 2));
  } catch (e) {}
}

const saveFallbackDB = () => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(fallbackDB, null, 2));
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
};

// Seed MongoDB if connected
const seedMongo = async () => {
  if (!getMongoStatus()) return;
  try {
    const count = await Product.countDocuments();
    if (count === 0 && localProducts.length > 0) {
      console.log(`[MongoDB] Seeding ${localProducts.length} demo products...`);
      await Product.insertMany(localProducts);
      console.log(`[MongoDB] Seed complete!`);
    }
  } catch (err) {
    console.error('[MongoDB] Seeding error:', err.message);
  }
};

// ======================== API ROUTES ========================

// 1. Health & Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    appName: 'LuxeCart - Your Shopping Application',
    database: getMongoStatus() ? 'MongoDB Active' : 'Fallback High-Speed JSON Store Active',
    totalProducts: localProducts.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Get Products (Search, Category, Filter, Sort)
app.get('/api/products', async (req, res) => {
  try {
    const { q, category, subCategory, minPrice, maxPrice, minRating, sort } = req.query;

    let results = [];

    if (getMongoStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (subCategory) {
        query.subCategory = { $regex: new RegExp(subCategory, 'i') };
      }
      if (q) {
        const searchRegex = new RegExp(q.trim(), 'i');
        query.$or = [
          { name: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
          { subCategory: searchRegex },
          { description: searchRegex }
        ];
      }
      if (minPrice || maxPrice) {
        query.discountedPrice = {};
        if (minPrice) query.discountedPrice.$gte = Number(minPrice);
        if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
      }
      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }

      let mongoQuery = Product.find(query);

      // Sorting
      if (sort === 'price-asc') mongoQuery = mongoQuery.sort({ discountedPrice: 1 });
      else if (sort === 'price-desc') mongoQuery = mongoQuery.sort({ discountedPrice: -1 });
      else if (sort === 'rating') mongoQuery = mongoQuery.sort({ rating: -1 });
      else if (sort === 'discount') mongoQuery = mongoQuery.sort({ discount: -1 });
      else if (sort === 'newest') mongoQuery = mongoQuery.sort({ createdAt: -1 });

      results = await mongoQuery.exec();
    }

    // If mongo returned empty or not connected, filter in-memory catalog
    if (!results || results.length === 0) {
      results = [...localProducts];

      // Category filter
      if (category && category !== 'All') {
        const catLower = category.toLowerCase();
        results = results.filter(p => p.category.toLowerCase() === catLower);
      }

      // SubCategory filter
      if (subCategory) {
        const subLower = subCategory.toLowerCase();
        results = results.filter(p => p.subCategory && p.subCategory.toLowerCase().includes(subLower));
      }

      // Search query (supports multi-term matching like "black shoes")
      if (q && q.trim()) {
        const terms = q.trim().toLowerCase().split(/\s+/);
        results = results.filter(p => {
          const haystack = `${p.name} ${p.brand} ${p.category} ${p.subCategory || ''} ${p.description} ${(p.colors || []).join(' ')}`.toLowerCase();
          return terms.every(term => haystack.includes(term));
        });
      }

      // Price filter
      if (minPrice) {
        results = results.filter(p => p.discountedPrice >= Number(minPrice));
      }
      if (maxPrice) {
        results = results.filter(p => p.discountedPrice <= Number(maxPrice));
      }

      // Rating filter
      if (minRating) {
        results = results.filter(p => p.rating >= Number(minRating));
      }

      // Sorting
      if (sort === 'price-asc') {
        results.sort((a, b) => a.discountedPrice - b.discountedPrice);
      } else if (sort === 'price-desc') {
        results.sort((a, b) => b.discountedPrice - a.discountedPrice);
      } else if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'discount') {
        results.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      }
    }

    res.json({
      success: true,
      count: results.length,
      products: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Single Product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (getMongoStatus()) {
      product = await Product.findOne({ id }).lean();
    }
    if (!product) {
      product = localProducts.find(p => p.id === id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Categories & Count
app.get('/api/categories', (req, res) => {
  const categoriesMap = {};
  localProducts.forEach(p => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });

  const categories = Object.keys(categoriesMap).map(name => ({
    name,
    count: categoriesMap[name]
  }));

  res.json({ success: true, categories });
});

// 5. Cart Endpoints
app.get('/api/cart', (req, res) => {
  res.json({ success: true, cart: fallbackDB.cart });
});

app.post('/api/cart', (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;
  const product = localProducts.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existingIndex = fallbackDB.cart.findIndex(
    item => item.productId === productId && item.size === (size || item.size) && item.color === (color || item.color)
  );

  if (existingIndex > -1) {
    fallbackDB.cart[existingIndex].quantity += quantity;
  } else {
    fallbackDB.cart.push({
      cartItemId: `${productId}-${Date.now()}`,
      productId,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      price: product.discountedPrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      size: size || (product.sizes && product.sizes[0]) || 'Standard',
      color: color || (product.colors && product.colors[0]) || 'Default',
      quantity
    });
  }

  saveFallbackDB();
  res.json({ success: true, message: 'Added to cart', cart: fallbackDB.cart });
});

app.put('/api/cart/:cartItemId', (req, res) => {
  const { cartItemId } = req.params;
  const { quantity, size } = req.body;

  const item = fallbackDB.cart.find(i => i.cartItemId === cartItemId || i.productId === cartItemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Cart item not found' });
  }

  if (quantity !== undefined) {
    if (quantity <= 0) {
      fallbackDB.cart = fallbackDB.cart.filter(i => i !== item);
    } else {
      item.quantity = quantity;
    }
  }
  if (size !== undefined) {
    item.size = size;
  }

  saveFallbackDB();
  res.json({ success: true, cart: fallbackDB.cart });
});

app.delete('/api/cart/:cartItemId', (req, res) => {
  const { cartItemId } = req.params;
  fallbackDB.cart = fallbackDB.cart.filter(i => i.cartItemId !== cartItemId && i.productId !== cartItemId);
  saveFallbackDB();
  res.json({ success: true, message: 'Item removed', cart: fallbackDB.cart });
});

app.delete('/api/cart', (req, res) => {
  fallbackDB.cart = [];
  saveFallbackDB();
  res.json({ success: true, message: 'Cart cleared', cart: [] });
});

// 6. Orders Endpoints
app.get('/api/orders', async (req, res) => {
  try {
    let orders = [];
    if (getMongoStatus()) {
      orders = await Order.find().sort({ createdAt: -1 }).lean();
    }
    if (!orders || orders.length === 0) {
      orders = fallbackDB.orders;
    }
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, address, paymentMethod, totalAmount, discountAmount } = req.body;

    // Strict validation
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot place order with empty items' });
    }
    if (!address || !address.name || !address.doorNo || !address.street || !address.city || !address.state || !address.pinCode || !address.mobile) {
      return res.status(400).json({ success: false, message: 'All address fields are required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    const orderId = `LXC-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryDays = Math.floor(Math.random() * 2) + 2;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + deliveryDays);
    const estimatedDelivery = `Delivery by ${estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;

    const newOrder = {
      orderId,
      items,
      totalAmount: Number(totalAmount),
      discountAmount: Number(discountAmount || 0),
      deliveryCharge: 0,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Order Confirmed',
      estimatedDelivery,
      orderDate: new Date().toISOString()
    };

    if (getMongoStatus()) {
      try {
        await Order.create(newOrder);
      } catch (e) {
        console.warn('MongoDB insert failed, using fallback store:', e.message);
      }
    }

    // Always update fallback DB
    fallbackDB.orders.unshift(newOrder);
    fallbackDB.cart = []; // clear cart
    fallbackDB.user.savedAddress = address; // save address for future
    saveFallbackDB();

    res.status(201).json({
      success: true,
      message: 'Your order is confirmed!',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Wishlist Endpoints
app.get('/api/wishlist', (req, res) => {
  const items = fallbackDB.wishlist.map(id => localProducts.find(p => p.id === id)).filter(Boolean);
  res.json({ success: true, wishlistIds: fallbackDB.wishlist, items });
});

app.post('/api/wishlist/toggle', (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

  const idx = fallbackDB.wishlist.indexOf(productId);
  let action = '';
  if (idx > -1) {
    fallbackDB.wishlist.splice(idx, 1);
    action = 'removed';
  } else {
    fallbackDB.wishlist.push(productId);
    action = 'added';
  }

  saveFallbackDB();
  res.json({ success: true, action, wishlistIds: fallbackDB.wishlist });
});

// 8. User Profile & Address
app.get('/api/user', (req, res) => {
  res.json({ success: true, user: fallbackDB.user });
});

app.put('/api/user/address', (req, res) => {
  const address = req.body;
  fallbackDB.user.savedAddress = address;
  saveFallbackDB();
  res.json({ success: true, savedAddress: fallbackDB.user.savedAddress });
});

// 9. Promo & Coupon Codes
const VALID_COUPONS = {
  'AURA50': { code: 'AURA50', discountType: 'percentage', value: 50, maxDiscount: 2500, minCart: 999, description: '50% Flat OFF up to ₹2,500' },
  'WELCOME20': { code: 'WELCOME20', discountType: 'percentage', value: 20, maxDiscount: 1000, minCart: 499, description: '20% OFF on your order' },
  'FREESHIP': { code: 'FREESHIP', discountType: 'shipping', value: 100, minCart: 0, description: '100% Free Express Shipping' },
  'FESTIVE30': { code: 'FESTIVE30', discountType: 'percentage', value: 30, maxDiscount: 1500, minCart: 1499, description: 'Festive Flash Deal: 30% OFF' }
};

app.get('/api/coupons', (req, res) => {
  res.json({ success: true, coupons: Object.values(VALID_COUPONS) });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });
  const normalized = code.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalized];

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid promo code' });
  }

  if (cartTotal && cartTotal < coupon.minCart) {
    return res.status(400).json({ 
      success: false, 
      message: `Minimum order value for ${normalized} is ₹${coupon.minCart}` 
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.min((cartTotal * coupon.value) / 100, coupon.maxDiscount);
  } else if (coupon.discountType === 'fixed') {
    discount = coupon.value;
  }

  res.json({
    success: true,
    coupon: {
      ...coupon,
      calculatedDiscount: Math.round(discount)
    },
    message: `Coupon ${normalized} applied successfully!`
  });
});

// Fallback to React App
app.get('*', (req, res) => {
  const clientIndex = path.join(__dirname, 'client', 'dist', 'index.html');
  if (fs.existsSync(clientIndex)) {
    return res.sendFile(clientIndex);
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const startServer = async () => {
  await connectDB();
  await seedMongo();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 AURALUXE / LuxeCart - MERN E-Commerce Backend Running!`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📦 Loaded ${localProducts.length} Products across 7 Categories`);
    console.log(`======================================================\n`);
  });
};

startServer();
