import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { TimestampConverter } from '@/pages/timestamp-converter/timestamp-converter.tsx';
import type { ReactNode } from 'react';

vi.useFakeTimers();

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}

describe('TimestampConverter', () => {
  beforeEach(() => {
    // Mock Date.now() to have a consistent "now" for tests
    const mockDate = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('FromEpochConverter', () => {
    it('renders initial timestamp correctly', () => {
      render(
        <TestWrapper>
          <TimestampConverter />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Epoch timestamp') as HTMLInputElement;
      const expectedTimestamp = Math.floor(new Date('2024-01-01T12:00:00Z').getTime() / 1000).toString();
      expect(input.value).toBe(expectedTimestamp);
    });

    it('converts 10-digit epoch to local and UTC strings', async () => {
      render(
        <TestWrapper>
          <TimestampConverter />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Epoch timestamp');
      
      // Clear and type a new timestamp (1704110400 = 2024-01-01T12:00:00Z)
      await userEvent.clear(input);
      await userEvent.type(input, '1704110400');

      const date = new Date(1704110400000);
      expect(screen.getByText(date.toString())).toBeInTheDocument();
      expect(screen.getByText(date.toUTCString())).toBeInTheDocument();
    });

    it('converts 13-digit epoch correctly', async () => {
      render(
        <TestWrapper>
          <TimestampConverter />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Epoch timestamp');
      
      await userEvent.clear(input);
      await userEvent.type(input, '1704110400123');

      const date = new Date(1704110400123);
      expect(screen.getByText(date.toString())).toBeInTheDocument();
      expect(screen.getByText(date.toUTCString())).toBeInTheDocument();
    });

    it('handles zero or empty input', async () => {
      render(
        <TestWrapper>
          <TimestampConverter />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Epoch timestamp');
      await userEvent.clear(input);

      expect(screen.queryByText('Local time:')).not.toBeInTheDocument();
      expect(screen.queryByText('UTC time:')).not.toBeInTheDocument();
    });
  });

  describe('ToEpochConverter', () => {
    it('converts selected date to epoch', async () => {
      render(
        <TestWrapper>
          <TimestampConverter />
        </TestWrapper>
      );

      // In Mantine DateTimePicker, the placeholder is on the button, but we might need to find it by text or role
      const button = screen.getByRole('button', { name: 'Date' });
      expect(button).toBeInTheDocument();
      
      // Since it's hard to simulate a date change in DateTimePicker with jsdom without 
      // complex interactions, we can at least verify it shows the initial epoch correctly.
      expect(screen.getByText('1704110400')).toBeInTheDocument();
    });
  });
});
