import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {UUIDGenerator} from '@/pages/uuid-generator';
import {MantineProvider} from '@mantine/core';
import {AsideProvider, useAside} from '@/components/aside-context';

// Helper component to display content from AsideProvider
function AsideDisplay() {
  const {content} = useAside();
  return <div data-testid="aside-content">{content}</div>;
}

const mockPostMessage = vi.fn();
vi.mock('@/lib/worker-utils', () => ({
  postMessage: (...args: any[]) => mockPostMessage(...args)
}));

describe('UUIDGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard API
    (navigator as any).clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    // Default mock implementation
    mockPostMessage.mockImplementation((task) => {
      return new Promise((resolve) => {
        if (task.type === 'GENERATE_UUID') {
          const result = Array(task.count).fill(0).map((_, i) => `mocked-uuid-${task.version}-${i}`);
          resolve(result);
        }
      });
    });
  });

  const renderComponent = () => {
    return render(
      <MantineProvider>
        <AsideProvider>
          <UUIDGenerator />
          <AsideDisplay />
        </AsideProvider>
      </MantineProvider>
    );
  };

  it('renders initial state', () => {
    renderComponent();
    expect(screen.getByLabelText('Version')).toHaveValue('v4');
    expect(screen.getByLabelText('Count')).toHaveValue('1');
    // Initially one empty UUID field
    expect(screen.getByPlaceholderText('UUID')).toHaveValue('');
  });

  it('updates count and shows correct number of empty fields', async () => {
    renderComponent();
    const countInput = screen.getByLabelText('Count');
    fireEvent.change(countInput, {target: {value: '3'}});

    expect(countInput).toHaveValue('3');
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('UUID')).toHaveLength(3);
    });
  });

  it('generates UUIDs when clicking Generate button', async () => {
    renderComponent();
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('UUID');
      expect(inputs[0]).toHaveValue('mocked-uuid-v4-0');
    });
  });

  it('generates UUIDs with selected version', async () => {
    renderComponent();
    const versionSelect = screen.getByLabelText('Version');
    fireEvent.change(versionSelect, {target: {value: 'v7'}});
    
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('UUID');
      expect(inputs[0]).toHaveValue('mocked-uuid-v7-0');
    });
  });

  it('copies a single UUID to clipboard', async () => {
    renderComponent();
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('UUID')).toHaveValue('mocked-uuid-v4-0');
    });

    const copyBtn = screen.getByLabelText('Copy UUID');
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked-uuid-v4-0');
  });

  it('copies all UUIDs to clipboard', async () => {
    renderComponent();
    
    // Set count to 2
    const countInput = screen.getByLabelText('Count');
    fireEvent.change(countInput, {target: {value: '2'}});

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('UUID');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toHaveValue('mocked-uuid-v4-0');
      expect(inputs[1]).toHaveValue('mocked-uuid-v4-1');
    });

    const copyAllBtn = screen.getByLabelText('Copy All');
    await act(async () => {
      fireEvent.click(copyAllBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked-uuid-v4-0\nmocked-uuid-v4-1');
  });

  it('handles generation error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockPostMessage.mockRejectedValue(new Error('Generation failed'));

    renderComponent();
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});
