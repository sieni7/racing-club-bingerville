import request from 'supertest';
import { app } from '../../src/server';

jest.mock('../../src/repositories/MatchRepository', () => ({
  matchRepository: {
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
  }
}));

describe('Match API', () => {
  it('should list matchs', async () => {
    const response = await request(app).get('/api/matchs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
