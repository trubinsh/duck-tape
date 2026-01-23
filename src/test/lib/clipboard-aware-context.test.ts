import { describe, it, expect } from 'vitest';
import { detectFormat } from '@/lib/clipboard-aware-context';

describe('detectFormat', () => {
  it('should detect URL', () => {
    expect(detectFormat('https://example.com')).toBe('URL');
    expect(detectFormat('http://localhost:3000')).toBe('URL');
    expect(detectFormat('www.google.com')).toBe('URL');
  });

  it('should detect JSON', () => {
    expect(detectFormat('{"key": "value"}')).toBe('JSON');
    expect(detectFormat('[1, 2, 3]')).toBe('JSON');
    expect(detectFormat('true')).toBe('JSON');
  });

  it('should detect Base64', () => {
    expect(detectFormat('SGVsbG8=')).toBe('Base64');
  });

  it('should detect XML', () => {
    expect(detectFormat('<my-custom-tag>content</my-custom-tag>')).toBe('XML');
    expect(detectFormat('<?xml version="1.0"?><note><info>Hello</info></note>')).toBe('XML');
  });

  it('should detect HTML', () => {
    expect(detectFormat('<div>Hello World</div>')).toBe('HTML');
    expect(detectFormat('<p>Paragraph</p><br/>')).toBe('HTML');
    expect(detectFormat('<a href="#">Link</a>')).toBe('HTML');
  });

  it('should return text for plain text', () => {
    expect(detectFormat('Just some plain text')).toBe('Text');
    expect(detectFormat('Random string with no specific format')).toBe('Text');
  });

  it('should return text for empty or whitespace strings', () => {
    expect(detectFormat('')).toBe('Text');
    expect(detectFormat('   ')).toBe('Text');
    expect(detectFormat('\n')).toBe('Text');
  });

  it('should respect priority order', () => {
    expect(detectFormat('12345')).toBe('JSON');
    expect(detectFormat('YWJj')).toBe('Base64');
  });
});
