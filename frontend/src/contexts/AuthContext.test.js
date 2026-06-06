import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
        }
    }
}));
describe('AuthContext', () => {
    it('should initialize with no user', async () => {
        const wrapper = ({ children }) => _jsx(AuthProvider, { children: children });
        const { result } = renderHook(() => useAuth(), { wrapper });
        // Wait for the effect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        expect(result.current.user).toBeNull();
        expect(result.current.session).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });
});
