import React, { useState } from 'react';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onLoadMore, isLoading }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-bold text-white">Rating: {review.rating}/5</span>
              <p className="text-xs text-white text-opacity-70 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              review.sentiment === 'positive' ? 'bg-green-500 bg-opacity-80 text-white' :
              review.sentiment === 'negative' ? 'bg-red-500 bg-opacity-80 text-white' :
              'bg-gray-500 bg-opacity-80 text-white'
            }`}>
              {review.sentiment}
            </span>
          </div>
          <p className="text-sm text-white text-opacity-80">{review.comment}</p>
          <p className="text-xs text-white text-opacity-70 mt-2">Confidence: {(review.sentimentScore * 100).toFixed(0)}%</p>
        </div>
      ))}
      {onLoadMore && (
        <button onClick={onLoadMore} disabled={isLoading} className="w-full py-2 border rounded bg-white bg-opacity-10 hover:bg-opacity-20 border-white border-opacity-20 text-white transition-all">
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
