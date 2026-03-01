import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {UUIDGenerator} from '@/pages/uuid-generator/uuid-generator.ts';
import {MantineProvider} from '@mantine/core';
import {TitleContext, TitleProvider} from "@/components/title-context";

const mockPostMessage = vi.fn();
vi.mock('@/lib/worker-utils', () => ({
  postMessage: (...args: any[]) => mockPostMessage(...args)
}));

const TitleDisplay = () => (
  <TitleContext.Consumer>
    {({ content, title }) => (
      <div>
        <h1>{title}</h1>
        <div data-testid="title-content">{content}</div>
      </div>
    )}
  </TitleContext.Consumer>
);

describe('UUIDGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock scrollIntoView which is missing in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });

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
        <TitleProvider>
          <TitleDisplay />
          <UUIDGenerator/>
        </TitleProvider>
      </MantineProvider>
    );
  };

  it('renders initial state', () => {
    renderComponent();
    expect(screen.getByTestId('version-selector')).toHaveValue('v4');
    expect(screen.getByTestId('count-input')).toHaveValue('1');
    // Initially one empty UUID field
    expect(screen.getByPlaceholderText('UUID')).toHaveValue('');
  });

  it('updates count and shows correct number of empty fields', async () => {
    renderComponent();
    const countInput = screen.getByTestId('count-input');
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
    const versionSelect = screen.getByTestId('version-selector');
    
    // For Mantine Select, if we can't reliably click the option in JSDOM,
    // we can at least test that it calls the generation with the current value.
    // To test version change, we might need to resort to a more direct approach
    // if userEvent is failing to find the option.
    
    const user = userEvent.setup();
    
    await waitFor(() => {
        expect(versionSelect).toHaveValue('v4');
    });
    
    // Try to find the option by text first if findByRole is failing
    await user.click(versionSelect);
    const option = await screen.findByText('v7');
    await user.click(option);
    
    await waitFor(() => {
        expect(versionSelect).toHaveValue('v7');
    }, { timeout: 2000 });

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    await user.click(generateBtn);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('UUID');
      expect(inputs[0]).toHaveValue('mocked-uuid-v7-0');
    }, { timeout: 2000 });
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
    const countInput = screen.getByTestId('count-input');
    fireEvent.change(countInput, {target: {value: '2'}});

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText('UUID');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toHaveValue('mocked-uuid-v4-0');
      expect(inputs[1]).toHaveValue('mocked-uuid-v4-1');
    });

    const copyAllBtn = screen.getByLabelText('Copy all UUIDs');
    await act(async () => {
      fireEvent.click(copyAllBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('mocked-uuid-v4-0\nmocked-uuid-v4-1');
  });

  it('handles generation error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });
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
