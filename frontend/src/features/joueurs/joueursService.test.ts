import { describe, it, expect, vi } from 'vitest';
import { joueursService } from './joueursService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: [{ id: '1', nom: 'Test' }], error: null }),
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '1', nom: 'Test' }, error: null })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '2', nom: 'New' }, error: null })
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: '1', nom: 'Updated' }, error: null })
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }
}));

describe('joueursService', () => {
  it('should get all joueurs', async () => {
    const data = await joueursService.getAll();
    expect(data).toHaveLength(1);
    expect(data[0].nom).toBe('Test');
  });

  it('should get joueur by id', async () => {
    const data = await joueursService.getById('1');
    expect(data.nom).toBe('Test');
  });

  it('should create a joueur', async () => {
    const data = await joueursService.create({ nom: 'New' } as any);
    expect(data.nom).toBe('New');
  });

  it('should update a joueur', async () => {
    const data = await joueursService.update('1', { nom: 'Updated' });
    expect(data.nom).toBe('Updated');
  });

  it('should delete a joueur', async () => {
    await expect(joueursService.delete('1')).resolves.not.toThrow();
  });
});

