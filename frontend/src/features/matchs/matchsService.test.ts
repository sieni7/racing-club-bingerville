import { describe, it, expect, vi } from 'vitest';
import { matchsService } from './matchsService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: [{ id: '1', adversaire: 'Test FC' }], error: null }),
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '1', adversaire: 'Test FC' }, error: null })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '2', adversaire: 'New FC' }, error: null })
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: '1', adversaire: 'Updated FC' }, error: null })
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }
}));

describe('matchsService', () => {
  it('should get all matchs', async () => {
    const data = await matchsService.getAll();
    expect(data).toHaveLength(1);
    expect(data[0].adversaire).toBe('Test FC');
  });

  it('should get match by id', async () => {
    const data = await matchsService.getById('1');
    expect(data.adversaire).toBe('Test FC');
  });

  it('should create a match', async () => {
    const data = await matchsService.create({ adversaire: 'New FC' } as any);
    expect(data.adversaire).toBe('New FC');
  });

  it('should update a match', async () => {
    const data = await matchsService.update('1', { adversaire: 'Updated FC' });
    expect(data.adversaire).toBe('Updated FC');
  });

  it('should delete a match', async () => {
    await expect(matchsService.delete('1')).resolves.not.toThrow();
  });
});
