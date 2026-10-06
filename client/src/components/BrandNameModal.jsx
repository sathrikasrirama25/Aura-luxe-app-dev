import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

const BRAND_SUGGESTIONS = [
  {
    name: 'AURALUXE',
    tagline: 'Curated Modern Emporium',
    vibe: 'Luxury • Contemporary • Designer',
    description: 'Blends "Aura" (distinctive atmosphere of quality) and "Luxe" (luxury). Positions the store alongside international modern luxury platforms like Farfetch, SSENSE, and Net-a-Porter.',
    isRecommended: true,
    accentColor: '#818cf8'
  },
  {
    name: 'VELOCE',
    tagline: 'High-Velocity Lifestyle & Streetwear',
    vibe: 'Speed • Athletic • Urban',
    description: 'Derived from the Italian word for swift and agile. Perfect for high-demand athletic sneakers, urban apparel, and quick-dispatch delivery.',
    accentColor: '#fbbf24'
  },
  {
    name: 'NOVA CART',
    tagline: 'Next-Generation Modern Living',
    vibe: 'Futuristic • Tech-Savvy • Fresh',
    description: 'Represents a new star bursting with energy. Highly memorable, crisp, and resonates strongly with digital natives and Gen-Z consumers.',
    accentColor: '#34d399'
  },
  {
    name: 'AETHER & CO.',
    tagline: 'Refined Minimalist Essentials',
    vibe: 'Nordic • Clean • Premium Living',
    description: 'Inspired by the fifth classical element—pure, unadulterated air and light. Superb for aesthetic home decor, clean beauty, and tailored apparel.',
    accentColor: '#ec4899'
  },
  {
    name: 'ZOLT STORE',
    tagline: 'Electric Youth & Trendsetting Gear',
    vibe: 'Energetic • Bold • Streetwear',
    description: 'Snappy, 4-letter punchy brand name with high recall. Ideal for dynamic e-commerce catalogs with flash sales and viral products.',
    accentColor: '#f43f5e'
  },
  {
    name: 'LUMINA',
    tagline: 'Radiant Aesthetics & Daily Luxuries',
    vibe: 'Elegant • Sophisticated • Bright',
    description: 'Warm, luminous brand identity celebrating craft, beauty, and premium utility products for modern living spaces.',
    accentColor: '#38bdf8'
  }
];

export default function BrandNameModal({
  isOpen,
  onClose,
  activeBrandName,
  onSelectBrandName
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '840px', padding: '36px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>
              <Sparkles size={14} /> BRAND IDENTITY ADVISOR
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
              Curated E-Commerce Brand Names
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
              Here are premium name suggestions for your modern e-commerce web app. Select any name to immediately update the live store branding!
            </p>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {BRAND_SUGGESTIONS.map((item) => {
            const isSelected = activeBrandName.toUpperCase() === item.name.toUpperCase();

            return (
              <div
                key={item.name}
                onClick={() => {
                  onSelectBrandName(item.name);
                }}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSelected ? item.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                      {item.name}
                    </h4>
                    {item.isRecommended && (
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', background: 'var(--gold-gradient)', color: '#090d16', padding: '2px 8px', borderRadius: '999px' }}>
                        ★ TOP PICK
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span style={{ background: item.accentColor, color: '#090d16', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', color: item.accentColor, fontWeight: '700', marginBottom: '8px' }}>
                  {item.tagline}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Vibe: <strong style={{ color: '#cbd5e1' }}>{item.vibe}</strong>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5' }}>
                  {item.description}
                </p>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: '#64748b' }}>Domain idea: <strong style={{ color: '#cbd5e1' }}>{item.name.toLowerCase()}app.com</strong></span>
                  <span style={{ color: item.accentColor, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isSelected ? 'Active Brand' : 'Click to Apply'}
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
