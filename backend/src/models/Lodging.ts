import mongoose, { Schema, Document, Model } from 'mongoose';
import { Lodging, AvailabilitySlot } from '../types/index';

interface LodgingDocument extends Omit<Lodging, 'id'>, Document {}

const availabilitySlotSchema = new Schema<AvailabilitySlot>({
  date: { type: String, required: true },
  available: { type: Boolean, default: true },
  rooms: { type: Number, default: 1 },
}, { _id: false });

const lodgingSchema = new Schema<LodgingDocument>(
  {
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String, required: true },
    hostId: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    amenities: [String],
    price: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    images: [String],
    availability: [availabilitySlotSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

lodgingSchema.virtual('id').get(function() {
  return this._id?.toString();
});

lodgingSchema.index({ 'location.city': 1 });
lodgingSchema.index({ price: 1 });
lodgingSchema.index({ rating: -1 });

lodgingSchema.virtual('id').get(function() {
  return this._id?.toString();
});

export const LodgingModel: Model<LodgingDocument> = mongoose.model<LodgingDocument>('Lodging', lodgingSchema);
