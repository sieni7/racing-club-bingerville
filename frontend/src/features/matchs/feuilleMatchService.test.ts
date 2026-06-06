import { describe, it, expect, vi } from 'vitest';
import { feuilleMatchService } from './feuilleMatchService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn((table) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
      })),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'evt1', type_evenement: 'BUT' }, error: null })
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }
}));

describe('feuilleMatchService', () => {
  it('should get composition', async () => {
    const data = await feuilleMatchService.getCompositionByMatch('1');
    expect(data).toBeDefined();
  });

  it('should upsert composition', async () => {
    await expect(feuilleMatchService.upsertComposition([])).resolves.not.toThrow();
  });

  it('should get evenements', async () => {
    const data = await feuilleMatchService.getEvenementsByMatch('1');
    expect(data).toBeDefined();
  });

  it('should create evenement', async () => {
    const data = await feuilleMatchService.createEvenement({ type_evenement: 'BUT', minute: 10 } as any);
    expect(data.type_evenement).toBe('BUT');
  });

  it('should delete evenement', async () => {
    await expect(feuilleMatchService.deleteEvenement('evt1')).resolves.not.toThrow();
  });
});
