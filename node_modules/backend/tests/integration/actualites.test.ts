import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/server';

describe('Actualites API Integration Tests', () => {
  it('should fetch actualites', async () => {
    const res = await request(app).get('/api/actualites');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should require STAFF or ADMIN role for creating actualite', async () => {
    const res = await request(app).post('/api/actualites').send({
      titre: 'Test Actualite',
      contenu: 'Contenu de test',
      tags: ['Test']
    });
    // Without token, should be 401
    expect(res.status).toBe(401);
  });
});
