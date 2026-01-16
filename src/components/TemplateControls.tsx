import { useRef } from 'react';
import type { Template } from '../types';

interface TemplateControlsProps {
  isCustomSelected: boolean;
  onAdd: (template: Template) => void;
  onRemove: () => void;
  onCapture: () => void;
  captureDisabled: boolean;
  captureTitle: string;
}

export function TemplateControls({
  isCustomSelected,
  onAdd,
  onRemove,
  onCapture,
  captureDisabled,
  captureTitle,
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
      onAdd({ name: file.name, html: content });
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
        onChange={handleFileChange}
      />
      <button onClick={handleAddClick}>Add Template</button>
      {isCustomSelected && (
        <button className="secondary" onClick={handleRemoveClick}>
          Remove Template
        </button>
      )}
      <button
        onClick={onCapture}
        disabled={captureDisabled}
        title={captureTitle}
      >
        Capture Preview
      </button>
    </div>
  );
}
