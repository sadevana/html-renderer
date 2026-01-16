import { humanizeLabel } from '../template-utils';

interface InputFieldsProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (variable: string, value: string) => void;
}

export function InputFields({ variables, values, onChange }: InputFieldsProps) {
  return (
    <div>
      {variables.map((variable) => (
        <label key={variable}>
          {humanizeLabel(variable)}:
          <input
            type="text"
            className="input-field"
            value={values[variable] ?? ''}
            onChange={(e) => onChange(variable, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
