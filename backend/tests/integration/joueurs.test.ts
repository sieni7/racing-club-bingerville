import request from 'supertest';
import { app } from '../../src/server';
import mongoose from 'mongoose';

describe('Joueurs API', () => {
  it('GET /api/joueurs should return 200', async () => {
    const res = await request(app).get('/api/joueurs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/joueurs/:id should return 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/joueurs/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('POST /api/joueurs should fail without auth', async () => {
    const res = await request(app).post('/api/joueurs').send({});
    expect(res.status).toBe(401);
  });

  it('PUT /api/joueurs/:id should fail without auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/joueurs/${fakeId}`).send({});
    expect(res.status).toBe(401);
  });

  it('DELETE /api/joueurs/:id should fail without auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/joueurs/${fakeId}`);
    expect(res.status).toBe(401);
  });
});
