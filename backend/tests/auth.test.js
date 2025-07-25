import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth.js';
import cookieParser from 'cookie-parser';
import User from '../src/models/User.js';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});
afterAll(async () => {
	await mongoose.connection.db.dropDatabase();
	await mongoose.disconnect();
});
afterEach(async () => {
	await User.deleteMany({});
});

describe('Auth API', () => {
	it('should register a new user', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ email: 'test@example.com', password: 'password123' });
		expect(res.statusCode).toBe(201);
	});

	it('should not register with invalid email', async () => {
		const res = await request(app)
			.post('/api/auth/register')
			.send({ email: 'bad', password: 'password123' });
		expect(res.statusCode).toBe(400);
	});

	it('should login and set httpOnly cookie', async () => {
		await request(app)
			.post('/api/auth/register')
			.send({ email: 'test2@example.com', password: 'password123' });
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'test2@example.com', password: 'password123' });
		expect(res.statusCode).toBe(200);
		expect(res.headers['set-cookie']).toBeDefined();
	});

	it('should not login with wrong password', async () => {
		await request(app)
			.post('/api/auth/register')
			.send({ email: 'test3@example.com', password: 'password123' });
		const res = await request(app)
			.post('/api/auth/login')
			.send({ email: 'test3@example.com', password: 'wrongpass' });
		expect(res.statusCode).toBe(401);
	});
}); 