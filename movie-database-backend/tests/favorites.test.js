const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Make sure this path is correct
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Favorites API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create a test user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    userId = user._id;

    // Login to get a token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('GET /api/favorites should return empty array for new user', async () => {
    const response = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/favorites should add a movie to favorites', async () => {
    const movieId = '123456789012345678901234'; // Example MongoDB ObjectId

    const response = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(movieId);
  });

  test('POST /api/favorites should not add duplicate movie', async () => {
    const movieId = '123456789012345678901234';

    // Add movie first time
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId });

    // Try to add same movie again
    const response = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Movie already in favorites');
  });

  test('DELETE /api/favorites/:movieId should remove a movie from favorites', async () => {
    const movieId = '123456789012345678901234';

    // Add movie to favorites
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId });

    // Remove movie from favorites
    const response = await request(app)
      .delete(`/api/favorites/${movieId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContain(movieId);
  });
});