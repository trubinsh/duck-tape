import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import {RegexPage} from '@/pages/regex';
import {MantineProvider} from '@mantine/core';

// Mock CodeMirror since it's hard to test in JSDOM
vi.mock('@uiw/react-codemirror', () => {
  return {
    default: ({value, onChange, placeholder}: any) => (
      <textarea
        data-testid="codemirror-mock"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    )
  };
});

describe('RegexPage', () => {
  const renderComponent = () => {
    return render(
      <MantineProvider>
        <RegexPage />
      </MantineProvider>
    );
  };

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Regular Expression')).toBeInTheDocument();
    expect(screen.getByText('Test String')).toBeInTheDocument();
    
    const editors = screen.getAllByTestId('codemirror-mock');
    expect(editors).toHaveLength(2);
  });

  it('updates regex and test string', () => {
    renderComponent();
    const [regexEditor, testStringEditor] = screen.getAllByTestId('codemirror-mock') as HTMLTextAreaElement[];

    fireEvent.change(regexEditor, {target: {value: '[a-z]+'}});
    expect(regexEditor.value).toBe('[a-z]+');

    fireEvent.change(testStringEditor, {target: {value: 'hello world'}});
    expect(testStringEditor.value).toBe('hello world');
  });

  it('shows error message for invalid regex', () => {
    renderComponent();
    const [regexEditor] = screen.getAllByTestId('codemirror-mock') as HTMLTextAreaElement[];

    // Invalid regex (unclosed parenthesis)
    fireEvent.change(regexEditor, {target: {value: '('}});
    
    expect(screen.getByText('Invalid Regex')).toBeInTheDocument();
    expect(screen.getByText(/Invalid regular expression/)).toBeInTheDocument();
  });

  it('clears error message when regex becomes valid', () => {
    renderComponent();
    const [regexEditor] = screen.getAllByTestId('codemirror-mock') as HTMLTextAreaElement[];

    // Invalid regex
    fireEvent.change(regexEditor, {target: {value: '('}});
    expect(screen.getByText('Invalid Regex')).toBeInTheDocument();

    // Valid regex
    fireEvent.change(regexEditor, {target: {value: '()'}});
    expect(screen.queryByText('Invalid Regex')).not.toBeInTheDocument();
  });
});
