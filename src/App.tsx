import { useState, useRef, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateControls } from './components/TemplateControls';
import { InputFields } from './components/InputFields';
import { JavaScriptToggle } from './components/JavaScriptToggle';
import { WarningBanner } from './components/WarningBanner';
import { PreviewPane } from './components/PreviewPane';
import { useTemplates } from './hooks/useTemplates';
import { useCapture } from './hooks/useCapture';
import { renderTemplate } from './escape';
import { extractVariablesInOrder } from './template-utils';
import { checkForExternalAssets } from './cors-check';

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
  const [jsEnabled, setJsEnabled] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const previewRef = useRef<HTMLIFrameElement>(null);

  // Reset input values when template changes
  useEffect(() => {
    setInputValues({});
    setIframeLoaded(false);
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
    return renderTemplate(currentTemplate.html, inputValues);
  }, [currentTemplate, inputValues]);

  const { capture, canCapture, captureTitle } = useCapture({
    previewRef,
    currentTemplate,
    inputValues,
    jsEnabled,
    iframeLoaded,
  });

  const handleInputChange = (variable: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [variable]: value }));
  };

  const handlePreviewLoad = () => {
    setIframeLoaded(true);
  };

  const handleJsToggle = (enabled: boolean) => {
    setJsEnabled(enabled);
    setIframeLoaded(false);
  };

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

            <button
              onClick={capture}
              disabled={!canCapture}
              title={captureTitle}
              style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
            >
              Capture Preview
            </button>

            <JavaScriptToggle enabled={jsEnabled} onChange={handleJsToggle} />

            <WarningBanner type="js" visible={jsEnabled} />

            <InputFields
              variables={variables}
              values={inputValues}
              onChange={handleInputChange}
            />

            <WarningBanner type="cors" externalUrls={externalUrls} />
          </article>
        </div>

        <div>
          <article>
            <PreviewPane
              ref={previewRef}
              html={renderedHtml}
              jsEnabled={jsEnabled}
              onLoad={handlePreviewLoad}
            />
          </article>
        </div>
      </div>
    </main>
  );
}
