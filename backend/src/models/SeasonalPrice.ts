import mongoose, { Schema, Document, Model } from 'mongoose';

interface SeasonalPriceDocument extends Document {
  lodgingId: string;
  startDate: string;
  endDate: string;
  pricePerNight: number;
  name: string;
  createdAt: Date;
}

const seasonalPriceSchema = new Schema<SeasonalPriceDocument>(
  {
    lodgingId: { type: String, required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    name: { type: String, default: 'Seasonal Rate' },
  },
  {
    timestamps: true,
  }
);

export const SeasonalPriceModel: Model<SeasonalPriceDocument> = mongoose.model<SeasonalPriceDocument>('SeasonalPrice', seasonalPriceSchema);
