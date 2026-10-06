import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  Truck,
  ArrowRight,
  MapPin,
  Lock,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  appliedCoupon,
  savedUser,
  onOrderPlaced
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Address state
  const [address, setAddress] = useState({
    name: (savedUser && savedUser.name) || 'Alex Johnson',
    mobile: (savedUser && savedUser.mobile) || '9876543210',
    doorNo: '402',
    houseNo: 'Block B, Skyline Heights',
    street: 'Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560034'
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('PhonePe UPI');
  const [upiId, setUpiId] = useState('alex@upi');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8829',
    name: 'ALEX JOHNSON',
    expiry: '08/29',
    cvv: '•••'
  });

  const modalRef = useRef(null);
  const successRef = useRef(null);

  // Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? (appliedCoupon.calculatedDiscount || 0) : 0;
  const isFreeShipping = subtotal >= 1999 || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const deliveryFee = isFreeShipping ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map(i => ({
          productId: i.productId,
          name: i.name,
          brand: i.brand,
          image: i.image,
          price: i.price,
          size: i.size || 'Standard',
          color: i.color || 'Default',
          quantity: i.quantity
        })),
        address,
        paymentMethod,
        totalAmount,
        discountAmount: couponDiscount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setStep(3); // Success step
        onOrderPlaced(data.order);

        // Confetti explosion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error('Order error:', e);
      // Fallback local simulation if backend unavailable
      const fallbackOrder = {
        orderId: `LXC-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        totalAmount,
        address,
        paymentMethod,
        paymentStatus: 'Completed',
        orderStatus: 'Order Confirmed',
        estimatedDelivery: 'Delivery by 3 Days',
        orderDate: new Date().toISOString()
      };
      setCreatedOrder(fallbackOrder);
      setStep(3);
      onOrderPlaced(fallbackOrder);
      confetti({ particleCount: 80, spread: 60 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="checkout-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with step indicators */}
        <div className="stepper-header">
          {step < 3 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>
                <div className="step-number">{step > 1 ? <Check size={16} /> : '1'}</div>
                <span>Delivery Address</span>
              </div>
              <div style={{ width: '30px', height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
              <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Payment</span>
              </div>
            </div>
          ) : (
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
              Order Confirmed & Secured!
            </h3>
          )}

          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: DELIVERY ADDRESS */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
              Where should we deliver?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '24px' }}>
              Enter your verified shipping address for express courier tracking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  MOBILE NUMBER (10 DIGITS) *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.mobile}
                  onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  FLAT / DOOR / HOUSE NO *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.doorNo}
                  onChange={(e) => setAddress({ ...address, doorNo: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  STREET / APARTMENT / AREA *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  CITY *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  STATE *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '700', marginBottom: '6px' }}>
                  PIN CODE *
                </label>
                <input
                  type="text"
                  className="search-input"
                  maxLength={6}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px 14px' }}
                  value={address.pinCode}
                  onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!address.name || !address.doorNo || !address.street || !address.city || !address.pinCode}
              >
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: 'transparent', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} /> Back to Address
              </button>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
              Select Payment Method
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '24px' }}>
              All transactions are secured with 256-bit bank-grade encryption.
            </p>

            {/* Payment Method Selector Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { id: 'PhonePe UPI', label: 'UPI / PhonePe', icon: Smartphone },
                { id: 'Credit/Debit Card', label: 'Cards (Visa/MC)', icon: CreditCard },
                { id: 'Net Banking', label: 'Net Banking', icon: Building },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote }
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      background: active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${active ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '12px',
                      padding: '16px 10px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={22} color={active ? '#818cf8' : '#94a3b8'} />
                    <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Payment Sub-views */}
            {paymentMethod === 'Credit/Debit Card' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
                {/* 3D Realistic Virtual Card Preview */}
                <div className="virtual-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-chip"></div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.1em' }}>
                      AURALUXE PLATINUM
                    </span>
                  </div>
                  <div className="card-number-display">{cardData.number}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#a5b4fc', textTransform: 'uppercase' }}>Cardholder</div>
                      <div style={{ fontWeight: '700' }}>{cardData.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#a5b4fc', textTransform: 'uppercase' }}>Expires</div>
                      <div style={{ fontWeight: '700' }}>{cardData.expiry}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="pincode-input"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    className="pincode-input"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'PhonePe UPI' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>Enter UPI ID:</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="pincode-input"
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                    <button
                      key={suf}
                      onClick={() => setUpiId(`alex${suf}`)}
                      style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.06)', padding: '4px 10px', borderRadius: '6px', color: '#a5b4fc' }}
                    >
                      alex{suf}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary Before Paying */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px' }}>
                <span>Deliver To:</span>
                <span style={{ color: '#fff' }}>{address.doorNo}, {address.street}, {address.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', color: '#fff', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span>Final Payable:</span>
                <span style={{ color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              className="btn-gold"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}
            >
              <Lock size={18} />
              <span>{isSubmitting ? 'Securing Transaction...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} & Confirm Order`}</span>
            </button>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS CELEBRATION */}
        {step === 3 && createdOrder && (
          <div className="order-success-box" ref={successRef}>
            <div className="success-check-icon">
              <Check size={42} />
            </div>

            <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '999px', fontWeight: '700' }}>
              ORDER ID: {createdOrder.orderId}
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '14px 0 6px', color: '#fff' }}>
              Thank You, {address.name}!
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94a3b8', maxWidth: '420px', margin: '0 auto 28px' }}>
              Your order has been confirmed and routed to our Bengaluru fulfillment center.
              An invoice notification has been sent to your registered contact.
            </p>

            {/* Live Delivery Progress Tracker */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', margin: '24px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                  Live Delivery Journey
                </span>
                <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700' }}>
                  {createdOrder.estimatedDelivery || 'Arriving in 2-3 Days'}
                </span>
              </div>

              <div className="timeline-tracker">
                <div className="timeline-track-line">
                  <div className="timeline-track-fill" style={{ width: '40%' }}></div>
                </div>

                <div className="timeline-step completed">
                  <div className="timeline-dot"><Check size={14} /></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Placed</span>
                </div>
                <div className="timeline-step completed">
                  <div className="timeline-dot"><Check size={14} /></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600' }}>Confirmed</span>
                </div>
                <div className="timeline-step active">
                  <div className="timeline-dot"><Truck size={14} /></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#818cf8' }}>Packed</span>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot">4</div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Dispatched</span>
                </div>
                <div className="timeline-step">
                  <div className="timeline-dot">5</div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Delivered</span>
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={onClose}
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
