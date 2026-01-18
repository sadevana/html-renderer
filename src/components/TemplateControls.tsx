import { useRef } from 'react';

interface TemplateControlsProps {
  canRemove: boolean;
  onAdd: (name: string, html: string) => void;
  onRemove: () => void;
}

export function TemplateControls({
  canRemove,
  onAdd,
  onRemove,
}: TemplateControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      onAdd(file.name, content);
    } catch (error) {
      console.error('Failed to load template:', error);
      alert('Failed to load template. Please try again.');
    }

    // Reset file input
    e.target.value = '';
  };

  const handleRemoveClick = () => {
    if (confirm('Are you sure you want to remove this template?')) {
      onRemove();
    }
  };

  return (
    <div className="template-buttons">
      <input
        type="file"
        ref={fileInputRef}
        accept=".html"
        style={{ display: 'none' }}
        onChange={(e) => { void handleFileChange(e); }}
      />
      <button onClick={handleAddClick}>Add Template</button>
      {canRemove && (
        <button className="secondary" onClick={handleRemoveClick}>
          Remove Template
        </button>
      )}
    </div>
  );
}
