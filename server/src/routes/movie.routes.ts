import { Router, Request, Response } from 'express';
import Movie from '../models/Movie';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get all movies
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single movie
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create movie (protected route)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
