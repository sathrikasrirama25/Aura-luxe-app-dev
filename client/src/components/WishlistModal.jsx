import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} color="#ef4444" fill="#ef4444" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Your Saved Curations</h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
              {wishlistItems.length}
            </span>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Heart size={40} color="#64748b" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>Wishlist is Empty</h4>
            <p style={{ fontSize: '0.88rem' }}>Click the heart icon on any product card to save it for later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '14px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: '#0b101c', cursor: 'pointer' }}
                  onClick={() => {
                    onClose();
                    onQuickView(product);
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase' }}>
                    {product.brand}
                  </span>
                  <h4
                    style={{ fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                  >
                    {product.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      ₹{product.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    {product.discount > 0 && (
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                        {product.discount}% off
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      onAddToCart({
                        productId: product.id,
                        size: (product.sizes && product.sizes[0]) || 'Standard',
                        color: (product.colors && product.colors[0]) || 'Default',
                        quantity: 1
                      });
                      onRemoveFromWishlist(product.id);
                    }}
                    title="Move to Bag"
                    style={{ width: '36px', height: '36px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                  >
                    <ShoppingBag size={16} />
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => onRemoveFromWishlist(product.id)}
                    title="Remove"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
