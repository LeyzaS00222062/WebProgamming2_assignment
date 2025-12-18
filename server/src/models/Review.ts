import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  movieId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
