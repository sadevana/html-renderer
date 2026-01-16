import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkForExternalAssets } from './cors-check';

describe('checkForExternalAssets', () => {
  beforeEach(() => {
    // Mock window.location.origin
    vi.stubGlobal('location', { origin: 'http://localhost:5173' });
  });

  it('detects external image URLs', () => {
    const html = '<img src="https://example.com/image.png">';
    const result = checkForExternalAssets(html);
    expect(result).toContain('https://example.com/image.png');
  });

  it('ignores data URLs', () => {
    const html = '<img src="data:image/png;base64,...">';
    const result = checkForExternalAssets(html);
    expect(result).toHaveLength(0);
  });

  it('detects CSS url() references', () => {
    const html = '<style>background: url("https://cdn.example.com/bg.jpg")</style>';
    const result = checkForExternalAssets(html);
    expect(result).toContain('https://cdn.example.com/bg.jpg');
  });

  it('deduplicates URLs', () => {
    const html = '<img src="https://example.com/a.png"><img src="https://example.com/a.png">';
    const result = checkForExternalAssets(html);
    expect(result).toHaveLength(1);
  });

  it('ignores relative URLs', () => {
    const html = '<img src="/images/local.png">';
    const result = checkForExternalAssets(html);
    expect(result).toHaveLength(0);
  });
});
