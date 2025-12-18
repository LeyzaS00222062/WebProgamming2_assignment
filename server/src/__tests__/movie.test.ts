import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import movieRoutes from '../routes/movie.routes';
import Movie from '../models/Movie';

const app = express();
app.use(express.json());
app.use('/api/movies', movieRoutes);

describe('Movie API', () => {
  let movieId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/movie-review-test');
  });

  afterAll(async () => {
    await Movie.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/movies', () => {
    it('should return empty array when no movies', async () => {
      const response = await request(app).get('/api/movies');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all movies', async () => {
      await Movie.create({
        title: 'Test Movie',
        director: 'Test Director',
        year: 2023,
        genre: ['Action'],
        description: 'A test movie'
      });

      const response = await request(app).get('/api/movies');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie', async () => {
      const response = await request(app)
        .post('/api/movies')
        .send({
          title: 'New Movie',
          director: 'Director Name',
          year: 2024,
          genre: ['Drama', 'Thriller'],
          description: 'An exciting new movie'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Movie');
      movieId = response.body._id;
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should return a single movie', async () => {
      const response = await request(app).get(`/api/movies/${movieId}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New Movie');
    });

    it('should return 404 for non-existent movie', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/movies/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
