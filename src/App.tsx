import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateControls } from './components/TemplateControls';
import { InputFields } from './components/InputFields';
import { WarningBanner } from './components/WarningBanner';
import { PreviewPane } from './components/PreviewPane';
import { SizeSettings } from './components/SizeSettings';
import { FontScaleSlider, type FontScaleConfig } from './components/FontScaleSlider';
import { useTemplates } from './hooks/useTemplates';
import { useCapture } from './hooks/useCapture';
import { renderTemplate } from './escape';
import { extractVariablesInOrder } from './template-utils';
import { checkForExternalAssets } from './cors-check';
import { loadFontScaleForTemplate, saveFontScaleForTemplate } from './storage';
import type { CaptureSize } from './types';
import instructions from "./template_instructions.md?raw";

export function App() {
  const {
    selectedValue,
    currentTemplate,
    isCustomSelected,
    setSelectedValue,
    addTemplate,
    removeTemplate,
    getAllTemplates,
  } = useTemplates();

  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [captureSize, setCaptureSize] = useState<CaptureSize | null>(null);
  const [copyForAIStatus, setCopyForAIStatus] = useState<'idle' | 'copying' | 'success'>('idle');
  const [fontScale, setFontScale] = useState<FontScaleConfig>({
    mode: 'global',
    global: 1,
    perField: {},
  });

  const previewRef = useRef<HTMLIFrameElement>(null);

  // Reset input values and load font scale when template changes
  useEffect(() => {
    setInputValues({});
    setIframeLoaded(false);
    if (currentTemplate) {
      setFontScale(loadFontScaleForTemplate(currentTemplate.name));
    }
  }, [currentTemplate]);

  const variables = useMemo(() => {
    if (!currentTemplate) return [];
    return extractVariablesInOrder(currentTemplate.html);
  }, [currentTemplate]);

  const externalUrls = useMemo(() => {
    if (!currentTemplate) return [];
    return checkForExternalAssets(currentTemplate.html);
  }, [currentTemplate]);

  const renderedHtml = useMemo(() => {
    if (!currentTemplate) return '';
    return renderTemplate(currentTemplate.html, inputValues, fontScale);
  }, [currentTemplate, inputValues, fontScale]);

  const { capture, copyToClipboard, canCapture, captureTitle, clipboardSupported, copyStatus } = useCapture({
    previewRef,
    currentTemplate,
    inputValues,
    iframeLoaded,
    captureSize,
  });

  const copyButtonText = copyStatus === 'copying' ? 'Copying...' : copyStatus === 'success' ? 'Copied!' : 'Copy to Clipboard';
  const copyButtonTitle = !clipboardSupported ? 'Clipboard API not supported in this browser' : captureTitle;

  const handleSizeChange = useCallback((size: CaptureSize | null) => {
    setCaptureSize(size);
  }, []);

  const handleFontScaleChange = useCallback((config: FontScaleConfig) => {
    setFontScale(config);
    if (currentTemplate) {
      saveFontScaleForTemplate(currentTemplate.name, config);
    }
  }, [currentTemplate]);

  const handlePerFieldFontScaleChange = useCallback((variable: string, scale: number) => {
    const newConfig = {
      ...fontScale,
      perField: { ...fontScale.perField, [variable]: scale },
    };
    setFontScale(newConfig);
    if (currentTemplate) {
      saveFontScaleForTemplate(currentTemplate.name, newConfig);
    }
  }, [fontScale, currentTemplate]);

  const handleInputChange = (variable: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handlePreviewLoad = () => {
    setIframeLoaded(true);
  };

  const copyForAI = async () => {
    setCopyForAIStatus('copying');

    try {
      await navigator.clipboard.writeText(instructions);
      setCopyForAIStatus('success');
      setTimeout(() => setCopyForAIStatus('idle'), 2000);
    } catch {
      setCopyForAIStatus('idle');
    }
  };

  const copyForAIButtonText = copyForAIStatus === 'copying' ? 'Copying...' : copyForAIStatus === 'success' ? 'Copied!' : 'Copy for AI Generation';

  return (
    <main className="container">
      <Header />

      <div className="grid">
        <div>
          <article>
            <div className="template-controls">
              <TemplateSelector
                selectedValue={selectedValue}
                templates={getAllTemplates()}
                onChange={setSelectedValue}
              />
              <TemplateControls
                isCustomSelected={isCustomSelected}
                onAdd={addTemplate}
                onRemove={removeTemplate}
              />
            </div>

            <SizeSettings onChange={handleSizeChange} />

            <FontScaleSlider
              value={fontScale}
              onChange={handleFontScaleChange}
            />

            <div className="capture-buttons">
              <button
                onClick={capture}
                disabled={!canCapture}
                title={captureTitle}
              >
                Download PNG
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!canCapture || !clipboardSupported || copyStatus === 'copying'}
                title={copyButtonTitle}
                className={copyStatus === 'success' ? 'success' : ''}
              >
                {copyButtonText}
              </button>
            </div>

            <div className="ai-copy-section">
              <button
                onClick={copyForAI}
                disabled={copyForAIStatus === 'copying'}
                className={`secondary ${copyForAIStatus === 'success' ? 'success' : ''}`}
              >
                {copyForAIButtonText}
              </button>
              <span className="help-icon" title="Copies template guidelines for AI assistants to generate compatible HTML templates with proper viewport units and variable syntax.">?</span>
            </div>

            <InputFields
              variables={variables}
              values={inputValues}
              onChange={handleInputChange}
              fontScale={fontScale}
              onFontScaleChange={handlePerFieldFontScaleChange}
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
