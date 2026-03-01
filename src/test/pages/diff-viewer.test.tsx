import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import DiffViewer from '@/pages/diff-viewer/diff-viewer.tsx';
import {MantineProvider} from '@mantine/core';

// Mock @codemirror/merge
vi.mock('@codemirror/merge', () => {
  const MergeView = function(this: any, {parent}: any) {
    if (parent) {
      const el1 = document.createElement('div');
      el1.setAttribute('data-testid', 'codemirror-mock');
      el1.textContent = 'Editor A';
      const el2 = document.createElement('div');
      el2.setAttribute('data-testid', 'codemirror-mock');
      el2.textContent = 'Editor B';
      parent.appendChild(el1);
      parent.appendChild(el2);
    }
    this.destroy = vi.fn();
  };
  return { MergeView };
});

// Mock @codemirror/lang-json
vi.mock('@codemirror/lang-json', () => ({
  json: vi.fn(),
}));

// Mock @codemirror/theme-one-dark
vi.mock('@codemirror/theme-one-dark', () => ({
  oneDark: {},
}));

// Mock codemirror
vi.mock('codemirror', () => ({
  basicSetup: [],
}));

describe('DiffViewer', () => {
  it('renders two editors', () => {
    render(
      <MantineProvider>
          <DiffViewer/>
      </MantineProvider>
    );

    const editors = screen.getAllByTestId('codemirror-mock');
    expect(editors).toHaveLength(2);
  });
});
