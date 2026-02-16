import React, { useState } from 'react';
import { useCreateReview } from '../hooks/useReviews';

interface ReviewFormProps {
  lodgingId: string;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ lodgingId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { mutateAsync: createReview, isPending } = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        lodgingId,
        rating,
        comment,
        userId: '', // Will be set from auth context
      });
      setRating(5);
      setComment('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-4">
      <h3 className="text-lg font-bold mb-4 text-white">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-white text-opacity-90">Rating (1-5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r} className="bg-gray-900">{r} Star{r !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-white text-opacity-90">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50"
          rows={4}
          required
          placeholder="Share your experience..."
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 bg-opacity-80 text-white py-2 rounded hover:bg-opacity-100 transition-all disabled:opacity-50"
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
