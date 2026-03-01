import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserSettingsModal } from '@/components/user-settings.tsx';
import { MantineProvider } from '@mantine/core';
import { SettingsProvider } from '@/lib/settings.ts';
import { ClipboardAwareContext } from '@/components/clipboard-provider.tsx';

// Mock useBrowser
const mockUseBrowser = vi.fn(() => 'Chrome');
vi.mock('@/lib/utils.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils.ts')>();
  return {
    ...actual,
    useBrowser: () => mockUseBrowser(),
  };
});

// Mock Mantine Color Scheme
const mockSetColorScheme = vi.fn();
vi.mock('@mantine/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mantine/core')>();
  return {
    ...actual,
    useMantineColorScheme: () => ({
      setColorScheme: mockSetColorScheme,
    }),
    useComputedColorScheme: () => 'light',
  };
});

describe('UserSettingsModal', () => {
  const mockSetEnableClipboardAware = vi.fn();
  const mockSetClipBoardFormat = vi.fn();
  
  const clipboardContextValue = {
    enableClipboardAware: true,
    setEnableClipboardAware: mockSetEnableClipboardAware,
    clipBoardFormat: "Text" as const,
    setClipBoardFormat: mockSetClipBoardFormat,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (isOpen = true, onClose = vi.fn()) => {
    return render(
      <MantineProvider>
        <SettingsProvider>
          <ClipboardAwareContext.Provider value={clipboardContextValue}>
            <UserSettingsModal isOpen={isOpen} onClose={onClose} />
          </ClipboardAwareContext.Provider>
        </SettingsProvider>
      </MantineProvider>
    );
  };

  it('renders modal when isOpen is true', () => {
    renderComponent(true);
    expect(screen.getByText('User Settings')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /general/i })).toBeInTheDocument();
  });

  it('switches tabs correctly', async () => {
    renderComponent();
    const user = userEvent.setup();

    const formatterTab = screen.getByRole('tab', { name: /formatter/i });
    await user.click(formatterTab);
    expect(screen.getByText('Indentation size')).toBeInTheDocument();

    const uuidTab = screen.getByRole('tab', { name: /uuid generator/i });
    await user.click(uuidTab);
    expect(screen.getByText('UUID Version')).toBeInTheDocument();

    const passwordTab = screen.getByRole('tab', { name: /password generator/i });
    await user.click(passwordTab);
    expect(screen.getByText('Included characters')).toBeInTheDocument();
  });

  it('updates general settings and calls setColorScheme', async () => {
    renderComponent();
    const user = userEvent.setup();

    const themeToggle = screen.getByLabelText('Toggle color scheme');
    await user.click(themeToggle);

    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');

    const smartSearchSwitch = screen.getByLabelText('Smart Search');
    await user.click(smartSearchSwitch);
    expect(mockSetEnableClipboardAware).toHaveBeenCalledWith(false);
  });

  it('saves settings and closes modal', async () => {
    const onClose = vi.fn();
    renderComponent(true, onClose);
    const user = userEvent.setup();

    // Change something
    const formatterTab = screen.getByRole('tab', { name: /formatter/i });
    await user.click(formatterTab);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '4');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(onClose).toHaveBeenCalled();
    
    // Verify it's saved in localStorage (wait for it as it might be async in SettingsProvider)
    await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('dev-tools-settings') || '{}');
        expect(saved.formatter.indentSize).toBe(4);
    });
  });

  it('cancels changes and reverts color scheme', async () => {
    const onClose = vi.fn();
    renderComponent(true, onClose);
    const user = userEvent.setup();

    const themeToggle = screen.getByLabelText('Toggle color scheme');
    await user.click(themeToggle);
    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
    // Reverts to light (default)
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });

  it('does not show Smart Search in Safari', () => {
    mockUseBrowser.mockReturnValue('Safari');
    renderComponent();
    expect(screen.queryByLabelText('Smart Search')).not.toBeInTheDocument();
  });
});
