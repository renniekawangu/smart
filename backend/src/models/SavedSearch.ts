import { Schema, model, Document } from 'mongoose';

export interface SavedSearchDocument extends Document {
  userId: string;
  name: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  minRating?: number;
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema = new Schema<SavedSearchDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    location: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    amenities: [{ type: String }],
    minRating: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    numberOfGuests: { type: Number },
  },
  { timestamps: true }
);

SavedSearchSchema.index({ userId: 1, createdAt: -1 });

export const SavedSearchModel = model<SavedSearchDocument>(
  'SavedSearch',
  SavedSearchSchema
);
