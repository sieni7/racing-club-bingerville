import request from 'supertest';
import { app } from '../../src/server';
import Match from '../../src/models/Match';
import Joueur from '../../src/models/Joueur';
import mongoose from 'mongoose';

describe('Matchs API', () => {
  beforeAll(async () => {
    // MongoDB Memory Server is already handled globally in test setup
  });

  afterAll(async () => {
    // Global teardown handles db drop
  });

  beforeEach(async () => {
    await Match.deleteMany({});
    await Joueur.deleteMany({});
  });

  const mockMatch = {
    date: new Date().toISOString(),
    adversaire: 'Asec Mimosas',
    lieu: 'DOMICILE',
    saison: '2025-2026',
    statut: 'PROGRAMME'
  };

  it('GET /api/matchs should return 200 and empty array', async () => {
    const res = await request(app).get('/api/matchs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /api/matchs/:id should return 404 for non-existent match', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/matchs/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('POST /api/matchs should fail without auth', async () => {
    const res = await request(app).post('/api/matchs').send(mockMatch);
    expect(res.status).toBe(401);
  });

  it('PUT /api/matchs/:id/composition should fail without auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/matchs/${fakeId}/composition`).send({ composition: [] });
    expect(res.status).toBe(401);
  });

  it('POST /api/matchs/:id/events should fail without auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).post(`/api/matchs/${fakeId}/events`).send({
      type: 'BUT',
      joueurId: new mongoose.Types.ObjectId().toString(),
      minute: 15
    });
    expect(res.status).toBe(401);
  });
});
