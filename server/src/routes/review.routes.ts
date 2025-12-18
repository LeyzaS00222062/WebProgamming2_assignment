import { Router, Request, Response } from 'express';
import Review from '../models/Review';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get reviews for a movie
router.get('/movie/:movieId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create review (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, rating, reviewText } = req.body;
    
    const review = new Review({
      movieId,
      userId: req.userId,
      rating,
      reviewText
    });
    
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user's reviews
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('movieId', 'title posterUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;