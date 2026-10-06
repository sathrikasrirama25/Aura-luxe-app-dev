import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders = [], onReorder }) {
  if (!isOpen) return null;

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
          <CheckCircle2 size={13} /> Delivered
        </span>
      );
    }
    if (s.includes('shipped') || s.includes('transit')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
          <Truck size={13} /> In Transit
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
        <Clock size={13} /> {status || 'Confirmed'}
      </span>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} color="#818cf8" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>My Orders & Tracking</h3>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Package size={40} color="#64748b" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>No Orders Found</h4>
            <p style={{ fontSize: '0.88rem' }}>When you place an order, it will appear here with live tracking.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {orders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: '800', letterSpacing: '0.05em' }}>
                      ORDER #{order.orderId}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getStatusBadge(order.orderStatus)}
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items preview list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(order.items || []).map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#0b101c' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#fff' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery footer info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>
                    Status: <strong style={{ color: '#fff' }}>{order.estimatedDelivery || 'In Progress'}</strong>
                  </span>
                  <span style={{ color: '#64748b' }}>
                    Paid via {order.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
