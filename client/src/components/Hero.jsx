import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Zap, Flame } from 'lucide-react';
import gsap from 'gsap';

export default function Hero({ onExploreClick, onQuickViewProduct, featuredProduct }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const cardRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Staggered text & CTA reveal
      tl.from('.hero-tag', { opacity: 0, y: -20, duration: 0.6 })
        .from(titleRef.current, { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from(descRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
        .from(ctaRef.current, { opacity: 0, scale: 0.95, duration: 0.5 }, '-=0.4')
        .from(statsRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
        .from(cardRef.current, { opacity: 0, x: 40, duration: 0.9 }, '-=0.7');

      // Continuous subtle 3D levitation for hero card
      gsap.to(cardRef.current, {
        y: -14,
        rotationZ: -0.5,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const sampleProduct = featuredProduct || {
    id: "shoe-01",
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    discountedPrice: 7999,
    originalPrice: 11995,
    discount: 33,
    rating: 4.8,
    reviewsCount: 2480,
    offerLabel: "Bestseller",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80"]
  };

  return (
    <section className="hero-section" ref={heroRef}>
      {/* Background ambient glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Hero Copy & CTA */}
          <div className="hero-copy-column">
            <div className="hero-tag">
              <Sparkles size={14} color="#818cf8" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="hero-title" ref={titleRef}>
              Elevate Your Everyday <br />
              <span className="hero-title-highlight">Aesthetic & Living.</span>
            </h1>

            <p className="hero-description" ref={descRef}>
              Discover handcrafted curations from world-class designers, premium footwear,
              contemporary fashion, and smart home utilities designed for discerning modern tastes.
            </p>

            <div className="hero-cta-group" ref={ctaRef}>
              <button className="btn-primary" onClick={onExploreClick}>
                <span>Explore Catalog</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-secondary"
                onClick={() => onQuickViewProduct(sampleProduct)}
              >
                <Flame size={17} color="#fbbf24" />
                <span>Featured Icon</span>
              </button>
            </div>

            {/* Live Stats */}
            <div className="hero-stats-row" ref={statsRef}>
              <div className="hero-stat-item">
                <span className="hero-stat-value">110+</span>
                <span className="hero-stat-label">Curated Items</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Verified Authentic</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-value">4.9 ★</span>
                <span className="hero-stat-label">Customer Rating</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-value">2 Days</span>
                <span className="hero-stat-label">Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D Showcase Card */}
          <div className="hero-visual-column">
            <div className="hero-showcase-card" ref={cardRef}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="hero-card-badge">
                  <Flame size={14} /> {sampleProduct.offerLabel || 'Trending Icon'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: '700' }}>
                  <Star size={14} fill="#fbbf24" />
                  <span>{sampleProduct.rating}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({sampleProduct.reviewsCount})</span>
                </div>
              </div>

              <div className="hero-product-img-box">
                <img
                  src={sampleProduct.images[0]}
                  alt={sampleProduct.name}
                  className="hero-product-img"
                  loading="eager"
                />
              </div>

              <div className="hero-card-info">
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                    {sampleProduct.brand}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '2px', color: '#fff' }}>
                    {sampleProduct.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                      ₹{sampleProduct.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'line-through' }}>
                      ₹{sampleProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
                      {sampleProduct.discount}% OFF
                    </span>
                  </div>
                </div>

                <button
                  className="btn-gold"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                  onClick={() => onQuickViewProduct(sampleProduct)}
                >
                  <span>Quick View</span>
                  <Zap size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Ticker Marquee */}
        <div className="brand-ticker-section">
          <div className="ticker-track">
            {['Nike', 'Ralph Lauren', 'Adidas', 'Chanel', 'Ray-Ban', 'Apple', 'Dior', 'Puma', 'Dyson', 'Zara', 'Prada', 'Sony', 'Gucci', 'Calvin Klein'].map((brand, i) => (
              <div key={i} className="ticker-item">
                <span>{brand}</span>
                <span style={{ color: '#4f46e5', opacity: 0.5 }}>✦</span>
              </div>
            ))}
            {/* Duplicated for seamless infinite loop */}
            {['Nike', 'Ralph Lauren', 'Adidas', 'Chanel', 'Ray-Ban', 'Apple', 'Dior', 'Puma', 'Dyson', 'Zara', 'Prada', 'Sony', 'Gucci', 'Calvin Klein'].map((brand, i) => (
              <div key={`dup-${i}`} className="ticker-item">
                <span>{brand}</span>
                <span style={{ color: '#4f46e5', opacity: 0.5 }}>✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Highlights Row */}
        <div className="promo-grid">
          <div className="promo-banner-card highlight">
            <div className="promo-icon-box" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <Zap size={24} />
            </div>
            <div className="promo-content">
              <h4>Mega Flash Offer: 50% OFF</h4>
              <p>Apply coupon <strong style={{ color: '#fbbf24' }}>AURA50</strong> at checkout on orders above ₹999.</p>
            </div>
          </div>

          <div className="promo-banner-card">
            <div className="promo-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <ShieldCheck size={24} />
            </div>
            <div className="promo-content">
              <h4>100% Authentic Guaranteed</h4>
              <p>Direct sourcing from authorized international distributors with certificates.</p>
            </div>
          </div>

          <div className="promo-banner-card">
            <div className="promo-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Sparkles size={24} />
            </div>
            <div className="promo-content">
              <h4>Express 48hr Doorstep Delivery</h4>
              <p>Free priority shipping on all orders over ₹1,999 across all major pincodes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
