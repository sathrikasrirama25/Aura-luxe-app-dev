
import React, { useEffect, useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function ReviewsSection({ productId }) {
  const storageKey = `auraluxe-reviews-${productId}`;
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    try {
      setReviews(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch {
      setReviews([]);
    }
  }, [storageKey]);

  const submitReview = (event) => {
    event.preventDefault();
    const text = reviewText.trim();
    if (!text) return;

    const updated = [
      {
        id: `${Date.now()}`,
        rating,
        text,
        date: new Date().toLocaleDateString('en-IN')
      },
      ...reviews
    ];

    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setReviewText('');
    setRating(5);
  };

  return (
    <section style={{
      marginTop: 24,
      padding: 20,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff'
    }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>
        Customer Reviews & Ratings
      </h3>

      <p style={{ color: '#94a3b8', fontSize: 13 }}>
        Share your experience with this product.
      </p>

      <form onSubmit={submitReview}>
        <div style={{
          display: 'flex',
          gap: 8,
          margin: '14px 0'
        }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} stars`}
              style={{
                border: 0,
                background: 'transparent',
                padding: 2,
                color: value <= rating ? '#fbbf24' : '#64748b',
                cursor: 'pointer'
              }}
            >
              <Star
                size={26}
                fill={value <= rating ? '#fbbf24' : 'none'}
              />
            </button>
          ))}
          <span style={{ alignSelf: 'center' }}>{rating}/5</span>
        </div>

        <textarea
          value={reviewText}
          onChange={(event) => setReviewText(event.target.value)}
          placeholder="Write your review..."
          maxLength={500}
          required
          rows={3}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 12,
            borderRadius: 10,
            background: '#111827',
            color: '#fff',
            border: '1px solid #475569',
            resize: 'vertical'
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: 12,
            padding: '10px 16px',
            border: 0,
            borderRadius: 9,
            background: '#fbbf24',
            color: '#111827',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Send size={16} /> Submit Review
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        {reviews.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              style={{
                padding: '14px 0',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ color: '#fbbf24' }}>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <p style={{ margin: '8px 0', overflowWrap: 'anywhere' }}>
                {review.text}
              </p>
              <small style={{ color: '#94a3b8' }}>
                Demo review · {review.date}
              </small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
