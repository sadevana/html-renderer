interface TemplateSelectorProps {
  selectedValue: string;
  templates: Array<{ value: string; name: string }>;
  onChange: (value: string) => void;
}

export function TemplateSelector({
  selectedValue,
  templates,
  onChange,
}: TemplateSelectorProps) {
  return (
    <label htmlFor="templateSelect">
      Select Template
      <select
        id="templateSelect"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {templates.map((t) => (
          <option key={t.value} value={t.value}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
