import { useState, useCallback, useMemo } from 'react';

type CopyStatus = 'idle' | 'copying' | 'success' | 'error';

interface CopyButtonProps {
  getDataFn: () => Promise<string | Blob>;
  label: string;
  disabled?: boolean;
  title?: string;
  className?: string;
}

const clipboardSupported =
  typeof navigator !== 'undefined' &&
  'clipboard' in navigator &&
  typeof ClipboardItem !== 'undefined';

async function writeToClipboard(data: string | Blob): Promise<void> {
  if (typeof data === 'string') {
    await navigator.clipboard.writeText(data);
  } else {
    await navigator.clipboard.write([new ClipboardItem({ [data.type]: data })]);
  }
}

export function CopyButton({
  getDataFn,
  label,
  disabled = false,
  title,
  className = '',
}: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const effectiveDisabled = disabled || !clipboardSupported;
  const effectiveTitle = useMemo(() => {
    if (!clipboardSupported) return 'Clipboard API not supported in this browser';
    return title;
  }, [title]);

  const handleClick = useCallback(() => {
    setStatus('copying');

    getDataFn()
      .then(writeToClipboard)
      .then(() => {
        setStatus('success');
        setTimeout(() => { setStatus('idle'); }, 2000);
      })
      .catch((error: unknown) => {
        setStatus('error');
        alert(error instanceof Error ? error.message : 'Copy failed');
        setTimeout(() => { setStatus('idle'); }, 2000);
      });
  }, [getDataFn]);

  const buttonText = status === 'copying' ? 'Copying...' : status === 'success' ? 'Copied!' : label;
  const successClass = status === 'success' ? 'success' : '';
  const combinedClassName = [className, successClass].filter(Boolean).join(' ');

  return (
    <button
      onClick={handleClick}
      disabled={effectiveDisabled || status === 'copying'}
      title={effectiveTitle}
      className={combinedClassName || undefined}
    >
      {buttonText}
    </button>
  );
}
