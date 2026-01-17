import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ApplicationLayout } from '../components/layout/application-layout.tsx';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SETTINGS_KEY } from '../lib/settings.ts';

// Mocking scrollIntoView as it's not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();

describe('ApplicationLayout Settings Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('saves the last visited page to localStorage', async () => {
    render(
      <MantineProvider>
        <MemoryRouter initialEntries={['/']}>
          <ApplicationLayout>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/generator" element={<div>Generator Page</div>} />
            </Routes>
          </ApplicationLayout>
        </MemoryRouter>
      </MantineProvider>
    );

    // Should initially save '/'
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ lastPage: '/' });

    // Click on Generator link in the navbar
    const generatorNavLink = screen.getAllByText('Generator').find(el => el.closest('a'));
    if (!generatorNavLink) throw new Error('Generator link not found');
    await userEvent.click(generatorNavLink);

    expect(screen.getByText('Generator Page')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ lastPage: '/generator' });
    });
  });

  it('restores the last visited page from localStorage on initial load', async () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ lastPage: '/generator', theme: 'dark' }));

    render(
      <MantineProvider>
        <MemoryRouter initialEntries={['/']}>
          <ApplicationLayout>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/generator" element={<div>Generator Page</div>} />
            </Routes>
          </ApplicationLayout>
        </MemoryRouter>
      </MantineProvider>
    );

    // It should redirect to /generator
    await waitFor(() => {
      expect(screen.getByText('Generator Page')).toBeInTheDocument();
    });
  });

  it('saves the theme to localStorage when changed', async () => {
    render(
      <MantineProvider defaultColorScheme="dark">
        <MemoryRouter>
          <ApplicationLayout>
            <div>Content</div>
          </ApplicationLayout>
        </MemoryRouter>
      </MantineProvider>
    );

    const themeToggle = screen.getByLabelText('Toggle color scheme');
    
    // Initial theme might be 'dark' (as per default)
    // Click to toggle to light
    await userEvent.click(themeToggle);

    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ theme: 'light' });

    // Click again to toggle back to dark
    await userEvent.click(themeToggle);
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({ theme: 'dark' });
  });
});
