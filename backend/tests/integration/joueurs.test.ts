import request from 'supertest';
import { app } from '../../src/server';

jest.mock('../../src/repositories/JoueurRepository', () => ({
  joueurRepository: {
    findAll: jest.fn().mockResolvedValue([]),
    findByStatut: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue(null),
  }
}));

describe('Joueur API', () => {
  it('should list joueurs', async () => {
    const response = await request(app).get('/api/joueurs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
