import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
  PasswordGenerator
} from '@/pages/password-generator/password-generator.tsx';
import {MantineProvider} from '@mantine/core';
import {TitleContext, TitleProvider} from "@/components/title-context";
import {SettingsProvider} from "@/lib/settings.ts";

const mockPostMessage = vi.fn();
vi.mock('@/lib/worker-utils', () => ({
  postMessage: (...args: any[]) => mockPostMessage(...args)
}));

const TitleDisplay = () => (
  <TitleContext.Consumer>
    {({content, title}) => (
      <div>
        <h1>{title}</h1>
        <div data-testid="title-content">{content}</div>
      </div>
    )}
  </TitleContext.Consumer>
);

describe('PasswordGenerator', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });

    // Deterministic mock implementation
    mockPostMessage.mockImplementation((task) => {
      return new Promise((resolve, reject) => {
        if (task.type === 'GENERATE_PASSWORD') {
          const ch = (task.characters?.join('') || 'x');
          const base = ch.length > 0 ? ch[0] : 'x';
          resolve(base.repeat(task.length));
        } else {
          reject(new Error('Unknown task'));
        }
      });
    });
  });

  const renderComponent = () => {
    return render(
      <MantineProvider>
        <SettingsProvider>
          <TitleProvider>
            <TitleDisplay/>
            <PasswordGenerator/>
          </TitleProvider>
        </SettingsProvider>
      </MantineProvider>
    );
  };

  it('renders initial state', () => {
    renderComponent();
    expect(screen.getByTestId('length-input')).toHaveValue('16');
    expect(screen.getByLabelText('Generated password')).toHaveValue('');
  });

  it('generates password when clicking Generate button', async () => {
    renderComponent();
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const textarea = screen.getByLabelText('Generated password') as HTMLTextAreaElement;
      expect(textarea.value).not.toBe('');
      expect(textarea.value.length).toBe(16);
    });
  });

  it('respects length change', async () => {
    renderComponent();
    const lengthInput = screen.getByTestId('length-input');
    fireEvent.change(lengthInput, {target: {value: '24'}});

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const textarea = screen.getByLabelText('Generated password') as HTMLTextAreaElement;
      expect(textarea.value.length).toBe(24);
    });
  });

  it('copies password to clipboard', async () => {
    renderComponent();

    // First generate a password
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    let password = '';
    await waitFor(() => {
      password = (screen.getByLabelText('Generated password') as HTMLTextAreaElement).value;
      expect(password).not.toBe('');
    });

    const copyBtn = screen.getByLabelText('Copy password');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(password);
  });

  it('handles worker error', async () => {
    mockPostMessage.mockRejectedValue(new Error('Generation failed'));

    renderComponent();
    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    // Should stay empty or clear
    await waitFor(() => {
      expect(screen.getByLabelText('Generated password')).toHaveValue('');
    });
  });
});
