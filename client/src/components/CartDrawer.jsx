import React, { useRef, useEffect, useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) {
  const drawerRef = useRef(null);
  const meterFillRef = useRef(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const FREE_SHIPPING_THRESHOLD = 1999;

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
  const catalogDiscount = Math.max(0, originalTotal - subtotal);

  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const couponDiscount = appliedCoupon ? (appliedCoupon.calculatedDiscount || 0) : 0;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const deliveryFee = isFreeShipping ? 0 : (subtotal > 0 ? 99 : 0);
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  // GSAP slide-in
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  // Animate shipping progress meter
  useEffect(() => {
    if (meterFillRef.current) {
      gsap.to(meterFillRef.current, {
        width: `${shippingPercentage}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [shippingPercentage]);

  if (!isOpen) return null;

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) return;
    setCouponError('');
    setCouponSuccess('');

    onApplyCoupon(code, subtotal, (err, res) => {
      if (err) {
        setCouponError(err);
      } else {
        setCouponSuccess(`Coupon ${code} applied successfully!`);
        setCouponCodeInput('');
      }
    });
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div
        className="cart-drawer"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Your Bag</h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                style={{ background: 'transparent', color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'underline' }}
                title="Remove all items"
              >
                Clear all
              </button>
            )}
            <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="shipping-meter">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            {shippingRemaining === 0 ? (
              <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> You unlocked FREE Express Shipping!
              </span>
            ) : (
              <span>
                Add <strong style={{ color: '#fbbf24' }}>₹{shippingRemaining.toLocaleString('en-IN')}</strong> more for <strong style={{ color: '#fff' }}>FREE Shipping</strong>
              </span>
            )}
            <span style={{ color: '#a5b4fc', fontWeight: '700' }}>{shippingPercentage}%</span>
          </div>
          <div className="meter-bar-track">
            <div className="meter-bar-fill" ref={meterFillRef} style={{ width: `${shippingPercentage}%` }}></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={32} color="#64748b" />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto 24px' }}>
                Looks like you haven't added any luxury curations yet.
              </p>
              <button className="btn-primary" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartItemId || item.productId} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase' }}>
                        {item.brand}
                      </span>
                      <h4 style={{ fontSize: '0.92rem', color: '#fff', lineHeight: '1.3', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.cartItemId || item.productId)}
                      style={{ background: 'transparent', color: '#64748b', padding: '4px' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', margin: '6px 0 10px' }}>
                    <span>Size: <strong style={{ color: '#fff' }}>{item.size || 'Standard'}</strong></span>
                    {item.color && (
                      <span>Color: <strong style={{ color: '#fff' }}>{item.color}</strong></span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', padding: '2px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId || item.productId, Math.max(1, item.quantity - 1))}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId || item.productId, item.quantity + 1)}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Promo & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Promo Code Box */}
            <div style={{ marginBottom: '16px' }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.85rem', fontWeight: '700' }}>
                    <Tag size={16} />
                    <span>Coupon {appliedCoupon.code} Applied (-₹{appliedCoupon.calculatedDiscount})</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    style={{ background: 'transparent', color: '#ef4444', fontSize: '0.78rem', fontWeight: '600' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-box">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="Enter promo (e.g. AURA50)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                    />
                    <button
                      className="btn-secondary"
                      onClick={() => handleApplyCoupon()}
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <div style={{ fontSize: '0.78rem', color: '#ef4444', marginBottom: '8px' }}>
                      {couponError}
                    </div>
                  )}
                  {couponSuccess && (
                    <div style={{ fontSize: '0.78rem', color: '#10b981', marginBottom: '8px' }}>
                      {couponSuccess}
                    </div>
                  )}

                  {/* 1-Click Popular Coupons */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Try:</span>
                    {['AURA50', 'WELCOME20', 'FREESHIP'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleApplyCoupon(c)}
                        style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px dashed rgba(255, 255, 255, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px' }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal (Items Total)</span>
                <span style={{ color: '#fff' }}>₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>
              {catalogDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Catalog Discount</span>
                  <span>-₹{catalogDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Promo Code Savings</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span style={{ color: isFreeShipping ? '#10b981' : '#fff' }}>
                  {isFreeShipping ? 'FREE' : '₹99'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', color: '#fff', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span>Total Amount</span>
                <span style={{ fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="btn-gold"
              onClick={onProceedToCheckout}
              style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'space-between' }}
            >
              <span>Proceed to Checkout</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
