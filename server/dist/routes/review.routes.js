"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Review_1 = __importDefault(require("../models/Review"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ movieId: req.params.movieId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Create review (protected)
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { movieId, rating, reviewText } = req.body;
        const review = new Review_1.default({
            movieId,
            userId: req.userId,
            rating,
            reviewText
        });
        await review.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get user's reviews
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ userId: req.params.userId })
            .populate('movieId', 'title posterUrl')
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
