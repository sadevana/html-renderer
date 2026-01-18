import { useSyncExternalStore, useCallback, useMemo } from 'react';
import type { TemplateSettings, FontScaleConfig, SizeConfig } from '../types';

const DEFAULT_SETTINGS: TemplateSettings = {
  fontScale: {
    mode: 'global',
    global: 1,
    perField: {},
  },
  size: { type: 'auto' },
};

type Listener = () => void;

function createStorageStore<T>(key: string, defaultValue: T) {
  const listeners = new Set<Listener>();

  function getSnapshot(): T {
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === '') return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        listener();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', handleStorage);
    };
  }

  function setValue(value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    listeners.forEach((listener) => { listener(); });
  }

  return { subscribe, getSnapshot, setValue };
}

const storeCache = new Map<string, ReturnType<typeof createStorageStore<TemplateSettings>>>();

function getOrCreateStore(templateId: string) {
  const key = `templateSettings:${templateId}`;
  let store = storeCache.get(key);
  if (!store) {
    store = createStorageStore<TemplateSettings>(key, DEFAULT_SETTINGS);
    storeCache.set(key, store);
  }
  return store;
}

interface UseSettingsResult {
  settings: TemplateSettings;
  setSize: (size: SizeConfig) => void;
  setFontScale: (config: FontScaleConfig) => void;
  setPerFieldScale: (variable: string, scale: number) => void;
}

function noop(): void {
  // No-op unsubscribe function
}

export function useSettings(templateId: string | undefined): UseSettingsResult {
  const store = useMemo(() => {
    if (templateId === undefined || templateId === '') return null;
    return getOrCreateStore(templateId);
  }, [templateId]);

  const settings = useSyncExternalStore(
    useCallback((listener) => store?.subscribe(listener) ?? noop, [store]),
    useCallback(() => store?.getSnapshot() ?? DEFAULT_SETTINGS, [store])
  );

  const setSize = useCallback((size: SizeConfig) => {
    if (store) {
      const current = store.getSnapshot();
      store.setValue({ ...current, size });
    }
  }, [store]);

  const setFontScale = useCallback((config: FontScaleConfig) => {
    if (store) {
      const current = store.getSnapshot();
      store.setValue({ ...current, fontScale: config });
    }
  }, [store]);

  const setPerFieldScale = useCallback((variable: string, scale: number) => {
    if (store) {
      const current = store.getSnapshot();
      store.setValue({
        ...current,
        fontScale: {
          ...current.fontScale,
          perField: { ...current.fontScale.perField, [variable]: scale },
        },
      });
    }
  }, [store]);

  return { settings, setSize, setFontScale, setPerFieldScale };
}
