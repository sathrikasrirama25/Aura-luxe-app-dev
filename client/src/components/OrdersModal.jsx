import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Ban,
  Check
} from 'lucide-react';

const CANCELLATION_REASONS = [
  'Found a lower price / better deal elsewhere',
  'Changed my mind / Ordered by mistake',
  'Delivery timeline is too long for my needs',
  'Need to change shipping address or contact info',
  'Ordered incorrect product size or color variant',
  'Other reason'
];

export default function OrdersModal({
  isOpen,
  onClose,
  orders = [],
  onReorder,
  onCancelOrder,
  onTrackOrder
}) {
  if (!isOpen) return null;

  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('cancelled')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800' }}>
          <XCircle size={13} /> Cancelled
        </span>
      );
    }
    if (s.includes('delivered')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
          <CheckCircle2 size={13} /> Delivered
        </span>
      );
    }
    if (s.includes('shipped') || s.includes('transit')) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
          <Truck size={13} /> In Transit
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>
        <Clock size={13} /> {status || 'Confirmed'}
      </span>
    );
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    setIsSubmitting(true);

    const finalReason = selectedReason === 'Other reason'
      ? (customReasonText.trim() || 'Other reason')
      : selectedReason;

    setTimeout(() => {
      setIsSubmitting(false);
      if (onCancelOrder) {
        onCancelOrder(cancellingOrder.orderId, finalReason);
      }
      setCancellingOrder(null);
      setSelectedReason(CANCELLATION_REASONS[0]);
      setCustomReasonText('');
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={22} color="#818cf8" />
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>My Orders & Tracking</h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                View shipments, live delivery timelines, and manage order cancellations
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Package size={44} color="#64748b" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>No Orders Found</h4>
            <p style={{ fontSize: '0.88rem' }}>When you place an order, it will appear here with live tracking and cancellation controls.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {orders.map((order, idx) => {
              const isCancelled = (order.orderStatus || '').toLowerCase().includes('cancelled');
              const isDelivered = (order.orderStatus || '').toLowerCase().includes('delivered');
              const canCancel = !isCancelled && !isDelivered;

              return (
                <div
                  key={order.orderId || idx}
                  style={{
                    background: isCancelled ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCancelled ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative'
                  }}
                >
                  {/* Order Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.82rem', color: isCancelled ? '#f87171' : '#818cf8', fontWeight: '800', letterSpacing: '0.05em' }}>
                          ORDER #{order.orderId}
                        </span>
                        {isCancelled && (
                          <span style={{ fontSize: '0.68rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            REFUND PROCESSED
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getStatusBadge(order.orderStatus)}
                      <span style={{ fontSize: '1.18rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>

                      {/* Prominent Top Cancel Order Button */}
                      {!isCancelled && (
                        <button
                          type="button"
                          className="order-cancel-btn-top"
                          onClick={() => setCancellingOrder(order)}
                          title="Cancel this order for a 100% full refund"
                          style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(220, 38, 38, 0.14))',
                            border: '1px solid rgba(239, 68, 68, 0.55)',
                            color: '#fca5a5',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Ban size={13} color="#f87171" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(order.items || []).map((item, itemIdx) => (
                      <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            background: '#0b101c',
                            filter: isCancelled ? 'grayscale(0.6)' : 'none'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: '600', color: isCancelled ? '#94a3b8' : '#fff' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation Reason Notice if Cancelled */}
                  {isCancelled && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginTop: '14px',
                        fontSize: '0.78rem',
                        color: '#fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <XCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Order Cancelled:</strong> {order.cancellationReason || 'Customer requested cancellation'}.
                        {order.cancelledAt && (
                          <span style={{ color: '#cbd5e1', marginLeft: '6px' }}>
                            ({new Date(order.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
                          </span>
                        )}
                        <span style={{ display: 'block', color: '#34d399', marginTop: '2px', fontWeight: '600' }}>
                          ✓ Full refund of ₹{order.totalAmount.toLocaleString('en-IN')} initiated to {order.paymentMethod}.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar & Delivery Status */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ color: '#94a3b8' }}>
                      {!isCancelled ? (
                        <span>
                          Delivery: <strong style={{ color: '#fff' }}>{order.estimatedDelivery || 'In Progress'}</strong>
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>
                          Status: <strong style={{ color: '#f87171' }}>Order Closed / Refund Complete</strong>
                        </span>
                      )}
                      <span style={{ color: '#64748b', marginLeft: '8px' }}>
                        • Paid via {order.paymentMethod}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Live GPS Track Button */}
                      {!isCancelled && onTrackOrder && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            onClose();
                            onTrackOrder(order);
                          }}
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <Truck size={14} color="#818cf8" />
                          <span>Track GPS</span>
                        </button>
                      )}

                      {/* Cancel Order Button */}
                      {!isCancelled && (
                        <button
                          type="button"
                          className="btn-cancel-order"
                          onClick={() => setCancellingOrder(order)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            border: '1px solid #f87171',
                            color: '#ffffff',
                            borderRadius: '8px',
                            padding: '7px 16px',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 3px 12px rgba(239, 68, 68, 0.35)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Ban size={15} />
                          <span>Cancel Order</span>
                        </button>
                      )}

                      {/* Buy Again / Reorder Button */}
                      {onReorder && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => onReorder(order)}
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <RotateCcw size={14} />
                          <span>{isCancelled ? 'Re-Order Items' : 'Buy Again'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal Dialog */}
        {cancellingOrder && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 120, background: 'rgba(5, 8, 15, 0.88)' }}
            onClick={() => setCancellingOrder(null)}
          >
            <div
              className="modal-content"
              style={{ maxWidth: '480px', padding: '28px', background: '#0e1422', border: '1px solid rgba(239, 68, 68, 0.35)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <AlertTriangle size={22} color="#f87171" />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                  Cancel Order #{cancellingOrder.orderId}?
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                  Are you sure you want to cancel this order? This action cannot be reversed.
                </p>
              </div>

              {/* Order Summary Snapshot */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Items to cancel:</span>
                  <strong style={{ color: '#fff' }}>{cancellingOrder.items?.length || 1} product(s)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8' }}>Refund Amount:</span>
                  <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>
                    ₹{cancellingOrder.totalAmount.toLocaleString('en-IN')} (Full 100% Refund)
                  </strong>
                </div>
              </div>

              {/* Reason Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Please Select a Reason:
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                >
                  {CANCELLATION_REASONS.map((reason) => (
                    <option key={reason} value={reason} style={{ background: '#0e1422', color: '#fff' }}>
                      {reason}
                    </option>
                  ))}
                </select>

                {selectedReason === 'Other reason' && (
                  <input
                    type="text"
                    placeholder="Tell us what went wrong..."
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.86rem',
                      marginTop: '8px',
                      outline: 'none'
                    }}
                  />
                )}
              </div>

              {/* Refund Notice */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: '700', marginBottom: '2px' }}>
                  <ShieldCheck size={14} />
                  <span>Instant Refund Guarantee</span>
                </div>
                Your full refund of ₹{cancellingOrder.totalAmount.toLocaleString('en-IN')} will be credited back to your <strong>{cancellingOrder.paymentMethod}</strong> account within 2-4 hours.
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCancellingOrder(null)}
                  disabled={isSubmitting}
                  style={{ padding: '12px', fontSize: '0.88rem' }}
                >
                  Keep Order
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  {isSubmitting ? (
                    <span>Cancelling...</span>
                  ) : (
                    <>
                      <Ban size={15} />
                      <span>Confirm Cancel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
