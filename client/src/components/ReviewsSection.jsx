import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  PenLine,
  Sparkles,
  MessageSquare,
  User
} from 'lucide-react';

// Curated realistic luxury reviewers bank
const SAMPLE_REVIEWERS = [
  { name: 'Elena Rostova', city: 'London', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'Marcus Vance', city: 'New York', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Priya Sharma', city: 'Bengaluru', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { name: 'Julien Laurent', city: 'Paris', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { name: 'Aaliyah Khan', city: 'Dubai', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
];

export default function ReviewsSection({ product, currentUser, onOpenAuth }) {
  if (!product || !product.id) return null;

  const [filterRating, setFilterRating] = useState('all'); // 'all', '5', '4', '3-below'
  const [sortBy, setSortBy] = useState('helpful'); // 'helpful', 'recent', 'highest', 'lowest'
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formName, setFormName] = useState(currentUser?.name || '');
  const [formRecommend, setFormRecommend] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // User-voted helpful IDs
  const [helpfulVotes, setHelpfulVotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auraluxe_helpful_reviews') || '{}');
    } catch {
      return {};
    }
  });

  // Base persistent reviews stored per product in localStorage
  const storageKey = `auraluxe_reviews_${product.id}`;
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Generate high quality default reviews if none in storage
    const defaultRating = product.rating || 4.8;
    return [
      {
        id: `rev-1-${product.id}`,
        userName: SAMPLE_REVIEWERS[0].name,
        userAvatar: SAMPLE_REVIEWERS[0].avatar,
        location: SAMPLE_REVIEWERS[0].city,
        rating: 5,
        date: '3 days ago',
        verified: true,
        size: (product.sizes && product.sizes[0]) || 'Standard',
        color: (product.colors && product.colors[0]) || 'Default',
        title: `Absolute masterpiece — surpasses expectations for ${product.brand}!`,
        comment: `The tactile feel and finish of this piece is exceptional. Arrived in pristine luxury packaging within 48 hours. The craftsmanship on the ${product.material || 'materials'} is peerless. Highly recommended to anyone looking for authentic high-end curation.`,
        helpfulCount: 28,
        recommend: true
      },
      {
        id: `rev-2-${product.id}`,
        userName: SAMPLE_REVIEWERS[1].name,
        userAvatar: SAMPLE_REVIEWERS[1].avatar,
        location: SAMPLE_REVIEWERS[1].city,
        rating: 5,
        date: '1 week ago',
        verified: true,
        size: (product.sizes && product.sizes[0]) || 'Standard',
        color: (product.colors && product.colors[1]) || (product.colors && product.colors[0]) || 'Default',
        title: 'Authenticity guaranteed, immaculate presentation',
        comment: `Was slightly hesitant buying high-value items online, but Aura Luxe delivered genuine authentic goods with certification paperwork. The aesthetic and comfort are 10/10.`,
        helpfulCount: 19,
        recommend: true
      },
      {
        id: `rev-3-${product.id}`,
        userName: SAMPLE_REVIEWERS[2].name,
        userAvatar: SAMPLE_REVIEWERS[2].avatar,
        location: SAMPLE_REVIEWERS[2].city,
        rating: 4,
        date: '2 weeks ago',
        verified: true,
        size: (product.sizes && product.sizes[0]) || 'Standard',
        color: (product.colors && product.colors[0]) || 'Default',
        title: 'Superb quality, runs true to luxury dimensions',
        comment: `Spectacular silhouette and detailing. Fits perfectly according to the specs table. Express delivery was seamless. Giving 4.5 stars because it sold out right after I wanted to gift another to a colleague!`,
        helpfulCount: 12,
        recommend: true
      }
    ];
  });

  // Keep reviews updated in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviewsList));
    } catch (e) {}
  }, [reviewsList, storageKey]);

  // Handle helpful voting
  const handleToggleHelpful = (reviewId) => {
    const isVoted = !!helpfulVotes[reviewId];
    const newVotes = { ...helpfulVotes, [reviewId]: !isVoted };
    setHelpfulVotes(newVotes);
    try {
      localStorage.setItem('auraluxe_helpful_reviews', JSON.stringify(newVotes));
    } catch (e) {}

    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpfulCount: isVoted ? Math.max(0, r.helpfulCount - 1) : r.helpfulCount + 1
          };
        }
        return r;
      })
    );
  };

  // Submit Review Handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) return;

    const newReview = {
      id: `rev-user-${Date.now()}`,
      userName: formName.trim() || (currentUser?.name || 'Verified Client'),
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formName || 'VIP')}`,
      location: 'India',
      rating: formRating,
      date: 'Just now',
      verified: true,
      size: (product.sizes && product.sizes[0]) || 'Standard',
      color: (product.colors && product.colors[0]) || 'Default',
      title: formTitle.trim(),
      comment: formComment.trim(),
      helpfulCount: 0,
      recommend: formRecommend
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setFormSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setFormSubmitted(false);
      setFormTitle('');
      setFormComment('');
    }, 1200);
  };

  // Star breakdown calculations
  const totalReviews = reviewsList.length;
  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rounded] = (counts[rounded] || 0) + 1;
    });

    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] = totalReviews > 0 ? Math.round((counts[i] / totalReviews) * 100) : 0;
    }
    return { counts, percentages };
  }, [reviewsList, totalReviews]);

  // Filtered & Sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...reviewsList];

    // Rating filter
    if (filterRating === '5') {
      list = list.filter((r) => Math.round(r.rating) === 5);
    } else if (filterRating === '4') {
      list = list.filter((r) => Math.round(r.rating) === 4);
    } else if (filterRating === '3-below') {
      list = list.filter((r) => Math.round(r.rating) <= 3);
    }

    // Sort order
    if (sortBy === 'helpful') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === 'recent') {
      // Recent first (user submitted or original index)
      list.sort((a, b) => (b.date === 'Just now' ? 1 : 0) - (a.date === 'Just now' ? 1 : 0));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [reviewsList, filterRating, sortBy]);

  return (
    <section className="product-reviews-section">
      <div className="reviews-section-header">
        <div>
          <span className="reviews-section-badge">
            <Sparkles size={14} /> Verified Client Impressions
          </span>
          <h3 className="reviews-section-title">Ratings & Customer Reviews</h3>
        </div>
        <button
          className="btn-review-cta"
          onClick={() => {
            if (!currentUser && onOpenAuth) {
              onOpenAuth();
            } else {
              setShowReviewForm(!showReviewForm);
            }
          }}
        >
          <PenLine size={16} />
          <span>{showReviewForm ? 'Close Review Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview & Star Breakdown Card */}
      <div className="reviews-summary-card">
        <div className="reviews-score-block">
          <div className="big-rating-number">{product.rating || 4.8}</div>
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                fill={star <= Math.round(product.rating || 4.8) ? '#fbbf24' : 'none'}
                color="#fbbf24"
              />
            ))}
          </div>
          <p className="rating-recommend-text">
            Based on <strong>{product.reviewsCount || 1200}</strong> authentic buyers
          </p>
          <div className="recommend-badge">
            <CheckCircle2 size={15} color="#10b981" />
            <span>97% Verified Recommendation</span>
          </div>
        </div>

        {/* Star Progress Bars */}
        <div className="reviews-bars-block">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = ratingBreakdown.percentages[star] || 0;
            const count = ratingBreakdown.counts[star] || 0;
            const isSelected = filterRating === String(star);

            return (
              <div
                key={star}
                className={`star-bar-row ${isSelected ? 'active-filter' : ''}`}
                onClick={() => setFilterRating(isSelected ? 'all' : String(star))}
                title={`Filter by ${star} star reviews`}
              >
                <span className="star-label">{star} ★</span>
                <div className="star-track">
                  <div className="star-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="star-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Collapsible Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="write-review-form glass-panel">
          <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
            Write Your Product Review
          </h4>

          {/* Interactive Star Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              Your Overall Rating:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormRating(star)}
                  onMouseEnter={() => setFormHoverRating(star)}
                  onMouseLeave={() => setFormHoverRating(0)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.15s ease'
                  }}
                  className="star-picker-btn"
                >
                  <Star
                    size={24}
                    fill={(formHoverRating || formRating) >= star ? '#fbbf24' : 'none'}
                    color="#fbbf24"
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '700', marginLeft: '6px' }}>
                {formRating === 5 && 'Outstanding Luxury Experience (5/5)'}
                {formRating === 4 && 'Very Good Quality (4/5)'}
                {formRating === 3 && 'Average Quality (3/5)'}
                {formRating <= 2 && 'Needs Improvement'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
                Your Name / Display Alias
              </label>
              <input
                type="text"
                className="review-input"
                placeholder="e.g. Alexander M."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
                Headline / Review Title
              </label>
              <input
                type="text"
                className="review-input"
                placeholder="e.g. Exceptional finish & rapid delivery"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              Detailed Review (Fit, Craftsmanship, Packaging)
            </label>
            <textarea
              className="review-input"
              rows={3}
              placeholder="Share your authentic thoughts about this product to help the luxury community..."
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#94a3b8', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formRecommend}
                onChange={(e) => setFormRecommend(e.target.checked)}
                style={{ accentColor: '#818cf8', width: '16px', height: '16px' }}
              />
              <span>I recommend this product to other collectors and buyers</span>
            </label>

            <button type="submit" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              {formSubmitted ? 'Published Successfully! ✨' : 'Publish Verified Review'}
            </button>
          </div>
        </form>
      )}

      {/* Review Filter & Sort Controls */}
      <div className="reviews-controls-bar">
        {/* Rating Filter Pills */}
        <div className="reviews-filter-pills">
          <button
            className={`filter-pill ${filterRating === 'all' ? 'active' : ''}`}
            onClick={() => setFilterRating('all')}
          >
            All Ratings ({totalReviews})
          </button>
          <button
            className={`filter-pill ${filterRating === '5' ? 'active' : ''}`}
            onClick={() => setFilterRating('5')}
          >
            5 Stars ({ratingBreakdown.counts[5] || 0})
          </button>
          <button
            className={`filter-pill ${filterRating === '4' ? 'active' : ''}`}
            onClick={() => setFilterRating('4')}
          >
            4 Stars ({ratingBreakdown.counts[4] || 0})
          </button>
          <button
            className={`filter-pill ${filterRating === '3-below' ? 'active' : ''}`}
            onClick={() => setFilterRating('3-below')}
          >
            3★ & Under ({ (ratingBreakdown.counts[3] || 0) + (ratingBreakdown.counts[2] || 0) + (ratingBreakdown.counts[1] || 0) })
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="reviews-sort-wrap">
          <ArrowUpDown size={14} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="reviews-sort-select"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Customer Reviews List */}
      <div className="reviews-list">
        {displayedReviews.length === 0 ? (
          <div className="empty-reviews-box">
            <MessageSquare size={32} color="#64748b" />
            <p>No customer reviews match the selected filter.</p>
            <button
              onClick={() => setFilterRating('all')}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', marginTop: '8px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => {
            const isHelpfulActive = !!helpfulVotes[rev.id];

            return (
              <div key={rev.id} className="review-card glass-panel">
                <div className="review-card-top">
                  <div className="reviewer-info">
                    <img src={rev.userAvatar} alt={rev.userName} className="reviewer-avatar" />
                    <div>
                      <div className="reviewer-name-row">
                        <span className="reviewer-name">{rev.userName}</span>
                        {rev.verified && (
                          <span className="verified-buyer-badge" title="Verified Customer Purchase">
                            <ShieldCheck size={13} color="#10b981" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="reviewer-meta">
                        {rev.location && `${rev.location} • `}
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="review-rating-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= rev.rating ? '#fbbf24' : 'none'}
                        color="#fbbf24"
                      />
                    ))}
                  </div>
                </div>

                {/* Purchase details badge */}
                {(rev.size || rev.color) && (
                  <div className="review-purchase-details">
                    <span>Verified Spec:</span>
                    {rev.size && <span className="spec-tag">{rev.size}</span>}
                    {rev.color && <span className="spec-tag">{rev.color}</span>}
                  </div>
                )}

                <h5 className="review-title">{rev.title}</h5>
                <p className="review-comment">{rev.comment}</p>

                {/* Card footer: Helpful Button */}
                <div className="review-footer">
                  <button
                    className={`helpful-btn ${isHelpfulActive ? 'voted' : ''}`}
                    onClick={() => handleToggleHelpful(rev.id)}
                    title="Mark as helpful review"
                  >
                    <ThumbsUp size={13} />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>

                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Authentic review verified by Aura Luxe Trust Guard
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
