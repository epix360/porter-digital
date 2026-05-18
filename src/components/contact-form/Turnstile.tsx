'use client';

import { useEffect, useId, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          action?: string;
          appearance?: 'always' | 'execute' | 'interaction-only';
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
};

export function Turnstile({
  siteKey,
  onToken,
  onError,
  onExpire,
  theme = 'auto',
}: TurnstileProps) {
  const containerId = useId();
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const render = () => {
      if (!window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(`#${CSS.escape(containerId)}`, {
        sitekey: siteKey,
        theme,
        callback: onToken,
        'error-callback': () => {
          onToken('');
          onError?.();
        },
        'expired-callback': () => {
          onToken('');
          onExpire?.();
        },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const interval = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(interval);
          render();
        }
      }, 100);
      return () => window.clearInterval(interval);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [containerId, siteKey, theme, onToken, onError, onExpire]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div id={containerId} />
    </>
  );
}
