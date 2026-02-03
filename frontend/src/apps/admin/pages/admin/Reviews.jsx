import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Reviews.css';

const Reviews = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await apiService.getFeedbacks();
                setFeedbacks(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
                setError("Failed to load reviews. Please try again later.");
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return <div className="loading-spinner">Loading reviews...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="reviews-page">
            <header className="page-header">
                <h1>User Reviews & Feedback</h1>
                <p>Manage and monitor user feedback regarding parking experiences.</p>
            </header>

            <div className="reviews-stats">
                <div className="stat-card">
                    <h3>Total Reviews</h3>
                    <div className="stat-value">{feedbacks.length}</div>
                </div>
                <div className="stat-card">
                    <h3>Average Rating</h3>
                    <div className="stat-value">
                        {feedbacks.length > 0
                            ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
                            : 'N/A'}
                        <span className="star-icon">★</span>
                    </div>
                </div>
            </div>

            <div className="reviews-list">
                {feedbacks.length === 0 ? (
                    <div className="no-reviews">No reviews found.</div>
                ) : (
                    feedbacks.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="user-info">
                                    <span className="vehicle-badge">{review.vehicle_number || 'Unknown Vehicle'}</span>
                                    <span className="review-date">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="review-content">
                                <p>"{review.comment || 'No comment provided.'}"</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
