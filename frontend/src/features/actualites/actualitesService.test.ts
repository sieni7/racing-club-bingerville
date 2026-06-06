import { describe, it, expect, vi } from 'vitest';
import { actualitesService } from './actualitesService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({ data: [{ id: '1', titre: 'News 1' }], error: null }),
          limit: vi.fn().mockResolvedValue({ data: [{ id: '1', titre: 'News 1' }], error: null })
        })),
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ data: [{ id: '1', titre: 'News 1' }], error: null })
          })),
          single: vi.fn().mockResolvedValue({ data: { id: '1', slug: 'news-1' }, error: null })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '2', titre: 'News 2' }, error: null })
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: '1', titre: 'News Updated' }, error: null })
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }
}));

describe('actualitesService', () => {
  it('should get all news', async () => {
    const data = await actualitesService.getAll();
    expect(data.length).toBeGreaterThan(0);
  });

  it('should get latest news', async () => {
    const data = await actualitesService.getLatest();
    expect(data.length).toBeGreaterThan(0);
  });

  it('should get news by slug', async () => {
    const data = await actualitesService.getBySlug('news-1');
    expect(data.slug).toBe('news-1');
  });

  it('should create news', async () => {
    const data = await actualitesService.create({ titre: 'News 2' });
    expect(data.titre).toBe('News 2');
  });

  it('should update news', async () => {
    const data = await actualitesService.update('1', { titre: 'News Updated' });
    expect(data.titre).toBe('News Updated');
  });

  it('should delete news', async () => {
    await expect(actualitesService.delete('1')).resolves.not.toThrow();
  });
});
