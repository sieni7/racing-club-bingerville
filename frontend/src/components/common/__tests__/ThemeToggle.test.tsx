import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../../../contexts/ThemeContext';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset window attributes and localStorage
    localStorage.clear();
    document.documentElement.className = '';
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const renderWithProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  it('renders the toggle button with aria-label', () => {
    renderWithProvider();
    const button = screen.getByRole('button', { name: /changer le thème/i });
    expect(button).toBeDefined();
  });

  it('initializes with system theme by default', () => {
    renderWithProvider();
    // System theme (if false) defaults to light. Root should have class 'light'
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme-preference')).toBe('system');
  });

  it('toggles theme when clicked', () => {
    renderWithProvider();
    const button = screen.getByRole('button', { name: /changer le thème/i });
    
    // Default is system (light) -> Click -> light
    fireEvent.click(button);
    expect(localStorage.getItem('theme-preference')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Click again -> dark
    fireEvent.click(button);
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Click again -> system
    fireEvent.click(button);
    expect(localStorage.getItem('theme-preference')).toBe('system');
  });
});
