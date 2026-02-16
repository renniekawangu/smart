import mongoose, { Schema, Document, Model } from 'mongoose';
import { User, UserPreferences } from '../types/index';

interface UserDocument extends Omit<User, 'id'>, Document {}

const userPreferencesSchema = new Schema<UserPreferences>({
  budget: {
    min: Number,
    max: Number,
  },
  location: String,
  amenities: [String],
  roomType: String,
  notifications: { type: Boolean, default: true },
}, { _id: false });

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client', 'host'], default: 'client' },
    preferences: userPreferencesSchema,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.virtual('id').get(function() {
  return this._id?.toString();
});

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
