import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  HelpCircle,
  Truck,
  MessageSquare,
  FileQuestion,
  PhoneCall,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Clock,
  MapPin,
  CheckCircle2,
  Package
} from 'lucide-react';
import gsap from 'gsap';

const FAQ_DATA = [
  {
    category: 'Orders & Tracking',
    question: 'How do I track my order status in real time?',
    answer: 'Once your order is confirmed, you will receive an instant confirmation with an Order ID (e.g., LXC-829140). You can enter your Order ID anytime in our "Track Order" tab or your Orders History to view real-time courier milestones with BlueDart Express.'
  },
  {
    category: 'Shipping',
    question: 'What are the delivery timelines and shipping charges?',
    answer: 'All orders on Aura Luxe qualify for 100% FREE Express Luxury Shipping with no minimum order value required. Metro cities receive delivery in 2-3 business days, while other regional destinations take 3-4 business days.'
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return and exchange policy?',
    answer: 'We provide a 7-day hassle-free doorstep return policy on all unworn, unwashed items with original brand tags and luxury packaging intact. Refunds are credited to your original payment method or UPI wallet within 24 hours of inspection.'
  },
  {
    category: 'Authenticity',
    question: 'Are all products 100% genuine and authentic?',
    answer: 'Every timepiece, handbag, sneaker, jewelry piece, and fragrance is directly sourced from authorized brand partners or certified collectors. Every delivery comes with a serial-verified Certificate of Authenticity.'
  },
  {
    category: 'Payments',
    question: 'Which payment methods do you support?',
    answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, EMI options, and Cash on Delivery (COD) across serviceable pin codes.'
  },
  {
    category: 'VIP Membership',
    question: 'How do I earn and redeem Aura Luxe Points?',
    answer: 'Every purchase automatically earns you 5% of order value as Luxe Points (e.g. ₹10,000 order = 500 points). Points never expire and can be applied during checkout as instant cash discounts.'
  }
];

export default function HelpModal({ isOpen, onClose, initialTab = 'track', orders = [] }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [faqCategory, setFaqCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Order tracking state
  const [trackingId, setTrackingId] = useState(orders[0]?.orderId || 'LXC-748921');
  const [searchedOrder, setSearchedOrder] = useState(() => {
    if (orders && orders.length > 0) return orders[0];
    return {
      orderId: 'LXC-748921',
      items: [{ name: 'Rolex Submariner Date 41mm', price: 875000, quantity: 1, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80' }],
      totalAmount: 875000,
      orderStatus: 'In Transit',
      carrier: 'BlueDart Apex Express',
      awbNumber: 'BD-982341094-IN',
      estimatedDelivery: 'Tomorrow by 4:00 PM',
      orderDate: 'Oct 12, 2026',
      address: {
        name: 'Alex Mercer',
        doorNo: 'Villa 7',
        street: 'Palm Meadows, Whitefield',
        city: 'Bengaluru',
        pinCode: '560066'
      }
    };
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am AuraBot, your 24/7 Luxury Shopping Concierge. How can I assist your shopping experience today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const contentRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const matched = orders.find((o) => o.orderId.toLowerCase() === trackingId.trim().toLowerCase());
    if (matched) {
      setSearchedOrder(matched);
    } else {
      // Simulate live status for entered ID
      setSearchedOrder({
        orderId: trackingId.toUpperCase(),
        items: [{ name: 'Aura Luxe Curated Order', price: 24999, quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' }],
        totalAmount: 24999,
        orderStatus: 'Out for Delivery',
        carrier: 'BlueDart Apex Luxury Flight',
        awbNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`,
        estimatedDelivery: 'Today by 7:30 PM',
        orderDate: 'Oct 14, 2026',
        address: {
          name: 'Valued Client',
          doorNo: 'Suite 404',
          street: 'Indiranagar Main',
          city: 'Bengaluru',
          pinCode: '560038'
        }
      });
    }
  };

  const handleSendChat = (messageText) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!messageText) setChatInput('');

    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      let replyText = 'Thank you for reaching out! Our concierge team is standing by to assist with custom requests, sizing inquiries, and order priority.';

      const lower = textToSend.toLowerCase();
      if (lower.includes('track') || lower.includes('where is my order')) {
        replyText = `You can view live delivery milestones directly in the "Track Order" tab above! Enter your order number like ${trackingId} for GPS tracking.`;
      } else if (lower.includes('return') || lower.includes('refund')) {
        replyText = 'We provide a 7-day doorstep return policy! Simply open your Orders tab or request a pickup, and our courier will inspect and collect the package with instant refund dispatch.';
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('promo')) {
        replyText = 'Active promo codes available right now: AURA50 (50% off up to ₹2,500), WELCOME20 (20% off), and FESTIVE30 (30% off festive deal)!';
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('call')) {
        replyText = 'You can reach our dedicated senior concierge specialist 24/7 at 1800-888-AURA (2872) or via WhatsApp concierge on +91 98450 12345.';
      } else if (lower.includes('authentic') || lower.includes('genuine')) {
        replyText = '100% of our products are certified original and inspected by certified appraisers. Every piece ships with an authenticated serial card.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: 'Just now'
        }
      ]);
    }, 750);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    if (faqCategory === 'All') return true;
    return item.category.toLowerCase().includes(faqCategory.toLowerCase());
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content help-modal-box"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Help">
          <X size={18} />
        </button>

        {/* Modal Top Header */}
        <div className="help-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="help-icon-circle">
              <HelpCircle size={22} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                Help & Concierge Support
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                24/7 dedicated client assistance, real-time tracking & luxury service
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="help-tabs-nav">
          <button
            className={`help-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Truck size={16} />
            <span>Live Order Tracking</span>
          </button>

          <button
            className={`help-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} />
            <span>AuraBot Assistant</span>
          </button>

          <button
            className={`help-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <FileQuestion size={16} />
            <span>FAQs & Policy</span>
          </button>

          <button
            className={`help-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <PhoneCall size={16} />
            <span>Contact Concierge</span>
          </button>
        </div>

        {/* TAB 1: LIVE ORDER TRACKING */}
        {activeTab === 'track' && (
          <div className="help-tab-body">
            {/* Input Search for Order ID */}
            <form onSubmit={handleTrackSubmit} className="track-search-form">
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="auth-input-field"
                  placeholder="Enter Order ID (e.g. LXC-748921)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <button type="submit" className="btn-secondary" style={{ padding: '0 24px', fontSize: '0.9rem' }}>
                Track Order
              </button>
            </form>

            {/* Tracking Result Card */}
            {searchedOrder && (
              <div className="track-result-card glass-panel">
                <div className="track-card-header">
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: '800', letterSpacing: '0.05em' }}>
                      Shipment Details
                    </span>
                    <h4 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                      {searchedOrder.orderId}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="track-status-pill">
                      <Clock size={13} color="#10b981" />
                      <span>{searchedOrder.orderStatus || 'In Transit'}</span>
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700', marginTop: '4px' }}>
                      {searchedOrder.estimatedDelivery}
                    </div>
                  </div>
                </div>

                {/* Stepper Timeline */}
                <div className="track-stepper-container">
                  <div className="stepper-step completed">
                    <div className="step-circle"><CheckCircle2 size={16} /></div>
                    <div className="step-label">Order Placed</div>
                    <div className="step-sub">{searchedOrder.orderDate || 'Oct 12'}</div>
                  </div>

                  <div className="stepper-line completed"></div>

                  <div className="stepper-step completed">
                    <div className="step-circle"><CheckCircle2 size={16} /></div>
                    <div className="step-label">Quality Inspected</div>
                    <div className="step-sub">Serial Verified</div>
                  </div>

                  <div className="stepper-line completed"></div>

                  <div className="stepper-step active">
                    <div className="step-circle"><Truck size={16} /></div>
                    <div className="step-label">In Transit</div>
                    <div className="step-sub">{searchedOrder.carrier || 'BlueDart Air'}</div>
                  </div>

                  <div className="stepper-line"></div>

                  <div className="stepper-step">
                    <div className="step-circle"><Package size={16} /></div>
                    <div className="step-label">Out for Delivery</div>
                    <div className="step-sub">Expected Soon</div>
                  </div>
                </div>

                {/* Carrier & Delivery Info */}
                <div className="track-meta-grid">
                  <div>
                    <span className="meta-title">Courier Partner:</span>
                    <span className="meta-val">{searchedOrder.carrier || 'BlueDart Apex Express'}</span>
                  </div>
                  <div>
                    <span className="meta-title">AWB Tracking No:</span>
                    <span className="meta-val" style={{ fontFamily: 'var(--font-mono)' }}>
                      {searchedOrder.awbNumber || 'BD-84729103-IN'}
                    </span>
                  </div>
                  <div>
                    <span className="meta-title">Destination Address:</span>
                    <span className="meta-val">
                      {searchedOrder.address ? `${searchedOrder.address.city}, ${searchedOrder.address.pinCode}` : 'Bengaluru, 560066'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AURABOT AI LIVE CHAT ASSISTANT */}
        {activeTab === 'chat' && (
          <div className="help-tab-body chat-mode-body">
            {/* Quick Prompt Chips */}
            <div className="chat-prompt-chips">
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendChat('Where is my order?')}
              >
                📦 Where is my order?
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendChat('What is your return policy?')}
              >
                🔄 Return policy
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendChat('What promo codes are active?')}
              >
                🏷️ Active promo codes
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => handleSendChat('Connect me to human concierge')}
              >
                🎧 Human agent
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="chat-messages-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'user' ? 'user-side' : 'bot-side'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="bot-avatar-badge">
                      <Sparkles size={14} color="#818cf8" />
                    </div>
                  )}
                  <div className="chat-bubble">
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.5' }}>{msg.text}</p>
                    <span className="chat-timestamp">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="chat-bubble-row bot-side">
                  <div className="bot-avatar-badge">
                    <Sparkles size={14} color="#818cf8" />
                  </div>
                  <div className="chat-bubble typing-bubble">
                    <span>AuraBot is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="chat-input-row"
            >
              <input
                type="text"
                className="auth-input-field"
                placeholder="Type your inquiry (e.g. Can I exchange my size?)..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn-gold" style={{ padding: '0 20px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FAQS & POLICY */}
        {activeTab === 'faq' && (
          <div className="help-tab-body">
            {/* Filter pills */}
            <div className="faq-category-pills">
              {['All', 'Orders', 'Shipping', 'Returns', 'Authenticity', 'Payments'].map((cat) => (
                <button
                  key={cat}
                  className={`cat-chip ${faqCategory === cat ? 'active' : ''}`}
                  onClick={() => setFaqCategory(cat)}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="faq-accordion-list">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`faq-item glass-panel ${isOpen ? 'expanded' : ''}`}
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  >
                    <div className="faq-question-row">
                      <span className="faq-question-text">{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} color="#818cf8" /> : <ChevronDown size={18} color="#94a3b8" />}
                    </div>
                    {isOpen && (
                      <div className="faq-answer-block">
                        <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CONCIERGE & CONTACTS */}
        {activeTab === 'contact' && (
          <div className="help-tab-body">
            <div className="contact-cards-grid">
              {/* Card 1: 24/7 VIP Hotline */}
              <div className="contact-card glass-panel">
                <div className="contact-card-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                  <PhoneCall size={22} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', margin: '10px 0 4px' }}>
                  24/7 VIP Hotline
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '12px' }}>
                  Dedicated toll-free luxury concierge support line
                </p>
                <a href="tel:18008882872" className="contact-action-link">
                  1800-888-AURA (2872)
                </a>
              </div>

              {/* Card 2: Concierge Email */}
              <div className="contact-card glass-panel">
                <div className="contact-card-icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
                  <MessageSquare size={22} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', margin: '10px 0 4px' }}>
                  Client Concierge Email
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '12px' }}>
                  Guaranteed response within 2 hours
                </p>
                <a href="mailto:concierge@auraluxe.com" className="contact-action-link">
                  concierge@auraluxe.com
                </a>
              </div>

              {/* Card 3: Flagship Boutique Showrooms */}
              <div className="contact-card glass-panel" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <MapPin size={20} color="#34d399" />
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>
                    Flagship Experiential Boutiques
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <strong style={{ color: '#fff' }}>Bengaluru Flagship:</strong><br />
                    The Collection at UB City, Vittal Mallya Road, Bengaluru 560001<br />
                    <span style={{ color: '#818cf8' }}>Open: 10:30 AM - 9:00 PM Daily</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <strong style={{ color: '#fff' }}>Mumbai Atelier:</strong><br />
                    Palladium Mall, Senapati Bapat Marg, Lower Parel, Mumbai 400013<br />
                    <span style={{ color: '#818cf8' }}>Open: 11:00 AM - 9:30 PM Daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
