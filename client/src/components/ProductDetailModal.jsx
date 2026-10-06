import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Heart,
  Share2,
  MapPin
} from 'lucide-react';
import gsap from 'gsap';

export default function ProductDetailModal({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist
}) {
  if (!product) return null;

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState((product.sizes && product.sizes[0]) || 'Standard');
  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80'];

  // GSAP modal entrance animation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit PIN code' });
      return;
    }
    const days = Math.floor(Math.random() * 2) + 2;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    
    setPincodeStatus({
      valid: true,
      message: `Delivery available! Expected by ${dateStr} with FREE Express Shipping.`
    });
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    onAddToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={onClose}>
      <div
        className="modal-content"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <X size={20} />
        </button>

        <div className="modal-detail-grid">
          {/* Left Column: Image Gallery */}
          <div className="gallery-container">
            <div className="main-image-frame">
              <img
                src={images[activeImgIdx]}
                alt={`${product.name} view`}
                key={activeImgIdx}
              />
            </div>

            {/* Thumbnail perspectives switcher */}
            <div className="thumbnail-row">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`thumbnail-chip ${activeImgIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIdx(idx)}
                >
                  <img src={imgUrl} alt={`Angle ${idx + 1}`} />
                </div>
              ))}
            </div>

            {/* Perspective View Description if available */}
            {product.views && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: '700' }}>
                  Perspective Angle Details:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {activeImgIdx === 0 && (product.views.front || 'Front showcase perspective.')}
                  {activeImgIdx === 1 && (product.views.side || 'Side profile detailing aerodynamic silhouette.')}
                  {activeImgIdx === 2 && (product.views.back || 'Heel/Rear view highlighting branding accents.')}
                  {activeImgIdx === 3 && (product.views.top || 'Top-down interior & tongue ergonomics.')}
                  {activeImgIdx >= 4 && (product.views.detail || 'High-resolution material texture & stitching.')}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Purchasing Flow */}
          <div className="detail-specs-box">
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#818cf8' }}>
                {product.brand} • {product.subCategory || product.category}
              </span>
              <button
                className="btn-icon"
                onClick={() => onToggleWishlist(product.id)}
                style={{ width: '36px', height: '36px' }}
                title="Save to Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.25', color: '#fff', marginBottom: '12px' }}>
              {product.name}
            </h2>

            {/* Rating & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="rating-badge">
                <Star size={14} fill="#fbbf24" />
                <span>{product.rating}</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {product.reviewsCount || 1200} Verified Customer Reviews
              </span>
              <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
                {product.stockStatus || 'In Stock'}
              </span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '16px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                ₹{product.discountedPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.discountedPrice && (
                <span style={{ fontSize: '1.15rem', color: '#64748b', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '700' }}>
                  {product.discount}% DISCOUNT
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.6', margin: '20px 0' }}>
              {product.description}
            </p>

            {/* Material */}
            {product.material && (
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '16px' }}>
                <strong style={{ color: '#fff' }}>Craftsmanship & Material: </strong>
                {product.material}
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1' }}>
                    Select Size: <strong style={{ color: '#818cf8' }}>{selectedSize}</strong>
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: '600' }}>
                    ⚡ Few Units Left
                  </span>
                </div>
                <div className="size-pill-group">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      className={`size-option-pill ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', textTransform: 'uppercase', color: '#cbd5e1' }}>
                  Color Variation: <strong style={{ color: '#818cf8' }}>{selectedColor}</strong>
                </span>
                <div className="color-pill-group">
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      className={`color-option-pill ${selectedColor === clr ? 'active' : ''}`}
                      onClick={() => setSelectedColor(clr)}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pincode Estimator */}
            <div className="pincode-checker">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>
                <MapPin size={16} color="#818cf8" />
                <span>Estimate Express Delivery to Your Area</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="pincode-input-group">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN Code (e.g. 560034)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="pincode-input"
                />
                <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <div style={{ marginTop: '8px', fontSize: '0.82rem', color: pincodeStatus.valid ? '#10b981' : '#ef4444' }}>
                  {pincodeStatus.message}
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Bag + Buy Now */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
              <button
                className="btn-secondary"
                onClick={handleAddToCart}
                style={{ padding: '14px', fontSize: '0.95rem' }}
              >
                {isAdded ? (
                  <>
                    <Check size={18} color="#10b981" />
                    <span style={{ color: '#10b981' }}>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                className="btn-gold"
                onClick={handleBuyNow}
                style={{ padding: '14px', fontSize: '0.95rem' }}
              >
                <Zap size={18} />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Value Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <Truck size={16} color="#818cf8" />
                <span>Free Express Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>100% Genuine Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <RotateCcw size={16} color="#fbbf24" />
                <span>7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
