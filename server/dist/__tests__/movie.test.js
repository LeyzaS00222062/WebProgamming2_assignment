"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const movie_routes_1 = __importDefault(require("../routes/movie.routes"));
const Movie_1 = __importDefault(require("../models/Movie"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/movies', movie_routes_1.default);
describe('Movie API', () => {
    let movieId;
    beforeAll(async () => {
        await mongoose_1.default.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/movie-review-test');
    });
    afterAll(async () => {
        await Movie_1.default.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    describe('GET /api/movies', () => {
        it('should return empty array when no movies', async () => {
            const response = await (0, supertest_1.default)(app).get('/api/movies');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
        it('should return all movies', async () => {
            await Movie_1.default.create({
                title: 'Test Movie',
                director: 'Test Director',
                year: 2023,
                genre: ['Action'],
                description: 'A test movie'
            });
            const response = await (0, supertest_1.default)(app).get('/api/movies');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
    });
    describe('POST /api/movies', () => {
        it('should create a new movie', async () => {
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app).get(`/api/movies/${movieId}`);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('New Movie');
        });
        it('should return 404 for non-existent movie', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app).get(`/api/movies/${fakeId}`);
            expect(response.status).toBe(404);
        });
    });
});
