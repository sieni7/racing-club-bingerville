import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/server';

describe('Stats API Integration Tests', () => {
  it('should fetch top buteurs', async () => {
    const res = await request(app).get('/api/stats/buteurs?saison=2023-2024');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch top passeurs', async () => {
    const res = await request(app).get('/api/stats/passeurs?saison=2023-2024');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should require ADMIN role for recalculate', async () => {
    const res = await request(app).post('/api/stats/recalculate/2023-2024');
    // Without token, should be 401
    expect(res.status).toBe(401);
  });
});
