import React, { useEffect, useState } from 'react'
import './DescriptionBox.css'
import { toast } from 'react-toastify'
import { API_URL } from '../../config';

const DescriptionBox = ({ productId, description }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    fetch(`${API_URL}/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
          setAverage(data.average);
          setCount(data.count);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!localStorage.getItem('auth-token')) {
      toast.info("Please log in to leave a review");
      return;
    }
    if (myRating === 0) {
      toast.warning("Please select a star rating");
      return;
    }
    setSubmitting(true);
    fetch(`${API_URL}/addreview`, {
      method: 'POST',
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, rating: myRating, comment: myComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.success) {
          toast.success("Review submitted!");
          setMyRating(0);
          setMyComment('');
          fetchReviews();
        } else {
          toast.error(data.errors || "Could not submit review");
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error("Could not submit review");
      });
  }

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === 'description' ? '' : 'fade'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'reviews' ? '' : 'fade'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({count})
        </div>
      </div>

      {activeTab === 'description' && (
        <div className="descriptionbox-description">
          {description && description.trim() ? (
            description.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <>
              <p>No description has been added for this product yet.</p>
              <p>An e-commerce website is an online platform that facilitates buying and selling of products or services over the internet.</p>
            </>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="descriptionbox-reviews">
          <div className="reviews-summary">
            <h2>{average.toFixed(1)} / 5</h2>
            <p>Based on {count} review{count !== 1 ? 's' : ''}</p>
          </div>

          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Leave a review</h3>
            <div className="review-star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= (hoverRating || myRating) ? "star filled" : "star"}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMyRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Share your thoughts about this product (optional)"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              rows={3}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          <div className="review-list">
            {loading && <p className="section-status">Loading reviews...</p>}
            {!loading && reviews.length === 0 && (
              <p className="section-status">No reviews yet. Be the first to review this product!</p>
            )}
            {reviews.map((r) => (
              <div className="review-card" key={r._id}>
                <div className="review-card-header">
                  <span className="review-author">{r.userName}</span>
                  <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="review-comment">{r.comment}</p>}
                <p className="review-date">{new Date(r.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default DescriptionBox
