import { useState, useCallback, useMemo } from 'react';
import type { Template } from '../types';
import { builtInTemplates } from '../templates';
import {
  loadCustomTemplates,
  saveCustomTemplates,
  loadLastSelected,
  saveLastSelected,
  clearLastSelected,
  generateTemplateId,
} from '../storage';

export interface UseTemplatesReturn {
  templates: Template[];
  selected: Template;
  setSelected: (template: Template) => void;
  addTemplate: (name: string, html: string) => void;
  removeTemplate: () => void;
}

export function useTemplates(): UseTemplatesReturn {
  const [customTemplates, setCustomTemplates] = useState<Template[]>(() => loadCustomTemplates());

  const templates = useMemo(
    () => [...builtInTemplates, ...customTemplates],
    [customTemplates]
  );

  const [selectedId, setSelectedIdState] = useState<string>(() => {
    const lastSelected = loadLastSelected();
    if (lastSelected !== null && lastSelected !== '') {
      if (templates.some((t) => t.id === lastSelected)) {
        return lastSelected;
      }
    }
    return builtInTemplates[0].id;
  });

  const selected = useMemo(() => {
    return templates.find((t) => t.id === selectedId) ?? builtInTemplates[0];
  }, [templates, selectedId]);

  const setSelected = useCallback((template: Template) => {
    setSelectedIdState(template.id);
    saveLastSelected(template.id);
  }, []);

  const addTemplate = useCallback((name: string, html: string) => {
    const newTemplate: Template = {
      id: generateTemplateId(),
      name,
      html,
      userDefined: true,
    };

    setCustomTemplates((prev) => {
      const updated = [...prev, newTemplate];
      saveCustomTemplates(updated);
      return updated;
    });

    setSelectedIdState(newTemplate.id);
    saveLastSelected(newTemplate.id);
  }, []);

  const removeTemplate = useCallback(() => {
    if (!selected.userDefined) return;

    setCustomTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== selected.id);
      saveCustomTemplates(updated);
      return updated;
    });

    // Select first built-in template
    setSelectedIdState(builtInTemplates[0].id);
    clearLastSelected();
  }, [selected]);

  return {
    templates,
    selected,
    setSelected,
    addTemplate,
    removeTemplate,
  };
}
