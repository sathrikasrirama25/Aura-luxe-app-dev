import React, { useEffect, useRef } from 'react';
import {
  X,
  User,
  Crown,
  LogOut,
  MapPin,
  Package,
  Heart,
  Award,
  Sparkles,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import gsap from 'gsap';

export default function UserProfileModal({
  user,
  isOpen,
  onClose,
  onLogout,
  onOpenOrders,
  onOpenWishlist
}) {
  if (!isOpen || !user) return null;

  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.92, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content user-profile-modal-box"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close profile">
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="profile-banner-header">
          <div className="profile-avatar-wrapper">
            <img src={user.avatar} alt={user.name} className="profile-large-avatar" />
            <div className="profile-crown-badge">
              <Crown size={14} color="#090d16" />
            </div>
          </div>

          <h3 className="profile-user-name">{user.name}</h3>
          <p className="profile-user-email">{user.email}</p>

          <div className="profile-tier-chip">
            <Sparkles size={13} color="#fbbf24" />
            <span>{user.tier || 'VIP Gold Member'}</span>
            <span className="tier-bullet">•</span>
            <span>{user.points || 4200} Luxe Points</span>
          </div>
        </div>

        {/* Profile Stats Matrix */}
        <div className="profile-stats-grid">
          <div className="profile-stat-item" onClick={() => { onClose(); onOpenOrders(); }} style={{ cursor: 'pointer' }}>
            <Package size={18} color="#818cf8" />
            <div className="stat-val">{user.ordersCount || 4} Orders</div>
            <div className="stat-lbl">Track Shipments</div>
          </div>

          <div className="profile-stat-item" onClick={() => { onClose(); onOpenWishlist(); }} style={{ cursor: 'pointer' }}>
            <Heart size={18} color="#ef4444" />
            <div className="stat-val">Wishlist</div>
            <div className="stat-lbl">Saved Curations</div>
          </div>

          <div className="profile-stat-item">
            <Award size={18} color="#fbbf24" />
            <div className="stat-val">Gold Tier</div>
            <div className="stat-lbl">5% Back on Orders</div>
          </div>
        </div>

        {/* Saved Shipping Address Section */}
        {user.savedAddress && (
          <div className="profile-address-box glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={16} color="#818cf8" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Primary Delivery Address
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              <strong>{user.savedAddress.name}</strong><br />
              {user.savedAddress.doorNo}, {user.savedAddress.street}<br />
              {user.savedAddress.city}, {user.savedAddress.state} - {user.savedAddress.pinCode}<br />
              <span style={{ color: '#94a3b8' }}>Contact: {user.savedAddress.mobile}</span>
            </p>
          </div>
        )}

        {/* Provider Tag & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Authenticated via {user.provider || 'OAuth 2.0'}</span>
          </div>

          <button
            type="button"
            className="action-pill-btn"
            onClick={() => {
              onLogout();
              onClose();
            }}
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
