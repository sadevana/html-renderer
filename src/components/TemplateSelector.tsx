import type { Template } from '../types';

interface TemplateSelectorProps {
  selected: Template;
  templates: Template[];
  onChange: (template: Template) => void;
}

export function TemplateSelector({
  selected,
  templates,
  onChange,
}: TemplateSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = templates.find((t) => t.id === e.target.value);
    if (template) {
      onChange(template);
    }
  };

  return (
    <label htmlFor="templateSelect">
      Select Template
      <select
        id="templateSelect"
        value={selected.id}
        onChange={handleChange}
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
