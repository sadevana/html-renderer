import type { FontScaleConfig } from '../types';

interface FontScaleSliderProps {
  value: FontScaleConfig;
  onChange: (config: FontScaleConfig) => void;
}

export function FontScaleSlider({ value, onChange }: FontScaleSliderProps) {
  const handleGlobalChange = (scale: number) => {
    onChange({ ...value, global: scale });
  };

  const handleModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      mode: e.target.checked ? 'perField' : 'global',
    });
  };

  const percentage = Math.round(value.global * 100);

  return (
    <div className="font-scale-settings">
      <div className="font-scale-header">
        <span className="font-scale-title">Font Scale</span>
      </div>

      {value.mode === 'global' && (
        <div className="font-scale-row">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={value.global}
            onChange={(e) => { handleGlobalChange(parseFloat(e.target.value)); }}
            className="font-scale-slider"
          />
          <span className="font-scale-value">{percentage}%</span>
          {value.global !== 1 && (
            <button
              type="button"
              className="font-scale-reset"
              onClick={() => { handleGlobalChange(1); }}
              title="Reset to 100%"
            >
              Reset
            </button>
          )}
        </div>
      )}

      <label className="font-scale-toggle">
        <input
          type="checkbox"
          checked={value.mode === 'perField'}
          onChange={handleModeToggle}
        />
        <span>Per-field scaling</span>
      </label>

      {value.mode === 'perField' && (
        <p className="font-scale-hint">Adjust font scale for each field below.</p>
      )}
    </div>
  );
}
