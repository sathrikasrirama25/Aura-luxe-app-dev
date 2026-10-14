import React, { useRef, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Package, Sparkles, X, HelpCircle, User, LogIn } from 'lucide-react';
import gsap from 'gsap';

export default function Header({
  brandName = 'AURALUXE',
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenBrandIdeas,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenHelp
}) {
  const cartBadgeRef = useRef(null);
  const prevCartCountRef = useRef(cartCount);

  // GSAP badge bounce when cart updates
  useEffect(() => {
    if (cartBadgeRef.current && cartCount !== prevCartCountRef.current) {
      gsap.fromTo(
        cartBadgeRef.current,
        { scale: 1.6, rotate: 12 },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(3)' }
      );
      prevCartCountRef.current = cartCount;
    }
  }, [cartCount]);

  return (
    <header className="header-wrapper glass-panel">
      <div className="container header-nav">
        {/* Brand Logo & Tagline */}
        <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-box">
            <ShoppingBag size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">{brandName}</span>
            <span className="brand-subtitle">Curated Modern Emporium</span>
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              className="search-input"
              placeholder="Search 110+ luxury sneakers, apparel, bags, cosmetics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Help & Support Button */}
          <button
            className="action-pill-btn"
            onClick={onOpenHelp}
            title="Help Center, Live Tracking & AuraBot Concierge"
          >
            <HelpCircle size={17} color="#818cf8" />
            <span>Help</span>
          </button>

          {/* User Account / OAuth Login Button */}
          {currentUser ? (
            <button
              className="action-pill-btn user-profile-btn"
              onClick={onOpenProfile}
              title={`VIP Account: ${currentUser.name}`}
              style={{ border: '1px solid rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.1)' }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="header-avatar-thumb"
              />
              <span style={{ color: '#fff', fontWeight: '700' }}>
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              className="action-pill-btn header-auth-btn"
              onClick={onOpenAuth}
              title="Sign In or Register with Google, GitHub or Apple OAuth"
            >
              <User size={16} color="#818cf8" />
              <span style={{ fontWeight: '700' }}>Sign In / Register</span>
              <span className="auth-pill-badge">OAuth</span>
            </button>
          )}

          {/* Brand Name Ideas modal button */}
          <button
            className="action-pill-btn"
            onClick={onOpenBrandIdeas}
            title="Explore Curated Brand Name Suggestions"
            style={{ border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fbbf24' }}
          >
            <Sparkles size={16} />
            <span style={{ display: 'none', mdDisplay: 'inline' }}>Names</span>
          </button>

          {/* Orders History */}
          <button
            className="action-pill-btn"
            onClick={onOpenOrders}
            title="View Tracked Orders"
          >
            <Package size={17} />
            <span>Orders</span>
          </button>

          {/* Wishlist Button */}
          <button
            className="action-pill-btn"
            onClick={onOpenWishlist}
            title="View Saved Items"
          >
            <Heart size={17} color={wishlistCount > 0 ? '#ef4444' : 'currentColor'} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </button>

          {/* Cart Button */}
          <button
            className="action-pill-btn"
            onClick={onOpenCart}
            title="View Shopping Cart"
            style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            <ShoppingBag size={18} color="#818cf8" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span ref={cartBadgeRef} className="action-badge">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', marginLeft: '4px', fontFamily: 'var(--font-mono)' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
