import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  director: string;
  year: number;
  genre: string[];
  description: string;
  posterUrl?: string;
  createdAt: Date;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
  genre: [{ type: String }],
  description: { type: String, required: true },
  posterUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMovie>('Movie', MovieSchema);