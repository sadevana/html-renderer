interface JavaScriptToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function JavaScriptToggle({ enabled, onChange }: JavaScriptToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    if (newValue) {
      const confirmed = confirm(
        'Enabling JavaScript allows templates to run arbitrary code. ' +
          'This can be unsafe for untrusted templates. Continue?'
      );
      if (!confirmed) {
        return;
      }
    }

    onChange(newValue);
  };

  return (
    <div className="js-toggle-container">
      <label>
        <input
          type="checkbox"
          role="switch"
          checked={enabled}
          onChange={handleChange}
        />
        Allow template JavaScript (unsafe)
      </label>
    </div>
  );
}
