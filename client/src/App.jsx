import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

// Local high-speed fallback products data
import localProductsData from './data/products.json';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import WishlistModal from './components/WishlistModal';
import BrandNameModal from './components/BrandNameModal';
import Footer from './components/Footer';
import Toast from './components/Toast';

import { Filter, SlidersHorizontal, Sparkles, Layers } from 'lucide-react';
import './App.css';

export default function App() {
  // Brand name state (configurable via Brand Suggester Modal)
  const [brandName, setBrandName] = useState(() => {
    return localStorage.getItem('auraluxe_brand') || 'AURALUXE';
  });

  // App core state
  const [products, setProducts] = useState(localProductsData);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(false);

  // Cart & Wishlist state
  const [cart, setCart] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(['shoe-01', 'women-01', 'men-01', 'beauty-01']);
  const [orders, setOrders] = useState([]);
  const [savedUser, setSavedUser] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isBrandIdeasOpen, setIsBrandIdeasOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Notifications
  const [toasts, setToasts] = useState([]);

  const catalogRef = useRef(null);
  const gridRef = useRef(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Data Fetching from Express API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && prodData.products?.length > 0) {
            setProducts(prodData.products);
          }
        }

        // Fetch categories
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && catData.categories) {
            setCategories(catData.categories);
          }
        }

        // Fetch cart
        const cartRes = await fetch('/api/cart');
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (cartData.success && cartData.cart) {
            setCart(cartData.cart);
          }
        }

        // Fetch wishlist
        const wishRes = await fetch('/api/wishlist');
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          if (wishData.success && wishData.wishlistIds) {
            setWishlistIds(wishData.wishlistIds);
          }
        }

        // Fetch orders
        const ordersRes = await fetch('/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success && ordersData.orders) {
            setOrders(ordersData.orders);
          }
        }

        // Fetch user
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success && userData.user) {
            setSavedUser(userData.user);
          }
        }
      } catch (err) {
        console.warn('Backend API connection warning, using high-speed local data:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Compute categories if backend was not connected
  useEffect(() => {
    if (categories.length === 0 && products.length > 0) {
      const map = {};
      products.forEach((p) => {
        map[p.category] = (map[p.category] || 0) + 1;
      });
      setCategories(Object.keys(map).map((name) => ({ name, count: map[name] })));
    }
  }, [products, categories]);

  // 2. Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (activeCategory && activeCategory !== 'All') {
      const catLower = activeCategory.toLowerCase();
      list = list.filter((p) => p.category.toLowerCase() === catLower);
    }

    // Search Query (Multi-token match across name, brand, category, subcategory, tags)
    if (searchQuery.trim()) {
      const tokens = searchQuery.trim().toLowerCase().split(/\s+/);
      list = list.filter((p) => {
        const text = `${p.name} ${p.brand} ${p.category} ${p.subCategory || ''} ${p.description || ''} ${(p.colors || []).join(' ')}`.toLowerCase();
        return tokens.every((token) => text.includes(token));
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  // GSAP animation on category or filter change
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [activeCategory, sortBy, searchQuery]);

  // Cart Handlers
  const handleAddToCart = async (item) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (e) {
      // Local fallback state
      setCart((prev) => {
        const found = products.find((p) => p.id === item.productId);
        if (!found) return prev;
        const existingIdx = prev.findIndex(
          (i) => i.productId === item.productId && i.size === item.size
        );
        if (existingIdx > -1) {
          const clone = [...prev];
          clone[existingIdx].quantity += item.quantity || 1;
          return clone;
        }
        return [
          ...prev,
          {
            cartItemId: `${item.productId}-${Date.now()}`,
            productId: item.productId,
            name: found.name,
            brand: found.brand,
            image: found.images[0],
            price: found.discountedPrice,
            originalPrice: found.originalPrice,
            discount: found.discount,
            size: item.size,
            color: item.color,
            quantity: item.quantity || 1
          }
        ];
      });
    }

    const prod = products.find((p) => p.id === item.productId);
    addToast(`${prod ? prod.name : 'Item'} added to bag!`, 'success');
  };

  const handleUpdateQuantity = async (cartItemId, newQty) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
        return;
      }
    } catch (e) {}

    // Local fallback
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId || i.productId === cartItemId) {
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
        return;
      }
    } catch (e) {}

    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId && i.productId !== cartItemId));
    addToast('Item removed from bag', 'info');
  };

  const handleClearCart = async () => {
    try {
      await fetch('/api/cart', { method: 'DELETE' });
    } catch (e) {}
    setCart([]);
    addToast('Bag cleared', 'info');
  };

  // Wishlist Handler
  const handleToggleWishlist = async (productId) => {
    const isAdded = !wishlistIds.includes(productId);

    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (data.success && data.wishlistIds) {
        setWishlistIds(data.wishlistIds);
      }
    } catch (e) {
      setWishlistIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    }

    const prod = products.find((p) => p.id === productId);
    addToast(
      isAdded
        ? `Added ${prod ? prod.name : 'product'} to Wishlist!`
        : `Removed ${prod ? prod.name : 'product'} from Wishlist`,
      isAdded ? 'success' : 'info'
    );
  };

  // Coupon Handler
  const handleApplyCoupon = async (code, cartTotal, callback) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal })
      });
      const data = await res.json();

      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        addToast(data.message || `Coupon ${code} applied!`, 'success');
        if (callback) callback(null, data.coupon);
      } else {
        if (callback) callback(data.message || 'Invalid coupon code');
      }
    } catch (e) {
      // Local fallback coupons
      const localCoupons = {
        AURA50: { code: 'AURA50', calculatedDiscount: Math.min(Math.round(cartTotal * 0.5), 2500) },
        WELCOME20: { code: 'WELCOME20', calculatedDiscount: Math.min(Math.round(cartTotal * 0.2), 1000) },
        FREESHIP: { code: 'FREESHIP', calculatedDiscount: 99 }
      };
      if (localCoupons[code]) {
        setAppliedCoupon(localCoupons[code]);
        addToast(`Coupon ${code} applied!`, 'success');
        if (callback) callback(null, localCoupons[code]);
      } else {
        if (callback) callback('Invalid coupon code');
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Buy Now (Instant Direct Checkout)
  const handleBuyNow = (item) => {
    handleAddToCart(item);
    setQuickViewProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    addToast(`Order #${newOrder.orderId} placed successfully!`, 'success');
  };

  // Brand Name Selection
  const handleBrandChange = (newName) => {
    setBrandName(newName);
    localStorage.setItem('auraluxe_brand', newName);
    setIsBrandIdeasOpen(false);
    addToast(`Store branding updated to ${newName}!`, 'success');
  };

  // Scroll to catalog
  const handleExploreClick = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Wishlist items
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="app-root">
      {/* Top Banner */}
      <div className="announcement-bar">
        <span className="announcement-badge">NEW DROP</span>
        <span>
          Spring / Summer 2026 Collection Live — Use Code <strong style={{ color: '#fbbf24' }}>AURA50</strong> for 50% Flat Off!
        </span>
      </div>

      {/* Global Header */}
      <Header
        brandName={brandName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenBrandIdeas={() => setIsBrandIdeasOpen(true)}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleExploreClick();
        }}
        totalProductsCount={products.length}
      />

      {/* Hero Showcase Section */}
      <Hero
        onExploreClick={handleExploreClick}
        onQuickViewProduct={(prod) => setQuickViewProduct(prod)}
        featuredProduct={products[0]}
      />

      {/* Main Product Catalog Section */}
      <main className="container" ref={catalogRef} style={{ paddingTop: '20px' }}>
        {/* Section Header with Filter & Sort Controls */}
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {activeCategory === 'All' ? 'Curated Master Collection' : `${activeCategory} Collection`}
            </h2>
            <p className="section-subtitle">
              Showing {filteredProducts.length} premium designer products
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>

          <div className="filter-sort-controls">
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={15} /> Sort by:
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating (Highest)</option>
              <option value="discount">Biggest Discount (%)</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Layers size={28} color="#64748b" />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No matching curations found</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>Try adjusting your search query or switching categories.</p>
            <button
              className="btn-secondary"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid" ref={gridRef}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        brandName={brandName}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleExploreClick();
        }}
      />

      {/* Product Detail Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          isWishlisted={wishlistIds.includes(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedCoupon={appliedCoupon}
        savedUser={savedUser}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Orders History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onReorder={(order) => {
          (order.items || []).forEach((item) => handleAddToCart(item));
          setIsOrdersOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Brand Name Suggester Modal */}
      <BrandNameModal
        isOpen={isBrandIdeasOpen}
        onClose={() => setIsBrandIdeasOpen(false)}
        activeBrandName={brandName}
        onSelectBrandName={handleBrandChange}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
