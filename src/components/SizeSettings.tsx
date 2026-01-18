import type { SizeConfig } from '../types';
import { SIZE_PRESETS } from '../presets';

interface SizeSettingsProps {
  value: SizeConfig;
  onChange: (config: SizeConfig) => void;
}

export function SizeSettings({ value, onChange }: SizeSettingsProps) {
  const isAdvanced = value.type === 'advanced';

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    if (presetId === 'auto') {
      onChange({ type: 'auto' });
    } else {
      onChange({ type: 'preset', presetId });
    }
  };

  const handleToggleMode = () => {
    if (isAdvanced) {
      // Advanced -> Preset: default to auto
      onChange({ type: 'auto' });
    } else {
      // Preset/Auto -> Advanced: get dimensions from current setting
      let width = 1080;
      let height = 1920;
      if (value.type === 'preset') {
        const preset = SIZE_PRESETS.find((p) => p.id === value.presetId);
        if (preset) {
          width = preset.width;
          height = preset.height;
        }
      }
      onChange({ type: 'advanced', width, height });
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = Math.max(1, parseInt(e.target.value) || 1);
    if (value.type === 'advanced') {
      onChange({ type: 'advanced', width, height: value.height });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = Math.max(1, parseInt(e.target.value) || 1);
    if (value.type === 'advanced') {
      onChange({ type: 'advanced', width: value.width, height });
    }
  };

  const currentDimensions = (() => {
    switch (value.type) {
      case 'auto':
        return 'Auto (based on content)';
      case 'preset': {
        const preset = SIZE_PRESETS.find((p) => p.id === value.presetId);
        return preset
          ? `${String(preset.width)} × ${String(preset.height)} px`
          : 'Unknown preset';
      }
      case 'advanced':
        return `${String(value.width)} × ${String(value.height)} px`;
    }
  })();

  return (
    <div className="size-settings">
      <div className="size-settings-header">
        <label>Output Size</label>
        <button type="button" className="advanced-toggle" onClick={handleToggleMode}>
          {isAdvanced ? 'Presets' : 'Advanced'}
        </button>
      </div>

      {value.type === 'advanced' ? (
        <div className="custom-dimensions">
          <div className="dimension-input">
            <label htmlFor="width-input">Width (px)</label>
            <input
              id="width-input"
              type="number"
              min="1"
              value={value.width}
              onChange={handleWidthChange}
            />
          </div>
          <span className="dimension-separator">×</span>
          <div className="dimension-input">
            <label htmlFor="height-input">Height (px)</label>
            <input
              id="height-input"
              type="number"
              min="1"
              value={value.height}
              onChange={handleHeightChange}
            />
          </div>
        </div>
      ) : (
        <select
          value={value.type === 'preset' ? value.presetId : 'auto'}
          onChange={handlePresetChange}
        >
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
