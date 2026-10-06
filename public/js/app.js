// ==========================================================================
// LuxeCart - Your Shopping Application
// Complete, Modern, Mobile-Friendly React E-Commerce Web Application
// ==========================================================================

const { useState, useEffect, useMemo, useRef } = React;

// Sample categories configuration with icons
const CATEGORIES = [
  { id: 'Shoes', name: 'Shoes', icon: 'fa-shoe-prints', count: 21 },
  { id: 'Bags', name: 'Bags', icon: 'fa-bag-shopping', count: 15 },
  { id: 'Women', name: 'Women', icon: 'fa-person-dress', count: 15 },
  { id: 'Men', name: 'Men', icon: 'fa-person', count: 15 },
  { id: 'Makeup', name: 'Makeup', icon: 'fa-wand-magic-sparkles', count: 15 },
  { id: 'Home Decor', name: 'Home Decor', icon: 'fa-couch', count: 15 },
  { id: 'Home Utilities', name: 'Home Utilities', icon: 'fa-blender', count: 15 },
  { id: 'Electronics', name: 'Electronics', icon: 'fa-headphones', count: 12 },
  { id: 'Accessories', name: 'Accessories', icon: 'fa-gem', count: 10 },
  { id: 'Beauty', name: 'Beauty', icon: 'fa-spa', count: 15 },
  { id: 'Fashion', name: 'Fashion', icon: 'fa-shirt', count: 30 }
];

// Fallback demo order history
const INITIAL_DEMO_ORDERS = [
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
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
    estimatedDelivery: "Arriving Tomorrow",
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
];

function App() {
  // 1. Viewport / Device frame mode ('mobile' or 'fluid')
  const [viewportMode, setViewportMode] = useState('mobile');

  // 2. Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // 3. Navigation & Screen state
  const [currentTab, setCurrentTab] = useState('home'); // home, search, orders, cart, account, category, product-detail, checkout, payment, wishlist
  const [screenHistory, setScreenHistory] = useState(['home']);

  // 4. Products & Database state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 5. Active selection states
  const [selectedCategory, setSelectedCategory] = useState('Shoes');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // 6. Search state
  const [searchQuery, setSearchQuery] = useState('');

  // 7. Cart & Wishlist state (persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('luxecart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('luxecart_wishlist');
      return saved ? JSON.parse(saved) : ['shoe-01', 'women-01', 'men-01', 'beauty-01'];
    } catch (e) {
      return ['shoe-01', 'women-01'];
    }
  });

  // 8. Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('luxecart_orders');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch (e) {
      return INITIAL_DEMO_ORDERS;
    }
  });

  // 9. Delivery Address form state
  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('luxecart_address');
      return saved ? JSON.parse(saved) : {
        name: 'Alex Johnson',
        doorNo: '402',
        houseNo: 'Block B, Skyline Heights',
        street: 'Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560034',
        mobile: '9876543210'
      };
    } catch (e) {
      return {
        name: '', doorNo: '', houseNo: '', street: '', city: '', state: '', pinCode: '', mobile: ''
      };
    }
  });
  const [addressErrors, setAddressErrors] = useState({});

  // 10. Payment state
  const [selectedPayment, setSelectedPayment] = useState('PhonePe');
  const [otherUpiId, setOtherUpiId] = useState('');

  // 11. Order Confirmation state
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 12. UI Toast & Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sorting and Filtering for Category page
  const [sortOption, setSortOption] = useState('default');
  const [priceFilter, setPriceFilter] = useState('all');
  const [minRatingFilter, setMinRatingFilter] = useState(0);

  // Direct buy item ref when user clicks "Buy Now" on product detail
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);

  // Show toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Persist cart, wishlist, orders, address
  useEffect(() => {
    try {
      localStorage.setItem('luxecart_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('luxecart_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('luxecart_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('luxecart_address', JSON.stringify(address));
    } catch (e) {}
  }, [address]);

  // Load products data on mount (instantaneous load with background sync)
  useEffect(() => {
    async function loadData() {
      // 1. Instantaneous load from embedded products if available
      if (window.EMBEDDED_PRODUCTS && window.EMBEDDED_PRODUCTS.length > 0) {
        setProducts(window.EMBEDDED_PRODUCTS);
        setLoadingProducts(false);
      }

      // 2. Try backend API for live dynamic data / MongoDB sync
      try {
        const apiRes = await fetch('/api/products');
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json.products && json.products.length > 0) {
            setProducts(json.products);
            setLoadingProducts(false);
            return;
          }
        }
      } catch (err) {
        // Backend offline or local file mode, already using embedded catalog
      }

      // 3. Fallback to static JSON file if embedded was not available
      if (!window.EMBEDDED_PRODUCTS || window.EMBEDDED_PRODUCTS.length === 0) {
        try {
          const staticRes = await fetch('data/products.json');
          if (staticRes.ok) {
            const staticData = await staticRes.json();
            setProducts(staticData);
          }
        } catch (e) {}
        setLoadingProducts(false);
      }
    }

    loadData();
  }, []);

  // Splash screen timer: Auto-transition to home after 2.3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  // Navigation handlers
  const navigateTo = (tabName) => {
    setScreenHistory((prev) => [...prev, tabName]);
    setCurrentTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentTab(prevScreen);
    } else {
      setCurrentTab('home');
    }
  };

  // Open Product Details Page
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedAngleIndex(0);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
    navigateTo('product-detail');
  };

  // Open Category Listing Page
  const openCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCat('');
    navigateTo('category');
  };

  // Wishlist toggle
  const toggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast('Removed from Wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to Wishlist ❤️');
    }
  };

  // Add to Cart handler
  const handleAddToCart = (product, size, color, qty = 1, e) => {
    if (e) e.stopPropagation();
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Standard';
    const chosenColor = color || (product.colors && product.colors[0]) || 'Default';

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (i) => i.productId === product.id && i.size === chosenSize && i.color === chosenColor
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            price: product.discountedPrice,
            originalPrice: product.originalPrice,
            discount: product.discount,
            size: chosenSize,
            color: chosenColor,
            quantity: qty
          }
        ];
      }
    });

    showToast(`Added ${product.name} to Cart 🛒`);
  };

  // Handle BUY NOW button (jumps directly to Address/Checkout)
  const handleBuyNow = (product, size, color) => {
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Standard';
    const chosenColor = color || (product.colors && product.colors[0]) || 'Default';

    const directItem = {
      cartItemId: `direct-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      price: product.discountedPrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      size: chosenSize,
      color: chosenColor,
      quantity: 1
    };

    setDirectCheckoutItem(directItem);
    navigateTo('checkout');
  };

  // Cart quantity controls
  const updateCartQty = (cartItemId, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeCartItem = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Item removed from Cart');
  };

  // Active items for checkout (either direct Buy Now item or entire Cart)
  const checkoutItems = useMemo(() => {
    if (directCheckoutItem) return [directCheckoutItem];
    return cart;
  }, [directCheckoutItem, cart]);

  // Pricing calculations
  const priceTotals = useMemo(() => {
    let totalMRP = 0;
    let totalFinal = 0;

    checkoutItems.forEach((item) => {
      const orig = item.originalPrice || item.price;
      totalMRP += orig * item.quantity;
      totalFinal += item.price * item.quantity;
    });

    const discountSavings = Math.max(0, totalMRP - totalFinal);
    const deliveryFee = totalFinal > 0 ? 0 : 0; // FREE Delivery offer

    return {
      totalMRP,
      discountSavings,
      deliveryFee,
      totalFinal
    };
  }, [checkoutItems]);

  // Address validation
  const validateAddressForm = () => {
    const errs = {};
    if (!address.name || !address.name.trim()) errs.name = 'Full name is required';
    if (!address.doorNo || !address.doorNo.trim()) errs.doorNo = 'Door number is required';
    if (!address.houseNo || !address.houseNo.trim()) errs.houseNo = 'House / Building is required';
    if (!address.street || !address.street.trim()) errs.street = 'Street or Area is required';
    if (!address.city || !address.city.trim()) errs.city = 'City is required';
    if (!address.state || !address.state.trim()) errs.state = 'State is required';

    if (!address.pinCode || !address.pinCode.trim()) {
      errs.pinCode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(address.pinCode.trim())) {
      errs.pinCode = 'PIN code must be exactly 6 digits';
    }

    if (!address.mobile || !address.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(address.mobile.replace(/\D/g, ''))) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit address and proceed to payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      navigateTo('payment');
    } else {
      showToast('Please fill all required address fields correctly');
    }
  };

  // Complete Order / Place Order
  const handlePlaceOrder = () => {
    if (checkoutItems.length === 0) {
      showToast('No items in order');
      return;
    }

    const orderId = `LXC-${Math.floor(100000 + Math.random() * 900000)}`;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estDeliveryStr = `Delivery by ${estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;

    const newOrder = {
      orderId,
      items: [...checkoutItems],
      totalAmount: priceTotals.totalFinal,
      discountAmount: priceTotals.discountSavings,
      deliveryCharge: 0,
      address: { ...address },
      paymentMethod: selectedPayment === 'Other UPI' ? `UPI (${otherUpiId || 'demo@upi'})` : selectedPayment,
      paymentStatus: selectedPayment === 'Cash on Delivery' ? 'Cash on Delivery' : 'Completed',
      orderStatus: 'Order Confirmed',
      estimatedDelivery: estDeliveryStr,
      orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // If bought from Cart, clear cart
    if (!directCheckoutItem) {
      setCart([]);
    }
    setDirectCheckoutItem(null);

    // Show Confirmation Modal
    setConfirmedOrder(newOrder);
    setShowConfirmModal(true);
  };

  // Live search filtering
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const queryTerms = searchQuery.trim().toLowerCase().split(/\s+/);

    return products.filter((p) => {
      const textToSearch = `${p.name} ${p.brand} ${p.category} ${p.subCategory || ''} ${p.description} ${(p.colors || []).join(' ')}`.toLowerCase();
      return queryTerms.every((term) => textToSearch.includes(term));
    });
  }, [searchQuery, products]);

  // Category page products with sorting & filtering
  const categoryProducts = useMemo(() => {
    let list = products.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (selectedSubCat) {
      list = list.filter((p) => p.subCategory && p.subCategory.toLowerCase().includes(selectedSubCat.toLowerCase()));
    }

    if (priceFilter === 'under2000') list = list.filter((p) => p.discountedPrice < 2000);
    else if (priceFilter === '2000to5000') list = list.filter((p) => p.discountedPrice >= 2000 && p.discountedPrice <= 5000);
    else if (priceFilter === 'above5000') list = list.filter((p) => p.discountedPrice > 5000);

    if (minRatingFilter > 0) list = list.filter((p) => p.rating >= minRatingFilter);

    if (sortOption === 'price-asc') list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortOption === 'price-desc') list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    else if (sortOption === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'discount') list.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    return list;
  }, [products, selectedCategory, selectedSubCat, priceFilter, minRatingFilter, sortOption]);

  // Grouped products for Home sections
  const womenSectionProducts = useMemo(() => products.filter((p) => p.category === 'Women'), [products]);
  const menSectionProducts = useMemo(() => products.filter((p) => p.category === 'Men'), [products]);
  const decorSectionProducts = useMemo(() => products.filter((p) => p.category === 'Home Decor'), [products]);
  const utilitySectionProducts = useMemo(() => products.filter((p) => p.category === 'Home Utilities'), [products]);
  const shoesSectionProducts = useMemo(() => products.filter((p) => p.category === 'Shoes'), [products]);
  const bagsSectionProducts = useMemo(() => products.filter((p) => p.category === 'Bags'), [products]);

  // Wishlist products array
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  return (
    <div className={`app-shell mode-${viewportMode}`} data-theme={darkMode ? 'dark' : 'light'}>
      {/* 1. Device Viewport Mode Switcher Bar */}
      <div className="viewport-control-bar">
        <div className="viewport-info">
          <i className="fa-solid fa-layer-group" style={{ color: '#2563eb' }}></i>
          <span>LuxeCart - Your Shopping Application</span>
          <span className="viewport-badge">PRO EDITION</span>
        </div>
        <div className="viewport-toggle-group">
          <button
            className={`viewport-toggle-btn ${viewportMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewportMode('mobile')}
            title="Switch to Mobile Smartphone Frame"
          >
            <i className="fa-solid fa-mobile-screen"></i> Mobile App View
          </button>
          <button
            className={`viewport-toggle-btn ${viewportMode === 'fluid' ? 'active' : ''}`}
            onClick={() => setViewportMode('fluid')}
            title="Switch to Fluid Responsive View"
          >
            <i className="fa-solid fa-desktop"></i> Full Screen
          </button>
        </div>
      </div>

      {/* Mobile Frame Island / Notch */}
      <div className="phone-island">
        <div className="phone-island-pill">
          <div className="island-camera"></div>
          <div className="island-speaker"></div>
        </div>
      </div>

      {/* 2. Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <div className="splash-logo-container">
              <div className="splash-glow-ring"></div>
              <div className="splash-icon-box">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
            </div>
            <h1 className="splash-app-brand">LuxeCart</h1>
            <p className="splash-app-subtitle">Your Shopping Application</p>
            <div className="splash-loader-bar">
              <div className="splash-loader-progress"></div>
            </div>
            <p className="splash-tagline">Loading curated collections...</p>
            <button className="splash-skip-btn" onClick={() => setShowSplash(false)}>
              Skip <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* 3. Sticky App Header */}
      <header className="app-header">
        <div className="header-top-row">
          <div
            className="brand-wrapper"
            onClick={() => {
              setCurrentTab('home');
              setScreenHistory(['home']);
            }}
          >
            <div className="brand-icon">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="brand-text-block">
              <span className="brand-name">LuxeCart</span>
              <span className="brand-sub">Your Shopping Application</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Notification Bell with Badge & Dropdown */}
            <button
              className="header-icon-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              title="Notifications"
            >
              <i className="fa-regular fa-bell"></i>
              <span className="icon-badge">2</span>
            </button>

            {/* Profile Avatar Quick Link */}
            <button
              className="header-icon-btn"
              onClick={() => navigateTo('account')}
              title="Account"
            >
              <i className="fa-regular fa-user"></i>
            </button>
          </div>
        </div>

        {/* Header Search Bar with Instant Trigger */}
        <div className="search-bar-wrapper">
          <div
            className="search-input-container"
            onClick={() => {
              if (currentTab !== 'search') navigateTo('search');
            }}
          >
            <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
            <input
              type="text"
              className="search-input-field"
              placeholder="Search Shoes, Bags, Dresses, Makeup, Decor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== 'search') setCurrentTab('search');
              }}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Panel Dropdown */}
        {showNotifDropdown && (
          <div className="notifications-panel">
            <div className="notif-header">
              <span>Notifications (2)</span>
              <span
                style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }}
                onClick={() => setShowNotifDropdown(false)}
              >
                Close
              </span>
            </div>
            <div className="notif-item">
              <i className="fa-solid fa-tag notif-icon"></i>
              <div>
                <strong>Festive Flash Sale!</strong>
                <p style={{ color: '#64748b' }}>Flat 50% OFF across Shoes and Women's wear today.</p>
              </div>
            </div>
            <div className="notif-item">
              <i className="fa-solid fa-truck-fast notif-icon"></i>
              <div>
                <strong>Order Dispatched</strong>
                <p style={{ color: '#64748b' }}>Order #LXC-81723 has been shipped and arrives tomorrow.</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 4. MAIN SCREENS SWITCHER */}

      {/* ==================== A. HOME PAGE ==================== */}
      {currentTab === 'home' && (
        <main className="home-screen">
          {/* Horizontally Scrollable Categories Bar */}
          <nav className="categories-bar" aria-label="Shopping Categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="category-chip"
                onClick={() => openCategory(cat.id)}
              >
                <div className="category-icon-circle">
                  <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <span className="category-label">{cat.name}</span>
              </button>
            ))}
          </nav>

          {/* Promotional Hero Banner Carousel */}
          <div className="promo-banner-container">
            <div className="promo-card">
              <div>
                <span className="promo-badge">Festive Grand Sale</span>
                <h2 className="promo-title">Up to 60% OFF<br />Top Designer Brands</h2>
                <p className="promo-desc">Sneakers, Dresses, Luxe Makeup & Decor</p>
                <button className="promo-btn" onClick={() => openCategory('Shoes')}>
                  Shop Now <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
              <div className="promo-visual">
                <i className="fa-solid fa-bag-shopping" style={{ color: '#fbbf24' }}></i>
              </div>
            </div>
          </div>

          {/* SECTION 1: Trending Shoes & Sneakers */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot"></span>
                <h3 className="section-title">Trending Shoes & Sneakers</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Shoes')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="horizontal-scroll-list">
              {shoesSectionProducts.slice(0, 10).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 2: Women Collection */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#ec4899' }}></span>
                <h3 className="section-title">Women's Fashion & Dresses</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Women')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="subcategories-strip">
              {['Dresses', 'Tops', 'Jeans', 'Ethnic', 'Jackets'].map((sub) => (
                <button
                  key={sub}
                  className="subcat-pill"
                  onClick={() => {
                    setSelectedCategory('Women');
                    setSelectedSubCat(sub);
                    navigateTo('category');
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="horizontal-scroll-list">
              {womenSectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 3: Men Collection */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#3b82f6' }}></span>
                <h3 className="section-title">Men's Wardrobe & Watches</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Men')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="subcategories-strip">
              {['Shirts', 'T-shirts', 'Jeans', 'Trousers', 'Watches'].map((sub) => (
                <button
                  key={sub}
                  className="subcat-pill"
                  onClick={() => {
                    setSelectedCategory('Men');
                    setSelectedSubCat(sub);
                    navigateTo('category');
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="horizontal-scroll-list">
              {menSectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 4: Bags & Luggage */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#f59e0b' }}></span>
                <h3 className="section-title">Handbags, Backpacks & Luggage</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Bags')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="horizontal-scroll-list">
              {bagsSectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 5: Makeup & Beauty */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#d946ef' }}></span>
                <h3 className="section-title">Makeup & Radiant Beauty</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Makeup')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="horizontal-scroll-list">
              {products
                .filter((p) => p.category === 'Makeup')
                .map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={toggleWishlist}
                    onClick={() => openProductDetails(prod)}
                    onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                  />
                ))}
            </div>
          </section>

          {/* SECTION 6: Home Decor */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#10b981' }}></span>
                <h3 className="section-title">Home Decor & Lamps</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Home Decor')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="subcategories-strip">
              {['Wall decorations', 'Lamps', 'Curtains', 'Cushions', 'Decorative items'].map((sub) => (
                <button
                  key={sub}
                  className="subcat-pill"
                  onClick={() => {
                    setSelectedCategory('Home Decor');
                    setSelectedSubCat(sub);
                    navigateTo('category');
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="horizontal-scroll-list">
              {decorSectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>

          {/* SECTION 7: Home Utilities & Kitchen */}
          <section className="home-section" style={{ marginBottom: '80px' }}>
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag-dot" style={{ background: '#0284c7' }}></span>
                <h3 className="section-title">Home Utilities & Kitchen</h3>
              </div>
              <button className="section-view-all-btn" onClick={() => openCategory('Home Utilities')}>
                View All <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="subcategories-strip">
              {['Kitchen products', 'Storage products', 'Cleaning products'].map((sub) => (
                <button
                  key={sub}
                  className="subcat-pill"
                  onClick={() => {
                    setSelectedCategory('Home Utilities');
                    setSelectedSubCat(sub);
                    navigateTo('category');
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="horizontal-scroll-list">
              {utilitySectionProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ==================== B. SEARCH PAGE ==================== */}
      {currentTab === 'search' && (
        <main className="search-page-container">
          <div className="search-header-box">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Search Catalog
            </h2>
            <div className="search-suggestions-strip">
              {['Running Shoes', 'Sneakers', 'Black Dress', 'Lipstick', 'Curtains', 'Cookware', 'Leather Bag'].map(
                (term) => (
                  <button
                    key={term}
                    className="suggestion-chip"
                    onClick={() => setSearchQuery(term)}
                  >
                    <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '5px', fontSize: '0.7rem' }}></i>
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {searchQuery.trim() ? (
            <div>
              <div className="search-results-info">
                <span>
                  Found <strong>{filteredSearchResults.length}</strong> items matching "{searchQuery}"
                </span>
              </div>
              {filteredSearchResults.length > 0 ? (
                <div className="search-results-grid">
                  {filteredSearchResults.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      isWishlisted={wishlist.includes(prod.id)}
                      onToggleWishlist={toggleWishlist}
                      onClick={() => openProductDetails(prod)}
                      onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <h3 className="empty-title">No matching products found</h3>
                  <p className="empty-text">Try searching for "Shoes", "Bag", "Dress", "Serum", or "Lamp"</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b', marginBottom: '12px' }}>
                Browse by Category
              </h4>
              <div className="search-results-grid">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="payment-option-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openCategory(cat.id)}
                  >
                    <div className="option-left">
                      <div className="option-icon-box">
                        <i className={`fa-solid ${cat.icon}`} style={{ color: '#2563eb' }}></i>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.88rem' }}>{cat.name}</strong>
                        <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{cat.count} items</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ==================== C. PRODUCT LISTING PAGE ==================== */}
      {currentTab === 'category' && (
        <main className="listing-page-container">
          <div className="listing-top-bar">
            <div className="listing-title-group">
              <button
                onClick={navigateBack}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginRight: '6px' }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2 className="listing-title">{selectedCategory}</h2>
              <span className="listing-count">({categoryProducts.length} items)</span>
            </div>

            <div className="listing-controls">
              {/* Sorting Dropdown */}
              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Filter Chips Drawer */}
          <div className="filter-drawer">
            <div className="filter-group">
              <span className="filter-label">Price Range</span>
              <div className="filter-chips">
                <button
                  className={`filter-chip ${priceFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-chip ${priceFilter === 'under2000' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('under2000')}
                >
                  Under ₹2,000
                </button>
                <button
                  className={`filter-chip ${priceFilter === '2000to5000' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('2000to5000')}
                >
                  ₹2,000 - ₹5,000
                </button>
                <button
                  className={`filter-chip ${priceFilter === 'above5000' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('above5000')}
                >
                  Above ₹5,000
                </button>
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Customer Rating</span>
              <div className="filter-chips">
                <button
                  className={`filter-chip ${minRatingFilter === 0 ? 'active' : ''}`}
                  onClick={() => setMinRatingFilter(0)}
                >
                  Any
                </button>
                <button
                  className={`filter-chip ${minRatingFilter === 4 ? 'active' : ''}`}
                  onClick={() => setMinRatingFilter(4)}
                >
                  4★ & above
                </button>
                <button
                  className={`filter-chip ${minRatingFilter === 4.5 ? 'active' : ''}`}
                  onClick={() => setMinRatingFilter(4.5)}
                >
                  4.5★ & above
                </button>
              </div>
            </div>
          </div>

          {/* Continuous Scrollable Products Grid */}
          {categoryProducts.length > 0 ? (
            <div className="product-grid" style={{ marginBottom: '80px' }}>
              {categoryProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa-solid fa-filter-circle-xmark"></i>
              </div>
              <h3 className="empty-title">No products match these filters</h3>
              <button
                className="promo-btn"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setPriceFilter('all');
                  setMinRatingFilter(0);
                  setSortOption('default');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      )}

      {/* ==================== D. PRODUCT DETAILS PAGE ==================== */}
      {currentTab === 'product-detail' && selectedProduct && (
        <main className="product-detail-page">
          {/* Top Bar */}
          <div className="detail-nav-bar">
            <button className="detail-back-btn" onClick={navigateBack}>
              <i className="fa-solid fa-arrow-left"></i>
              <span style={{ fontSize: '0.9rem' }}>Back</span>
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="header-icon-btn"
                onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                style={{ color: wishlist.includes(selectedProduct.id) ? '#ef4444' : '#64748b' }}
              >
                <i className={`${wishlist.includes(selectedProduct.id) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
              </button>
              <button className="header-icon-btn" onClick={() => navigateTo('cart')}>
                <i className="fa-solid fa-cart-shopping"></i>
                {cart.length > 0 && <span className="icon-badge">{cart.length}</span>}
              </button>
            </div>
          </div>

          {/* Multiple Product Images Gallery (Angle Views: Front, Side, Back, Top, Detail) */}
          <div className="gallery-section">
            <div className="gallery-main-frame">
              <img
                src={selectedProduct.images[selectedAngleIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="gallery-main-img"
              />
              <span className="gallery-angle-badge">
                {selectedProduct.category === 'Shoes'
                  ? ['Front View', 'Side View', 'Back View', 'Top View', 'Detail View'][selectedAngleIndex] || 'Product Angle'
                  : `Photo ${selectedAngleIndex + 1} of ${selectedProduct.images.length}`}
              </span>
            </div>

            {/* Angle Thumbnails Carousel */}
            <div className="angle-thumbnails-row">
              {selectedProduct.images.map((imgUrl, idx) => {
                const angleNames = ['Front', 'Side', 'Back', 'Top', 'Detail'];
                const angleName = selectedProduct.category === 'Shoes' ? angleNames[idx] || `View ${idx + 1}` : `View ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    className={`angle-thumb-btn ${selectedAngleIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedAngleIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="angle-thumb-img" />
                    <span className="angle-label-tag">{angleName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Info Block */}
          <div className="detail-info-container">
            <div className="detail-brand-row">
              <span className="detail-brand">{selectedProduct.brand}</span>
              {selectedProduct.offerLabel && (
                <span className="detail-offer-badge">{selectedProduct.offerLabel}</span>
              )}
            </div>

            <h1 className="detail-title">{selectedProduct.name}</h1>

            {/* Star Rating Card */}
            <div className="detail-rating-card">
              <div className="stars-row">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <span className="rating-val">{selectedProduct.rating} / 5</span>
              <span className="rating-total-reviews">({selectedProduct.reviewsCount.toLocaleString()} reviews)</span>
            </div>

            {/* Clear Price Section with Crossed Out Original Price */}
            <div className="detail-price-box">
              <div className="price-main-row">
                <span className="detail-current-price">₹{selectedProduct.discountedPrice.toLocaleString()}</span>
                <span className="detail-original-price">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                <span className="detail-discount-pill">{selectedProduct.discount}% OFF</span>
              </div>
              <div className="delivery-info-row">
                <i className="fa-solid fa-truck-fast" style={{ color: '#10b981' }}></i>
                <span>
                  <strong>FREE Delivery</strong> by Friday &bull; 7 Days Replacement Policy
                </span>
              </div>
            </div>

            {/* Size Selection */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div>
                <div className="detail-section-title">
                  <span>Select Size ({selectedProduct.category === 'Shoes' ? 'UK/India' : 'Standard'})</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }}>
                    <i className="fa-solid fa-ruler-combined" style={{ marginRight: '4px' }}></i>Size Guide
                  </span>
                </div>
                <div className="size-chips-row">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      className={`size-chip-btn ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div>
                <div className="detail-section-title">
                  <span>Available Colors</span>
                </div>
                <div className="color-chips-row">
                  {selectedProduct.colors.map((clr) => (
                    <button
                      key={clr}
                      className={`color-chip-btn ${selectedColor === clr ? 'active' : ''}`}
                      onClick={() => setSelectedColor(clr)}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications & Material */}
            <div className="detail-section-title">
              <span>Product Specifications</span>
            </div>
            <table className="detail-specs-table">
              <tbody>
                <tr>
                  <td>Material</td>
                  <td>{selectedProduct.material || 'Premium Tested Fabric'}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{selectedProduct.category} ({selectedProduct.subCategory || 'General'})</td>
                </tr>
                <tr>
                  <td>Stock Status</td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>{selectedProduct.stockStatus || 'In Stock'}</td>
                </tr>
                <tr>
                  <td>Warranty</td>
                  <td>6 Months Brand Assurance Guarantee</td>
                </tr>
              </tbody>
            </table>

            {/* Product Description */}
            <div className="detail-section-title">
              <span>About this Product</span>
            </div>
            <p className="detail-desc-box">{selectedProduct.description}</p>
          </div>

          {/* FIXED BOTTOM ACTION BAR: ADD TO CART & BUY NOW (Golden Yellow Highlight) */}
          <div className="product-bottom-bar">
            <button
              className="btn-add-cart"
              onClick={() => handleAddToCart(selectedProduct, selectedSize, selectedColor, 1)}
            >
              <i className="fa-solid fa-cart-plus"></i> ADD TO CART
            </button>
            <button
              className="btn-buy-now"
              onClick={() => handleBuyNow(selectedProduct, selectedSize, selectedColor)}
            >
              <i className="fa-solid fa-bolt"></i> BUY NOW
            </button>
          </div>
        </main>
      )}

      {/* ==================== E. CART PAGE ==================== */}
      {currentTab === 'cart' && (
        <main className="cart-page-container">
          <div className="cart-header">
            <h2 className="cart-title">Shopping Cart</h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cart.length > 0 ? (
            <div>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <span className="cart-item-brand">{item.brand}</span>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-variant">
                        Size: <strong>{item.size}</strong> &bull; Color: <strong>{item.color}</strong>
                      </span>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="price-original">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper Controls */}
                      <div className="cart-qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQty(item.cartItemId, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQty(item.cartItemId, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeCartItem(item.cartItemId)}
                      title="Remove item"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Breakdown Bill Summary */}
              <div className="bill-summary-card">
                <h4 className="bill-title">Price Breakdown</h4>
                <div className="bill-row">
                  <span>Total MRP</span>
                  <span>₹{priceTotals.totalMRP.toLocaleString()}</span>
                </div>
                <div className="bill-row savings">
                  <span>Discount Savings</span>
                  <span>- ₹{priceTotals.discountSavings.toLocaleString()}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Charge</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                </div>
                <div className="bill-row total">
                  <span>Final Amount</span>
                  <span>₹{priceTotals.totalFinal.toLocaleString()}</span>
                </div>
              </div>

              {/* Proceed to Buy Button */}
              <button
                className="btn-proceed-buy"
                onClick={() => {
                  setDirectCheckoutItem(null);
                  navigateTo('checkout');
                }}
              >
                PROCEED TO BUY ({cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'})
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <h3 className="empty-title">Your Cart is Empty</h3>
              <p className="empty-text">Looks like you haven't added anything to your cart yet.</p>
              <button className="promo-btn" onClick={() => navigateTo('home')}>
                Start Shopping Now
              </button>
            </div>
          )}
        </main>
      )}

      {/* ==================== F. CHECKOUT / ADDRESS PAGE ==================== */}
      {currentTab === 'checkout' && (
        <main className="checkout-page-container">
          <div className="checkout-header">
            <button className="detail-back-btn" onClick={navigateBack} style={{ marginBottom: '8px' }}>
              <i className="fa-solid fa-arrow-left"></i>
              <span style={{ fontSize: '0.9rem' }}>Back</span>
            </button>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              Delivery Address
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Please enter your shipping address details to proceed.
            </p>
          </div>

          <form className="address-form-box" onSubmit={handleProceedToPayment}>
            {/* Your Name */}
            <div className="form-group">
              <label className="form-label">
                Your Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${addressErrors.name ? 'error' : ''}`}
                placeholder="e.g. Alex Johnson"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
              />
              {addressErrors.name && <p className="form-error-msg">{addressErrors.name}</p>}
            </div>

            {/* Door Number & House Number */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Door Number <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${addressErrors.doorNo ? 'error' : ''}`}
                  placeholder="e.g. 402"
                  value={address.doorNo}
                  onChange={(e) => setAddress({ ...address, doorNo: e.target.value })}
                />
                {addressErrors.doorNo && <p className="form-error-msg">{addressErrors.doorNo}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  House / Apt Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${addressErrors.houseNo ? 'error' : ''}`}
                  placeholder="e.g. Skyline Heights"
                  value={address.houseNo}
                  onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                />
                {addressErrors.houseNo && <p className="form-error-msg">{addressErrors.houseNo}</p>}
              </div>
            </div>

            {/* Street / Area */}
            <div className="form-group">
              <label className="form-label">
                Street / Area <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${addressErrors.street ? 'error' : ''}`}
                placeholder="e.g. Koramangala 4th Block, 80 Feet Road"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              {addressErrors.street && <p className="form-error-msg">{addressErrors.street}</p>}
            </div>

            {/* City & State */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  City <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${addressErrors.city ? 'error' : ''}`}
                  placeholder="e.g. Bengaluru"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                {addressErrors.city && <p className="form-error-msg">{addressErrors.city}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  State <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${addressErrors.state ? 'error' : ''}`}
                  placeholder="e.g. Karnataka"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                {addressErrors.state && <p className="form-error-msg">{addressErrors.state}</p>}
              </div>
            </div>

            {/* PIN Code & Mobile Number */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  PIN Code <span className="req">*</span>
                </label>
                <input
                  type="text"
                  maxLength="6"
                  className={`form-input ${addressErrors.pinCode ? 'error' : ''}`}
                  placeholder="e.g. 560034"
                  value={address.pinCode}
                  onChange={(e) => setAddress({ ...address, pinCode: e.target.value.replace(/\D/g, '') })}
                />
                {addressErrors.pinCode && <p className="form-error-msg">{addressErrors.pinCode}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mobile Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  maxLength="10"
                  className={`form-input ${addressErrors.mobile ? 'error' : ''}`}
                  placeholder="10-digit number"
                  value={address.mobile}
                  onChange={(e) => setAddress({ ...address, mobile: e.target.value.replace(/\D/g, '') })}
                />
                {addressErrors.mobile && <p className="form-error-msg">{addressErrors.mobile}</p>}
              </div>
            </div>

            <button type="submit" className="btn-continue-payment">
              CONTINUE TO PAYMENT <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        </main>
      )}

      {/* ==================== G. PAYMENT PAGE ==================== */}
      {currentTab === 'payment' && (
        <main className="payment-page-container">
          <div className="checkout-header">
            <button className="detail-back-btn" onClick={navigateBack} style={{ marginBottom: '8px' }}>
              <i className="fa-solid fa-arrow-left"></i>
              <span style={{ fontSize: '0.9rem' }}>Back</span>
            </button>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
              Payment
            </h2>
          </div>

          {/* Demo Sandbox Alert Notice */}
          <div className="demo-payment-alert">
            <i className="fa-solid fa-circle-info" style={{ fontSize: '1.1rem' }}></i>
            <span>
              <strong>Demo Payment Gateway:</strong> This is a simulated checkout flow for your project demonstration. No real money will be charged.
            </span>
          </div>

          <h4 className="payment-section-title">UPI Options</h4>
          <div className="payment-options-list">
            {/* PhonePe */}
            <div
              className={`payment-option-card ${selectedPayment === 'PhonePe' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('PhonePe')}
            >
              <div className="option-left">
                <div className="option-icon-box" style={{ color: '#5f259f' }}>
                  <i className="fa-solid fa-mobile-retro"></i>
                </div>
                <div className="option-info">
                  <span className="option-name">PhonePe</span>
                  <span className="option-sub">Pay instantly using PhonePe UPI</span>
                </div>
              </div>
              <div className="radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
            </div>

            {/* Google Pay */}
            <div
              className={`payment-option-card ${selectedPayment === 'Google Pay' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('Google Pay')}
            >
              <div className="option-left">
                <div className="option-icon-box" style={{ color: '#4285f4' }}>
                  <i className="fa-brands fa-google-pay" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div className="option-info">
                  <span className="option-name">Google Pay</span>
                  <span className="option-sub">Fast & secure GPay UPI transfer</span>
                </div>
              </div>
              <div className="radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
            </div>

            {/* Paytm */}
            <div
              className={`payment-option-card ${selectedPayment === 'Paytm' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('Paytm')}
            >
              <div className="option-left">
                <div className="option-icon-box" style={{ color: '#00baf2' }}>
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <div className="option-info">
                  <span className="option-name">Paytm</span>
                  <span className="option-sub">Paytm Wallet or UPI</span>
                </div>
              </div>
              <div className="radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
            </div>

            {/* Other UPI */}
            <div
              className={`payment-option-card ${selectedPayment === 'Other UPI' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('Other UPI')}
            >
              <div className="option-left">
                <div className="option-icon-box" style={{ color: '#2563eb' }}>
                  <i className="fa-solid fa-at"></i>
                </div>
                <div className="option-info">
                  <span className="option-name">Other UPI</span>
                  <span className="option-sub">Enter any valid UPI ID (e.g. user@oksbi)</span>
                </div>
              </div>
              <div className="radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
            </div>

            {selectedPayment === 'Other UPI' && (
              <div style={{ padding: '0 4px', marginTop: '-4px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter UPI ID (e.g. mobile@upi)"
                  value={otherUpiId}
                  onChange={(e) => setOtherUpiId(e.target.value)}
                />
              </div>
            )}
          </div>

          <h4 className="payment-section-title">Other Payment Option</h4>
          <div className="payment-options-list">
            <div
              className={`payment-option-card ${selectedPayment === 'Cash on Delivery' ? 'selected' : ''}`}
              onClick={() => setSelectedPayment('Cash on Delivery')}
            >
              <div className="option-left">
                <div className="option-icon-box" style={{ color: '#16a34a' }}>
                  <i className="fa-solid fa-money-bill-wave"></i>
                </div>
                <div className="option-info">
                  <span className="option-name">Cash on Delivery</span>
                  <span className="option-sub">Pay with cash when package arrives</span>
                </div>
              </div>
              <div className="radio-indicator">
                <div className="radio-inner-dot"></div>
              </div>
            </div>
          </div>

          {/* Price Summary Recap */}
          <div className="bill-summary-card">
            <h4 className="bill-title">Order Amount Recap</h4>
            <div className="bill-row">
              <span>Product Amount</span>
              <span>₹{priceTotals.totalMRP.toLocaleString()}</span>
            </div>
            <div className="bill-row savings">
              <span>Discount</span>
              <span>- ₹{priceTotals.discountSavings.toLocaleString()}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Charge</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>
            <div className="bill-row total">
              <span>Final Payable Amount</span>
              <span style={{ color: '#0f172a' }}>₹{priceTotals.totalFinal.toLocaleString()}</span>
            </div>
          </div>

          {/* Bottom BUY NOW Action */}
          <button className="btn-proceed-buy" onClick={handlePlaceOrder}>
            <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>
            BUY NOW &bull; ₹{priceTotals.totalFinal.toLocaleString()}
          </button>
        </main>
      )}

      {/* ==================== H. ORDERS PAGE ==================== */}
      {currentTab === 'orders' && (
        <main className="orders-page-container">
          <h2 className="orders-title">My Orders ({orders.length})</h2>

          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((ord) => {
                const firstItem = ord.items[0] || {};
                const statusClass =
                  ord.orderStatus === 'Delivered'
                    ? 'status-delivered'
                    : ord.orderStatus === 'Shipped'
                    ? 'status-shipped'
                    : ord.orderStatus === 'Out for Delivery'
                    ? 'status-out'
                    : 'status-confirmed';

                return (
                  <div key={ord.orderId} className="order-history-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-id-badge">#{ord.orderId}</span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Ordered on {ord.orderDate}</div>
                      </div>
                      <span className={`order-status-pill ${statusClass}`}>{ord.orderStatus}</span>
                    </div>

                    <div className="order-items-preview">
                      <img src={firstItem.image} alt={firstItem.name} className="order-thumb-img" />
                      <div className="order-info-text">
                        <strong style={{ display: 'block', marginBottom: '2px' }}>{firstItem.name}</strong>
                        {ord.items.length > 1 && (
                          <span style={{ color: '#2563eb', fontSize: '0.74rem' }}>
                            + {ord.items.length - 1} more item(s)
                          </span>
                        )}
                        <div style={{ color: '#64748b', marginTop: '4px' }}>
                          Paid: <strong>₹{ord.totalAmount.toLocaleString()}</strong> via {ord.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Order Progress Tracker */}
                    <div className="order-tracking-stepper">
                      <div className={`step-node ${['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(ord.orderStatus) ? 'completed' : ''}`}>
                        <div className="step-dot"><i className="fa-solid fa-check"></i></div>
                        <span className="step-title">Placed</span>
                      </div>
                      <div className={`step-node ${['Shipped', 'Out for Delivery', 'Delivered'].includes(ord.orderStatus) ? 'completed' : ''}`}>
                        <div className="step-dot"><i className="fa-solid fa-box"></i></div>
                        <span className="step-title">Shipped</span>
                      </div>
                      <div className={`step-node ${['Out for Delivery', 'Delivered'].includes(ord.orderStatus) ? 'completed' : ''}`}>
                        <div className="step-dot"><i className="fa-solid fa-truck"></i></div>
                        <span className="step-title">Out for Delivery</span>
                      </div>
                      <div className={`step-node ${ord.orderStatus === 'Delivered' ? 'completed' : ''}`}>
                        <div className="step-dot"><i className="fa-solid fa-house"></i></div>
                        <span className="step-title">Delivered</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '8px' }}>
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '5px' }}></i>
                      {ord.estimatedDelivery}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h3 className="empty-title">No orders yet</h3>
              <p className="empty-text">Once you place an order, you can track delivery progress here.</p>
              <button className="promo-btn" onClick={() => navigateTo('home')}>
                Start Shopping
              </button>
            </div>
          )}
        </main>
      )}

      {/* ==================== I. ACCOUNT PAGE ==================== */}
      {currentTab === 'account' && (
        <main className="account-page-container">
          {/* User Profile Header */}
          <div className="user-profile-header">
            <div className="user-avatar-large">
              {address.name ? address.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h2 className="user-meta-name">{address.name || 'Alex Johnson'}</h2>
              <div className="user-meta-contact">
                <i className="fa-solid fa-phone" style={{ marginRight: '6px' }}></i>
                {address.mobile || '+91 98765 43210'}
              </div>
              <div className="user-meta-contact">
                <i className="fa-solid fa-envelope" style={{ marginRight: '6px' }}></i>
                alex.johnson@example.com
              </div>
            </div>
          </div>

          {/* Saved Delivery Address Card */}
          <div className="account-menu-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', marginRight: '6px' }}></i>
                Saved Delivery Address
              </strong>
              <button
                onClick={() => navigateTo('checkout')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
              {address.doorNo}, {address.houseNo}, {address.street}, {address.city}, {address.state} - {address.pinCode}
            </p>
          </div>

          {/* Quick Links Menu */}
          <div className="account-menu-card">
            <div className="account-menu-item" onClick={() => navigateTo('orders')}>
              <div className="menu-item-left">
                <div className="menu-item-icon"><i className="fa-solid fa-box-open"></i></div>
                <span>My Orders</span>
              </div>
              <span className="icon-badge" style={{ position: 'static' }}>{orders.length}</span>
            </div>

            <div className="account-menu-item" onClick={() => navigateTo('cart')}>
              <div className="menu-item-left">
                <div className="menu-item-icon"><i className="fa-solid fa-cart-shopping"></i></div>
                <span>My Cart</span>
              </div>
              <span className="icon-badge" style={{ position: 'static' }}>{cart.length}</span>
            </div>

            <div className="account-menu-item" onClick={() => navigateTo('wishlist')}>
              <div className="menu-item-left">
                <div className="menu-item-icon" style={{ color: '#ef4444' }}><i className="fa-solid fa-heart"></i></div>
                <span>My Wishlist</span>
              </div>
              <span className="icon-badge" style={{ position: 'static' }}>{wishlist.length}</span>
            </div>

            <div
              className="account-menu-item"
              onClick={() => {
                setDarkMode(!darkMode);
                showToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
              }}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon">
                  <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </div>
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <i className="fa-solid fa-toggle-on" style={{ color: darkMode ? '#2563eb' : '#94a3b8', fontSize: '1.3rem' }}></i>
            </div>

            <div
              className="account-menu-item"
              onClick={() => {
                alert('Support Hotline: 1800-123-LUXE\nEmail: support@luxecart-demo.com\n24/7 Shopping Assistant Active');
              }}
            >
              <div className="menu-item-left">
                <div className="menu-item-icon"><i className="fa-solid fa-headset"></i></div>
                <span>Help & Customer Support</span>
              </div>
              <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
            </div>
          </div>
        </main>
      )}

      {/* ==================== J. WISHLIST VIEW ==================== */}
      {currentTab === 'wishlist' && (
        <main className="wishlist-page-container">
          <div className="listing-top-bar">
            <div className="listing-title-group">
              <button
                onClick={navigateBack}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginRight: '6px' }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2 className="listing-title">My Wishlist</h2>
              <span className="listing-count">({wishlistProducts.length} items)</span>
            </div>
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="product-grid" style={{ marginBottom: '80px' }}>
              {wishlistProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={true}
                  onToggleWishlist={toggleWishlist}
                  onClick={() => openProductDetails(prod)}
                  onAddToCart={(e) => handleAddToCart(prod, null, null, 1, e)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon" style={{ color: '#f43f5e' }}>
                <i className="fa-regular fa-heart"></i>
              </div>
              <h3 className="empty-title">Your Wishlist is Empty</h3>
              <p className="empty-text">Tap the heart icon on any product to save it for later.</p>
              <button className="promo-btn" onClick={() => navigateTo('home')}>
                Discover Products
              </button>
            </div>
          )}
        </main>
      )}

      {/* ==================== 5. ORDER CONFIRMATION MODAL ==================== */}
      {showConfirmModal && confirmedOrder && (
        <div className="order-confirm-overlay">
          <div className="confirm-modal-card">
            {/* Circular Checkmark SVG Animation */}
            <div className="success-checkmark-wrapper">
              <svg viewBox="0 0 52 52" style={{ width: '100%', height: '100%' }}>
                <circle className="checkmark-circle" cx="26" cy="26" r="24" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>

            <h2 className="confirm-title">Your Order is Confirmed!</h2>
            <p className="confirm-sub">Your address has been confirmed.</p>

            <div className="confirm-order-details-box">
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Order ID:</span>
                <span className="confirm-detail-val">#{confirmedOrder.orderId}</span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Products:</span>
                <span className="confirm-detail-val">
                  {confirmedOrder.items.map((i) => i.name).join(', ').substring(0, 32)}...
                </span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Total Amount:</span>
                <span className="confirm-detail-val" style={{ color: '#0f172a', fontWeight: 800 }}>
                  ₹{confirmedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Payment Method:</span>
                <span className="confirm-detail-val">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Delivery Address:</span>
                <span className="confirm-detail-val" style={{ textAlign: 'right', maxWidth: '60%' }}>
                  {confirmedOrder.address.doorNo}, {confirmedOrder.address.street}, {confirmedOrder.address.city}
                </span>
              </div>
              <div className="confirm-detail-row">
                <span className="confirm-detail-label">Est. Delivery:</span>
                <span className="confirm-detail-val" style={{ color: '#10b981' }}>
                  {confirmedOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            <button
              className="btn-continue-shopping"
              onClick={() => {
                setShowConfirmModal(false);
                setCurrentTab('home');
                setScreenHistory(['home']);
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}

      {/* ==================== 6. FIXED BOTTOM NAVIGATION BAR ==================== */}
      {/* Exactly: Home | Search | Orders | Cart | Account */}
      <nav className="bottom-navbar" aria-label="Bottom Navigation">
        <button
          className={`nav-tab-btn ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('home');
            setScreenHistory(['home']);
          }}
        >
          <div className="nav-tab-icon">
            <i className={`fa-solid ${currentTab === 'home' ? 'fa-house' : 'fa-house-chimney'}`}></i>
          </div>
          <span className="nav-tab-label">Home</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'search' ? 'active' : ''}`}
          onClick={() => navigateTo('search')}
        >
          <div className="nav-tab-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <span className="nav-tab-label">Search</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => navigateTo('orders')}
        >
          <div className="nav-tab-icon">
            <i className="fa-solid fa-box"></i>
            {orders.length > 0 && <span className="nav-badge-count">{orders.length}</span>}
          </div>
          <span className="nav-tab-label">Orders</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'cart' ? 'active' : ''}`}
          onClick={() => navigateTo('cart')}
        >
          <div className="nav-tab-icon">
            <i className="fa-solid fa-cart-shopping"></i>
            {cart.length > 0 && <span className="nav-badge-count">{cart.length}</span>}
          </div>
          <span className="nav-tab-label">Cart</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'account' ? 'active' : ''}`}
          onClick={() => navigateTo('account')}
        >
          <div className="nav-tab-icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <span className="nav-tab-label">Account</span>
        </button>
      </nav>

      {/* Toast Feedback Popup */}
      {toastMessage && (
        <div className="app-toast">
          <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// Reusable Product Card Component
// ==========================================================================
function ProductCard({ product, isWishlisted, onToggleWishlist, onClick, onAddToCart }) {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="card-image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="card-img"
          loading="lazy"
        />
        {product.offerLabel && (
          <span className="card-offer-badge">{product.offerLabel}</span>
        )}
        <button
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => onToggleWishlist(product.id, e)}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>

      <div className="card-content">
        <span className="card-brand">{product.brand}</span>
        <h4 className="card-title" title={product.name}>{product.name}</h4>

        <div className="card-rating-row">
          <span className="rating-pill">
            <i className="fa-solid fa-star" style={{ fontSize: '0.65rem' }}></i> {product.rating}
          </span>
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        <div className="card-price-row">
          <span className="price-current">₹{product.discountedPrice.toLocaleString()}</span>
          <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
          <span className="price-discount-tag">{product.discount}% OFF</span>
        </div>

        <button className="card-add-btn" onClick={onAddToCart}>
          <i className="fa-solid fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  );
}

// Mount the React Application
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
