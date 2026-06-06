import { describe, it, expect, vi } from 'vitest';
import { statistiquesService } from './statistiquesService';
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockResolvedValue({ data: [{ joueur_id: '1', nom: 'Test', buts: 5 }], error: null })
        }))
    }
}));
describe('statistiquesService', () => {
    it('should get top buteurs', async () => {
        const data = await statistiquesService.getTopButeurs();
        expect(data[0].buts).toBe(5);
    });
    it('should get stats globales', async () => {
        const data = await statistiquesService.getStatsGlobales();
        expect(data.length).toBeGreaterThan(0);
    });
});
