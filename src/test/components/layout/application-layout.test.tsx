import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MantineProvider} from '@mantine/core';
import {MemoryRouter} from 'react-router-dom';
import {ApplicationLayout} from '@/components/layout/application-layout.tsx';
import {describe, expect, it, vi} from 'vitest';
import type {ReactNode} from "react";

// Mocking scrollIntoView as it's not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();

function TestWrapper({children}: { children: ReactNode }) {
  return (
    <MantineProvider>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </MantineProvider>
  );
}

describe('ApplicationLayout', () => {
  it('opens search dropdown when search field is clicked', async () => {
    render(
      <TestWrapper>
        <ApplicationLayout>
          <div>Content</div>
        </ApplicationLayout>
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search');

    // Dropdown should be closed initially
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.click(searchInput);

    await waitFor(() => {
      expect(searchInput).toHaveAttribute('data-expanded');
    });
  });

  it('clears input, opens dropdown and focuses input when ctrl+K is pressed', async () => {
    render(
      <TestWrapper>
        <ApplicationLayout>
          <div>Content</div>
        </ApplicationLayout>
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search') as HTMLInputElement;

    // Type something first to test clearing
    await userEvent.type(searchInput, 'test');
    expect(searchInput.value).toBe('test');

    await userEvent.keyboard('{Control>}k{/Control}');

    expect(searchInput.value).toBe('');
    expect(document.activeElement).toBe(searchInput);

    await waitFor(() => {
      expect(searchInput).toHaveAttribute('data-expanded');
    });
  });
});
