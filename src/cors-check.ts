const EXTERNAL_ASSET_PATTERNS = [
  /<img[^>]+src=["']([^"']+)["']/gi,
  /<video[^>]+poster=["']([^"']+)["']/gi,
  /<source[^>]+src=["']([^"']+)["']/gi,
  /url\(["']?([^"')]+)["']?\)/gi,
];

export function checkForExternalAssets(html: string): string[] {
  const currentOrigin = window.location.origin;
  const externalUrls: string[] = [];

  for (const pattern of EXTERNAL_ASSET_PATTERNS) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1];
      if (url.startsWith('data:')) continue;

      try {
        const urlObj = new URL(url, currentOrigin);
        if (urlObj.origin !== currentOrigin) {
          externalUrls.push(url);
        }
      } catch {
        // Relative URL or invalid - likely same origin
      }
    }
    pattern.lastIndex = 0; // Reset regex
  }

  return [...new Set(externalUrls)];
}

export function showCorsWarning(
  element: HTMLElement,
  externalUrls: string[]
): void {
  if (externalUrls.length > 0) {
    element.textContent = `Warning: Template contains ${externalUrls.length} external asset(s). Capture may fail due to CORS if these don't send CORS headers.`;
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}
