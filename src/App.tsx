import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateControls } from './components/TemplateControls';
import { InputFields } from './components/InputFields';
import { WarningBanner } from './components/WarningBanner';
import { PreviewPane } from './components/PreviewPane';
import { SizeSettings } from './components/SizeSettings';
import { FontScaleSlider } from './components/FontScaleSlider';
import { CopyButton } from './components/CopyButton';
import { useTemplates } from './hooks/useTemplates';
import { useSettings } from './hooks/useSettings';
import { renderTemplate } from './escape';
import { extractVariablesInOrder } from './template-utils';
import { checkForExternalAssets } from './cors-check';
import { getSizeForCapture } from './types';
import { SIZE_PRESETS } from './presets';
import { renderPreviewToBlob, downloadBlob } from './capture';
import instructions from "./template_instructions.md?raw";

export function App() {
  const {
    templates,
    selected,
    setSelected,
    addTemplate,
    removeTemplate,
  } = useTemplates();

  const { settings, setSize, setFontScale, setPerFieldScale } = useSettings(selected.id);

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const previewRef = useRef<HTMLIFrameElement>(null);

  // Reset input values when template changes
  useEffect(() => {
    setInputValues({});
    setIframeLoaded(false);
  }, [selected]);

  const variables = useMemo(
    () => extractVariablesInOrder(selected.html),
    [selected]
  );

  const externalUrls = useMemo(
    () => checkForExternalAssets(selected.html),
    [selected]
  );

  const renderedHtml = useMemo(
    () => renderTemplate(selected.html, inputValues, settings.fontScale),
    [selected, inputValues, settings.fontScale]
  );

  const captureSize = getSizeForCapture(settings.size, SIZE_PRESETS);

  const canCapture = iframeLoaded;

  const captureTitle = useMemo(() => {
    if (!iframeLoaded) return 'Waiting for preview to load';
    return '';
  }, [iframeLoaded]);

  const generateFilename = useCallback(() => {
    const firstValue = Object.values(inputValues)[0] ?? 'preview';
    const sanitizedValue = firstValue.trim().replace(/\s+/g, '_').slice(0, 50) || 'preview';
    const safeName = selected.name.replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeName}-${sanitizedValue}-${String(Date.now())}.png`;
  }, [selected, inputValues]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || !canCapture) return;
    try {
      const blob = await renderPreviewToBlob(previewRef.current, captureSize);
      downloadBlob(blob, generateFilename());
    } catch (error) {
      console.error('Failed to capture preview:', error);
      alert('Failed to capture preview. Please try again.');
    }
  }, [canCapture, captureSize, generateFilename]);

  const getPreviewBlob = useCallback(async () => {
    if (!previewRef.current) throw new Error('Preview not available');
    return renderPreviewToBlob(previewRef.current, captureSize);
  }, [captureSize]);

  const getInstructions = useCallback(() => Promise.resolve(instructions), []);

  const handleInputChange = (variable: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handlePreviewLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <main className="container">
      <Header />

      <div className="grid">
        <div>
          <article>
            <div className="template-controls">
              <TemplateSelector
                selected={selected}
                templates={templates}
                onChange={setSelected}
              />
              <TemplateControls
                canRemove={selected.userDefined}
                onAdd={addTemplate}
                onRemove={removeTemplate}
              />
            </div>

            <SizeSettings value={settings.size} onChange={setSize} />

            <FontScaleSlider
              value={settings.fontScale}
              onChange={setFontScale}
            />

            <div className="capture-buttons">
              <button
                onClick={() => void handleDownload()}
                disabled={!canCapture}
                title={captureTitle}
              >
                Download PNG
              </button>
              <CopyButton
                getDataFn={getPreviewBlob}
                label="Copy to Clipboard"
                disabled={!canCapture}
                title={captureTitle}
              />
            </div>

            <div className="ai-copy-section">
              <CopyButton
                getDataFn={getInstructions}
                label="Copy for AI Generation"
                className="secondary"
              />
              <span className="help-icon" title="Copies template guidelines for AI assistants to generate compatible HTML templates with proper viewport units and variable syntax.">?</span>
            </div>

            <InputFields
              variables={variables}
              values={inputValues}
              onChange={handleInputChange}
              fontScale={settings.fontScale}
              onFontScaleChange={setPerFieldScale}
            />

            <WarningBanner externalUrls={externalUrls} />
          </article>
        </div>

        <div>
          <article>
            <PreviewPane
              ref={previewRef}
              html={renderedHtml}
              onLoad={handlePreviewLoad}
              captureSize={captureSize}
            />
          </article>
        </div>
      </div>
    </main>
  );
}
