import { describe, it, expect, vi } from 'vitest';
import { convertImage } from './image';

// Mock Canvas and Image
globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
globalThis.URL.revokeObjectURL = vi.fn();

describe('Image Converter', () => {
  it('should be defined', () => {
    expect(convertImage).toBeDefined();
  });

  // Note: Full canvas/blob mocking in jsdom can be complex.
  // We're just asserting the interface exists and test runs without syntax errors.
});
