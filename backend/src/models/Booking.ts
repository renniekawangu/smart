import mongoose, { Schema, Document, Model } from 'mongoose';
import { Booking, BookingStatus } from '../types/index';

interface BookingDocument extends Omit<Booking, 'id'>, Document {}

const bookingSchema = new Schema<BookingDocument>(
  {
    userId: { type: String, required: true },
    lodgingId: { type: String, required: true },
    hostId: { type: String, required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ lodgingId: 1 });
bookingSchema.index({ status: 1 });

bookingSchema.virtual('id').get(function() {
  return this._id?.toString();
});

export const BookingModel: Model<BookingDocument> = mongoose.model<BookingDocument>('Booking', bookingSchema);
