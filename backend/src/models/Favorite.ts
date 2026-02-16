import mongoose, { Schema, Document, Model } from 'mongoose';

interface FavoriteDocument extends Document {
  userId: string;
  lodgingId: string;
  createdAt: Date;
}

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    userId: { type: String, required: true, index: true },
    lodgingId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicates
favoriteSchema.index({ userId: 1, lodgingId: 1 }, { unique: true });

export const FavoriteModel: Model<FavoriteDocument> = mongoose.model<FavoriteDocument>('Favorite', favoriteSchema);
