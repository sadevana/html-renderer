import type { SizePreset } from './types';

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'auto', name: 'Auto (Content Size)', width: 0, height: 0 },
  { id: 'story', name: 'Story (1080×1920)', width: 1080, height: 1920 },
  { id: 'telegram', name: 'Telegram (1280×1280)', width: 1280, height: 1280 },
  { id: 'square', name: 'Square (1080×1080)', width: 1080, height: 1080 },
];
