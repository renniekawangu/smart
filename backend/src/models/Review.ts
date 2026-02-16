import mongoose, { Schema, Document, Model } from 'mongoose';
import { Review, SentimentLabel } from '../types/index';

interface ReviewDocument extends Omit<Review, 'id'>, Document {}

const reviewSchema = new Schema<ReviewDocument>(
  {
    userId: { type: String, required: true },
    lodgingId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    sentiment: {
      type: String,
      enum: Object.values(SentimentLabel),
      default: SentimentLabel.NEUTRAL,
    },
    sentimentScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ lodgingId: 1 });
reviewSchema.index({ rating: -1 });

reviewSchema.virtual('id').get(function() {
  return this._id?.toString();
});

export const ReviewModel: Model<ReviewDocument> = mongoose.model<ReviewDocument>('Review', reviewSchema);
