import mongoose from 'mongoose';
import Movie from './models/Movie';
import dotenv from 'dotenv';
import { title } from 'process';

dotenv.config();

const movies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    year: 1994,
    genre: ['Drama'],
    description: 'Two imprisoned men bond over years...',
    posterUrl: 'https://example.com/poster1.jpg'
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    year: 1972,
    genre: ['Crime', 'Drama'],
    description: 'The aging patriarch of an organized crime dynasty...',
    posterUrl: 'https://example.com/poster2.jpg'
  },
  {
    title: 'Jennifer\'s Body',
    director: 'Karyn Kusama',
    year: 2009,
    genre: ['Horror', 'Comedy'],
    description: 'A high school girl becomes possessed by a demon...',
    posterUrl: 'https://example.com/poster3.jpg'
  },
{
    title: 'Hunger Games',
    director: 'Gary Ross',
    year: 2012,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'In a dystopian future, teenagers are forced to fight to the death...',
    posterUrl: 'https://example.com/poster4.jpg'
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review');
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();