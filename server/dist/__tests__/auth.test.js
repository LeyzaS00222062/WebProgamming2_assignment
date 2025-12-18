"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
describe('Authentication API', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/movie-review-test');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        });
        it('should not register duplicate user', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                username: 'duplicate',
                email: 'duplicate@example.com',
                password: 'password123'
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                username: 'duplicate',
                email: 'duplicate@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });
        it('should validate required fields', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                email: 'incomplete@example.com'
            });
            expect(response.status).toBe(500);
        });
    });
    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            });
        });
        it('should login with correct credentials', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('login@example.com');
        });
        it('should reject invalid credentials', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'wrongpassword'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });
        it('should reject non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});
