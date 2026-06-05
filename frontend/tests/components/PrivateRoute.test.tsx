import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { PrivateRoute } from '../../src/components/Auth/PrivateRoute';
import * as useAuthHook from '../../src/hooks/useAuth';

// Mock du hook useAuth
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('PrivateRoute', () => {
  it('redirects to login when not authenticated', () => {
    (useAuthHook.useAuth as any).mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/protected" element={<PrivateRoute><TestComponent /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    (useAuthHook.useAuth as any).mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/protected" element={<PrivateRoute><TestComponent /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
