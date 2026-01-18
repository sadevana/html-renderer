import { humanizeLabel } from '../template-utils';
import type { FontScaleConfig } from '../types';

interface InputFieldsProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (variable: string, value: string) => void;
  fontScale?: FontScaleConfig;
  onFontScaleChange?: (variable: string, scale: number) => void;
}

export function InputFields({ variables, values, onChange, fontScale, onFontScaleChange }: InputFieldsProps) {
  const showPerFieldSliders = fontScale?.mode === 'perField' && onFontScaleChange !== undefined;

  return (
    <div>
      {variables.map((variable) => (
        <div key={variable} className="input-field-row">
          <label>
            {humanizeLabel(variable)}:
            <input
              type="text"
              className="input-field"
              value={values[variable] ?? ''}
              onChange={(e) => { onChange(variable, e.target.value); }}
            />
          </label>
          {showPerFieldSliders && (
            <div className="input-field-scale">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={fontScale.perField[variable] ?? 1}
                onChange={(e) => { onFontScaleChange(variable, parseFloat(e.target.value)); }}
                className="font-scale-slider font-scale-slider-inline"
                title="Font scale"
              />
              <span className="font-scale-value-inline">
                {Math.round((fontScale.perField[variable] ?? 1) * 100)}%
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
