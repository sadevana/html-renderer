import { useState, useEffect } from 'react';
import type { CaptureSize } from '../types';
import { SIZE_PRESETS } from '../presets';

interface SizeSettingsProps {
  onChange: (size: CaptureSize | null) => void;
}

export function SizeSettings({ onChange }: SizeSettingsProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('auto');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1920);

  useEffect(() => {
    if (isAdvanced) {
      onChange({ width: customWidth, height: customHeight });
    } else {
      const preset = SIZE_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset && preset.id === 'auto') {
        onChange(null);
      } else if (preset) {
        onChange({ width: preset.width, height: preset.height });
      }
    }
  }, [isAdvanced, selectedPresetId, customWidth, customHeight, onChange]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    setSelectedPresetId(presetId);
    const preset = SIZE_PRESETS.find((p) => p.id === presetId);
    if (preset && preset.id !== 'auto') {
      setCustomWidth(preset.width);
      setCustomHeight(preset.height);
    }
  };

  const handleToggleMode = () => {
    setIsAdvanced(!isAdvanced);
  };

  const currentDimensions = isAdvanced
    ? `${customWidth} × ${customHeight} px`
    : selectedPresetId === 'auto'
      ? 'Auto (based on content)'
      : `${SIZE_PRESETS.find((p) => p.id === selectedPresetId)?.width} × ${SIZE_PRESETS.find((p) => p.id === selectedPresetId)?.height} px`;

  return (
    <div className="size-settings">
      <div className="size-settings-header">
        <label>Output Size</label>
        <button type="button" className="advanced-toggle" onClick={handleToggleMode}>
          {isAdvanced ? 'Presets' : 'Advanced'}
        </button>
      </div>

      {isAdvanced ? (
        <div className="custom-dimensions">
          <div className="dimension-input">
            <label htmlFor="width-input">Width (px)</label>
            <input
              id="width-input"
              type="number"
              min="1"
              value={customWidth}
              onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <span className="dimension-separator">×</span>
          <div className="dimension-input">
            <label htmlFor="height-input">Height (px)</label>
            <input
              id="height-input"
              type="number"
              min="1"
              value={customHeight}
              onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>
      ) : (
        <select value={selectedPresetId} onChange={handlePresetChange}>
          {SIZE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      )}

      <div className="size-preview">Output: {currentDimensions}</div>
    </div>
  );
}
