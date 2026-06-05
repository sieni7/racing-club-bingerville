import request from 'supertest';
import { app } from '../../src/server';

// We mock the database connection and repository to avoid connecting to a real DB during tests
jest.mock('../../src/repositories/UserRepository', () => ({
  userRepository: {
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: '123', email: 'test@test.com' })
  }
}));

describe('User API', () => {
  it('should list users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return 404 for unknown user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
  });
});
