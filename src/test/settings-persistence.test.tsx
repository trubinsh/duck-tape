import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type MantineColorScheme, MantineProvider} from '@mantine/core';
import {type InitialEntry, MemoryRouter, Route, Routes} from 'react-router-dom';
import {ApplicationLayout} from '../components/layout/application-layout.tsx';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {SETTINGS_KEY, SettingsProvider} from '../lib/settings.ts';
import type {ReactNode} from "react";

// Mocking scrollIntoView as it's not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();

function TestWrapper({
                       children,
                       initialEntries = undefined,
                       defaultColorScheme = undefined
                     }: {
  children: ReactNode,
  initialEntries?: InitialEntry[] | undefined,
  defaultColorScheme?: MantineColorScheme | undefined
}) {
  return (
    <SettingsProvider>
      <MantineProvider defaultColorScheme={defaultColorScheme}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </MantineProvider>
    </SettingsProvider>
  );
}

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
      <TestWrapper initialEntries={['/']}>
        <ApplicationLayout>
          <Routes>
            <Route path="/" element={<div>Home</div>}/>
            <Route path="/formatter" element={<div>Generator Page</div>}/>
          </Routes>
        </ApplicationLayout>
      </TestWrapper>
    );

    // Should initially save '/'
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({lastPage: '/'});
    });

    // Click on PasswordGenerator link in the navbar
    const generatorNavLink = screen.getAllByText('JSON Formatter').find(el => el.closest('a'));
    if (!generatorNavLink) throw new Error('Generator link not found');
    await userEvent.click(generatorNavLink);

    expect(screen.getByText('Generator Page')).toBeInTheDocument();

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({lastPage: '/formatter'});
    });
  });

  it('restores the last visited page from localStorage on initial load', async () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      lastPage: '/generator',
      theme: 'dark'
    }));

    render(
      <TestWrapper initialEntries={['/']}>
        <ApplicationLayout>
          <Routes>
            <Route path="/" element={<div>Home</div>}/>
            <Route path="/generator" element={<div>Generator Page</div>}/>
          </Routes>
        </ApplicationLayout>
      </TestWrapper>
    );

    // It should redirect to /generator
    await waitFor(() => {
      expect(screen.getByText('Generator Page')).toBeInTheDocument();
    });
  });

  it('saves the theme to localStorage when changed', async () => {
    render(
      <TestWrapper defaultColorScheme="dark">
        <ApplicationLayout>
          <div>Content</div>
        </ApplicationLayout>
      </TestWrapper>
    );

    const settingsButton = screen.getByLabelText('Open settings');
    await userEvent.click(settingsButton);

    const themeToggle = await screen.findByLabelText('Toggle color scheme');
    if (!themeToggle) throw new Error('Theme toggle not found');

    // Click to toggle to light
    await userEvent.click(themeToggle);

    // Click Save
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({
        general: { theme: 'light' }
      });
    });

    await userEvent.click(settingsButton);
    const themeToggle2 = await screen.findByLabelText('Toggle color scheme');
    await userEvent.click(themeToggle2!);
    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toMatchObject({
        general: { theme: 'dark' }
      });
    });
  });
});
