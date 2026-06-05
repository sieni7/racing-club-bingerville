import request from 'supertest';
import { app } from '../../src/server';
import { userService } from '../../src/services/UserService';
import { refreshTokenRepository } from '../../src/repositories/RefreshTokenRepository';

jest.mock('../../src/services/UserService', () => ({
  userService: {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn()
  }
}));

jest.mock('../../src/repositories/RefreshTokenRepository', () => ({
  refreshTokenRepository: {
    create: jest.fn(),
    findTokenByHash: jest.fn(),
    revoke: jest.fn(),
    markFamilyCompromised: jest.fn(),
    revokeFamily: jest.fn()
  }
}));

jest.mock('../../src/utils/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed'),
  comparePassword: jest.fn().mockResolvedValue(true)
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userService.createUser as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'pass', nom: 'T', prenom: 'T' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should login user and set cookie', async () => {
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed', role: 'MEMBER' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'pass' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/);
  });

  it('should logout user', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', ['refreshToken=fake_token']);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail access without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
