import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Heart, Sparkles } from 'lucide-react';

export default function Footer({ brandName = 'AURALUXE', onSelectCategory, onOpenHelp }) {
  return (
    <footer style={{ background: '#060910', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 0 30px', marginTop: '60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }}>
                <ShoppingBag size={20} />
              </div>
              <span className="brand-title" style={{ fontSize: '1.4rem' }}>{brandName}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '300px' }}>
              The modern shopping destination engineered on the MERN stack with Vite + React and GSAP motion. Curating 135+ luxury items across fashion, timepieces, jewelry, and high-fidelity electronics.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                ⚡ Vite 5 + React 18
              </span>
              <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                🍃 MongoDB + Express
              </span>
            </div>
          </div>

          {/* Quick Category Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
              Curated Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem', color: '#94a3b8' }}>
              {['Watches', 'Jewelry', 'Fragrances', 'Eyewear', 'Electronics', 'Shoes', 'Bags', 'Women', 'Men', 'Home Decor'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    style={{ background: 'transparent', color: '#94a3b8', transition: 'color 0.2s ease', textAlign: 'left', padding: 0 }}
                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees & Help Center Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
              Client Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <button
                onClick={() => onOpenHelp && onOpenHelp('track')}
                style={{ background: 'transparent', color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left', padding: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Truck size={17} color="#818cf8" />
                <span>Track Live Order & Shipments</span>
              </button>

              <button
                onClick={() => onOpenHelp && onOpenHelp('chat')}
                style={{ background: 'transparent', color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left', padding: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Sparkles size={17} color="#fbbf24" />
                <span>24/7 AuraBot Shopping Concierge</span>
              </button>

              <button
                onClick={() => onOpenHelp && onOpenHelp('faq')}
                style={{ background: 'transparent', color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left', padding: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <RotateCcw size={17} color="#10b981" />
                <span>7-Day Return Policy & FAQs</span>
              </button>

              <button
                onClick={() => onOpenHelp && onOpenHelp('contact')}
                style={{ background: 'transparent', color: '#94a3b8', display: 'flex', gap: '10px', alignItems: 'center', textAlign: 'left', padding: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ShieldCheck size={17} color="#38bdf8" />
                <span>100% Verified Authenticity Guarantee</span>
              </button>
            </div>
          </div>

          {/* Customer Support & Security */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
              Direct Concierge
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
              VIP client advisors available 24/7 for bespoke inquiries, orders, and consultations.
            </p>
            <button
              onClick={() => onOpenHelp && onOpenHelp('contact')}
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.82rem', marginBottom: '10px' }}
            >
              Contact Concierge Desk
            </button>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Toll-Free: 1800-888-AURA (2872)
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} {brandName} Inc. All rights reserved. Built for Diploma Engineering Demo.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Made with precision in</span>
            <span style={{ color: '#818cf8', fontWeight: '600' }}>React • Vite • Node • Express • GSAP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
