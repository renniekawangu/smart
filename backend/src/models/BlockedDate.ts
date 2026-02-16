import mongoose, { Schema, Document, Model } from 'mongoose';

interface BlockedDateDocument extends Document {
  lodgingId: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: Date;
}

const blockedDateSchema = new Schema<BlockedDateDocument>(
  {
    lodgingId: { type: String, required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, default: 'Blocked' },
  },
  {
    timestamps: true,
  }
);

export const BlockedDateModel: Model<BlockedDateDocument> = mongoose.model<BlockedDateDocument>('BlockedDate', blockedDateSchema);
