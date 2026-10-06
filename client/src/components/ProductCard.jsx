import React, { useState, useRef } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import gsap from 'gsap';

export default function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const heartRef = useRef(null);
  const cardRef = useRef(null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80'];

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (heartRef.current) {
      gsap.fromTo(
        heartRef.current,
        { scale: 0.6, rotate: -25 },
        { scale: 1.4, rotate: 12, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }
    onToggleWishlist(product.id);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setIsAdded(true);
    onAddToCart({
      productId: product.id,
      size: (product.sizes && product.sizes[0]) || 'Standard',
      color: (product.colors && product.colors[0]) || 'Default',
      quantity: 1
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  // Determine badge class
  const getBadgeClass = (label = '') => {
    const l = label.toLowerCase();
    if (l.includes('bestseller')) return 'bestseller';
    if (l.includes('mega') || l.includes('sale')) return 'megasale';
    if (l.includes('trend')) return 'trending';
    return 'limited';
  };

  return (
    <div
      className="product-card"
      ref={cardRef}
      onClick={() => onQuickView(product)}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      {/* Media / Image Container */}
      <div className="product-media-container">
        <img
          src={images[activeImageIdx]}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="card-top-badges">
          {product.offerLabel && (
            <span className={`badge-offer ${getBadgeClass(product.offerLabel)}`}>
              {product.offerLabel}
            </span>
          )}
          {product.discount >= 30 && (
            <span style={{ fontSize: '0.68rem', fontWeight: '800', background: 'rgba(16, 185, 129, 0.9)', color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>
              SAVE {product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          ref={heartRef}
          className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#fff' : 'none'} color={isWishlisted ? '#fff' : 'currentColor'} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          className="quick-view-overlay-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
        >
          <Eye size={15} />
          <span>Quick View</span>
        </button>

        {/* Perspective Angle Switcher Dots */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              display: 'flex',
              gap: '4px',
              zIndex: 6,
              background: 'rgba(10, 15, 26, 0.6)',
              padding: '3px 6px',
              borderRadius: '999px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.slice(0, 4).map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                style={{
                  width: activeImageIdx === idx ? '14px' : '6px',
                  height: '6px',
                  borderRadius: '999px',
                  background: activeImageIdx === idx ? '#6366f1' : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-brand">{product.brand}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{product.category}</span>
        </div>

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="product-meta-row">
          <div className="rating-badge">
            <Star size={13} fill="#fbbf24" />
            <span>{product.rating}</span>
          </div>
          <span className="reviews-text">
            {product.reviewsCount ? `${product.reviewsCount} reviews` : 'Verified Product'}
          </span>
        </div>

        {/* Price & Discount */}
        <div className="product-price-row">
          <span className="current-price">
            ₹{product.discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.discountedPrice && (
            <span className="original-price">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discount > 0 && (
            <span className="discount-pill">
              {product.discount}% off
            </span>
          )}
        </div>

        {/* Actions Row */}
        <div className="card-action-row" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn-add-cart"
            onClick={handleAddToCartClick}
            style={isAdded ? { background: '#10b981', borderColor: '#10b981' } : {}}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            className="btn-icon"
            onClick={() => onQuickView(product)}
            title="Inspect Details"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
