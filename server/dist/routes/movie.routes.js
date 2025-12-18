"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Movie_1 = __importDefault(require("../models/Movie"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie_1.default.find().sort({ createdAt: -1 });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie_1.default.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Create movie (protected route)
router.post('/', auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const movie = new Movie_1.default(req.body);
        await movie.save();
        res.status(201).json(movie);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
