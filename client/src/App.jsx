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
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import HelpModal from './components/HelpModal';

import { Filter, SlidersHorizontal, Sparkles, Layers } from 'lucide-react';
import './App.css';

import Login from './components/Login';


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
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Default luxury sample orders to allow immediate cancellation testing
    return [
      {
        orderId: 'LXC-748921',
        items: [
          {
            name: 'Rolex Submariner Date 41mm',
            brand: 'Rolex',
            price: 875000,
            quantity: 1,
            size: '41mm',
            color: 'Cerachrom Black',
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80'
          }
        ],
        totalAmount: 875000,
        orderStatus: 'In Transit',
        carrier: 'BlueDart Apex Express',
        awbNumber: 'BD-982341094-IN',
        estimatedDelivery: 'Tomorrow by 4:00 PM',
        orderDate: '2026-10-12T14:30:00.000Z',
        paymentMethod: 'UPI (Google Pay)',
        address: {
          name: 'Alex Mercer',
          doorNo: 'Villa 7',
          street: 'Palm Meadows, Whitefield',
          city: 'Bengaluru',
          pinCode: '560066'
        }
      },
      {
        orderId: 'LXC-612944',
        items: [
          {
            name: 'Dior Sauvage Elixir Parfum',
            brand: 'Dior',
            price: 18500,
            quantity: 1,
            size: '100ml',
            image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80'
          },
          {
            name: 'Air Jordan 1 Retro High OG',
            brand: 'Nike',
            price: 16995,
            quantity: 1,
            size: 'UK 9',
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=80'
          }
        ],
        totalAmount: 35495,
        orderStatus: 'Processing',
        carrier: 'Delhivery Luxury Cargo',
        awbNumber: 'DL-448102941-IN',
        estimatedDelivery: '16 Oct 2026',
        orderDate: '2026-10-14T09:15:00.000Z',
        paymentMethod: 'Credit Card (•••• 4242)',
        address: {
          name: 'Alex Mercer',
          doorNo: 'Villa 7',
          street: 'Palm Meadows, Whitefield',
          city: 'Bengaluru',
          pinCode: '560066'
        }
      }
    ];
  });
  const [savedUser, setSavedUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem('auraluxe_user') || localStorage.getItem('auraluxe_guest') === 'true';
    } catch {
      return false;
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Authenticated User State (OAuth / Profile)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auraluxe_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isBrandIdeasOpen, setIsBrandIdeasOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInitialTab, setHelpInitialTab] = useState('track');
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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('auraluxe_user', JSON.stringify(user));
    } catch (e) {}

    if (user.savedAddress) {
      setSavedUser((prev) => ({
        ...(prev || {}),
        savedAddress: user.savedAddress
      }));
    }
    addToast(`Welcome, ${user.name}! VIP perks & OAuth profile synced ✨`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('auraluxe_user');
      localStorage.removeItem('auraluxe_guest');
    } catch (e) {}
    setIsLoggedIn(false);
    addToast('You have been signed out successfully.', 'info');
  };

  const handleOpenHelp = (tab = 'track') => {
    setHelpInitialTab(tab);
    setIsHelpOpen(true);
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

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auraluxe_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Order Placement
  const handleOrderPlaced = (newOrder) => {
    const formattedOrder = {
      ...newOrder,
      orderStatus: newOrder.orderStatus || 'Processing',
      carrier: newOrder.carrier || 'BlueDart Apex Express',
      awbNumber: newOrder.awbNumber || `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`,
      estimatedDelivery: newOrder.estimatedDelivery || 'In 2-3 Business Days'
    };
    setOrders((prev) => [formattedOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    addToast(`Order #${newOrder.orderId} placed successfully!`, 'success');
  };

  // Order Cancellation Handler
  const handleCancelOrder = async (orderId, reason) => {
    const cancelledAt = new Date().toISOString();

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          return {
            ...ord,
            orderStatus: 'Cancelled',
            cancelledAt,
            cancellationReason: reason
          };
        }
        return ord;
      })
    );

    try {
      await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, cancelledAt })
      });
    } catch (e) {
      // Offline / GitHub Pages fallback
    }

    addToast(`Order #${orderId} has been cancelled. 100% full refund initiated!`, 'info');
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

  const handleLoginFromGate = (userProfile) => {
    setIsLoggedIn(true);
    if (userProfile) {
      handleLoginSuccess(userProfile);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginFromGate} />;
  }

  return (
    <div className="app-root">
      {/* Top Banner */}
      <div className="announcement-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className="announcement-badge">NEW DROP</span>
        <span>
          Spring / Summer 2026 Collection Live — Use Code <strong style={{ color: '#fbbf24' }}>AURA50</strong> for 50% Flat Off!
        </span>
        {!currentUser && (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            style={{
              marginLeft: '8px',
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '20px',
              padding: '2px 10px',
              color: '#fbbf24',
              fontSize: '0.74rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Sign In / Register with OAuth ✨
          </button>
        )}
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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHelp={() => handleOpenHelp('track')}
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
        onOpenHelp={handleOpenHelp}
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
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
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
        savedUser={currentUser || savedUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Orders History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        onTrackOrder={(order) => {
          setIsOrdersOpen(false);
          handleOpenHelp('track');
        }}
        onReorder={(order) => {
          (order.items || []).forEach((item) => handleAddToCart(item));
          setIsOrdersOpen(false);
          setIsCartOpen(true);
          addToast(`Items from Order #${order.orderId} added to Bag!`, 'success');
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

      {/* OAuth Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile & Membership Modal */}
      <UserProfileModal
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Help & Support Center Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpInitialTab}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        onOpenOrders={() => {
          setIsHelpOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
