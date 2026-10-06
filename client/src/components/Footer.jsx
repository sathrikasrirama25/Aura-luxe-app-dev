import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Heart, Sparkles } from 'lucide-react';

export default function Footer({ brandName = 'AURALUXE', onSelectCategory }) {
  return (
    <footer style={{ background: '#060910', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '60px 0 30px', marginTop: '60px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }}>
                <ShoppingBag size={20} />
              </div>
              <span className="brand-title" style={{ fontSize: '1.4rem' }}>{brandName}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '300px' }}>
              The modern shopping destination engineered on the MERN stack with Vite + React and GSAP motion. Curating top-tier fashion, footwear, cosmetics, and lifestyle design.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
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
              Popular Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94a3b8' }}>
              {['Shoes', 'Bags', 'Women', 'Men', 'Makeup & Beauty', 'Home Decor', 'Home Utilities'].map((cat) => (
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

          {/* Guarantees */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
              The {brandName} Promise
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>100% Verified Authentic Products</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Truck size={18} color="#818cf8" />
                <span>48-Hour Express Dispatch Guarantee</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <RotateCcw size={18} color="#fbbf24" />
                <span>7-Day No-Questions-Asked Returns</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Sparkles size={18} color="#ec4899" />
                <span>Hand-inspected by Quality Experts</span>
              </div>
            </div>
          </div>

          {/* Customer Support & Security */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
              Need Assistance?
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
              Our dedicated concierge team is available 24/7 for inquiries, sizing consultations, and tracking support.
            </p>
            <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: '700', marginBottom: '6px' }}>
              support@{brandName.toLowerCase()}app.com
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Toll-Free: +91 (800) 425-LUXE
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
