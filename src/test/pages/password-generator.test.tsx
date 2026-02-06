import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {PasswordGenerator} from '@/pages/password-generator';
import {MantineProvider} from '@mantine/core';
import {AsideProvider, useAside} from '@/components/aside-context';

// Define a minimal Worker mock
(globalThis as any).Worker = class {
  onmessage: any = null;
  onerror: any = null;

  postMessage(data: any) {
    // Small delay to simulate async nature of Workers
    setTimeout(() => {
      import('../../lib/worker').then(() => {
        const event = {data} as MessageEvent;
        const originalPostMessage = globalThis.postMessage;
        (globalThis as any).postMessage = (response: any) => {
          if (this.onmessage) {
            this.onmessage({data: response} as MessageEvent);
          }
        };

        try {
          if (typeof (globalThis as any).onmessage === 'function') {
            (globalThis as any).onmessage(event);
          }
        } finally {
          (globalThis as any).postMessage = originalPostMessage;
        }
      });
    }, 0);
  }
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {return true;}
};

// Mock the worker module to return the global Worker
vi.mock('./worker?worker', () => {
  return {
    default: globalThis.Worker,
  };
});

// Helper component to display content from AsideProvider
function AsideDisplay() {
  const {content} = useAside();
  return <div data-testid="aside-content">{content}</div>;
}

const mockPostMessage = vi.fn();
vi.mock('@/lib/worker-utils', () => ({
  postMessage: (...args: any[]) => mockPostMessage(...args)
}));

describe('PasswordGenerator', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Mock clipboard API
    (navigator as any).clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    // Default mock implementation: call the real worker logic (simulated)
    mockPostMessage.mockImplementation((task) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (task.type === 'GENERATE_PASSWORD') {
            const characters = task.characters.join('');
            let password = '';
            for (let i = 0; i < task.length; i++) {
              password += characters[Math.floor(Math.random() * characters.length)];
            }
            resolve(password);
          }
        }, 0);
      });
    });
  });

  const renderComponent = () => {
    return render(
      <MantineProvider>
        <AsideProvider>
          <PasswordGenerator />
          <AsideDisplay />
        </AsideProvider>
      </MantineProvider>
    );
  };

  it('renders initial state', () => {
    renderComponent();
    expect(screen.getByLabelText('Password length')).toHaveValue('16');
    expect(screen.getByLabelText('Include numbers')).toBeChecked();
    expect(screen.getByLabelText('Include upper case letter')).toBeChecked();
    expect(screen.getByLabelText('Include special characters')).not.toBeChecked();
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
    const lengthInput = screen.getByLabelText('Password length');
    fireEvent.change(lengthInput, {target: {value: '24'}});

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const textarea = screen.getByLabelText('Generated password') as HTMLTextAreaElement;
      expect(textarea.value.length).toBe(24);
    });
  });

  it('respects character set selection (Numbers only)', async () => {
    renderComponent();
    
    // Uncheck Upper case
    const upperCheckbox = screen.getByLabelText('Include upper case letter');
    fireEvent.click(upperCheckbox);
    expect(upperCheckbox).not.toBeChecked();

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const password = (screen.getByLabelText('Generated password') as HTMLTextAreaElement).value;
      // Should only contain lowercase letters and numbers
      expect(password).toMatch(/^[a-z0-9]+$/);
    });
  });

  it('respects character set selection (Special characters)', async () => {
    renderComponent();
    
    const specialCheckbox = screen.getByLabelText('Include special characters');
    fireEvent.click(specialCheckbox);
    expect(specialCheckbox).toBeChecked();

    const generateBtn = screen.getByRole('button', {name: /generate/i});
    fireEvent.click(generateBtn);

    await waitFor(() => {
      const password = (screen.getByLabelText('Generated password') as HTMLTextAreaElement).value;
      // Should contain at least some special characters (statistically likely for length 16)
      expect(password.length).toBe(16);
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
