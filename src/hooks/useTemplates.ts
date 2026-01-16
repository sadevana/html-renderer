import { useState, useCallback } from 'react';
import type { Template } from '../types';
import { builtInTemplates } from '../templates';
import {
  loadCustomTemplates,
  saveCustomTemplates,
  loadLastSelected,
  saveLastSelected,
  clearLastSelected,
} from '../storage';

const BUILTIN_PREFIX = 'builtin';
const CUSTOM_PREFIX = 'custom';
const PREFIX_SEPARATOR = '-';

export interface UseTemplatesReturn {
  customTemplates: Template[];
  selectedValue: string;
  currentTemplate: Template | null;
  isCustomSelected: boolean;
  setSelectedValue: (value: string) => void;
  addTemplate: (template: Template) => void;
  removeTemplate: () => void;
  getAllTemplates: () => Array<{ value: string; name: string }>;
}

export function useTemplates(): UseTemplatesReturn {
  const [customTemplates, setCustomTemplates] = useState<Template[]>(() => loadCustomTemplates());
  const [selectedValue, setSelectedValueState] = useState<string>(() => {
    const lastSelected = loadLastSelected();
    if (lastSelected) {
      // Validate that the selection still exists
      const [type, indexStr] = lastSelected.split(PREFIX_SEPARATOR);
      const index = parseInt(indexStr, 10);
      if (type === BUILTIN_PREFIX && index < builtInTemplates.length) {
        return lastSelected;
      }
      const stored = loadCustomTemplates();
      if (type === CUSTOM_PREFIX && index < stored.length) {
        return lastSelected;
      }
    }
    return `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}0`;
  });

  const setSelectedValue = useCallback((value: string) => {
    setSelectedValueState(value);
    saveLastSelected(value);
  }, []);

  const currentTemplate = (() => {
    const [type, indexStr] = selectedValue.split(PREFIX_SEPARATOR);
    const index = parseInt(indexStr, 10);
    if (type === BUILTIN_PREFIX) {
      return builtInTemplates[index] ?? null;
    }
    return customTemplates[index] ?? null;
  })();

  const isCustomSelected = selectedValue.startsWith(CUSTOM_PREFIX);

  const addTemplate = useCallback((template: Template) => {
    setCustomTemplates(prev => {
      const updated = [...prev, template];
      saveCustomTemplates(updated);
      const newValue = `${CUSTOM_PREFIX}${PREFIX_SEPARATOR}${updated.length - 1}`;
      setSelectedValueState(newValue);
      saveLastSelected(newValue);
      return updated;
    });
  }, []);

  const removeTemplate = useCallback(() => {
    if (!isCustomSelected) return;

    const [, indexStr] = selectedValue.split(PREFIX_SEPARATOR);
    const index = parseInt(indexStr, 10);

    setCustomTemplates(prev => {
      const updated = prev.filter((_, i) => i !== index);
      saveCustomTemplates(updated);
      return updated;
    });

    // Select first built-in template
    const firstBuiltin = `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}0`;
    setSelectedValueState(firstBuiltin);
    clearLastSelected();
  }, [isCustomSelected, selectedValue]);

  const getAllTemplates = useCallback(() => {
    const templates: Array<{ value: string; name: string }> = [];

    builtInTemplates.forEach((t, i) => {
      templates.push({
        value: `${BUILTIN_PREFIX}${PREFIX_SEPARATOR}${i}`,
        name: t.name,
      });
    });

    customTemplates.forEach((t, i) => {
      templates.push({
        value: `${CUSTOM_PREFIX}${PREFIX_SEPARATOR}${i}`,
        name: t.name,
      });
    });

    return templates;
  }, [customTemplates]);

  return {
    customTemplates,
    selectedValue,
    currentTemplate,
    isCustomSelected,
    setSelectedValue,
    addTemplate,
    removeTemplate,
    getAllTemplates,
  };
}
