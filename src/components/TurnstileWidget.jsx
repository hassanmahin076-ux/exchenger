"use client";

import React, { useEffect, useRef, useState } from 'react';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEQlaXrXsmGh5k6f';

export default function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  action = 'auth',
  theme = 'dark'
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already present
    if (window.turnstile) {
      setScriptLoaded(true);
      return;
    }

    const scriptId = 'cf-turnstile-script';
    let existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.turnstile) return;

    // Reset previous widget if any
    if (widgetIdRef.current !== null) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {}
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: theme,
        action: action,
        callback: (token) => {
          if (onVerify) onVerify(token);
        },
        'error-callback': () => {
          if (onError) onError();
        },
        'expired-callback': () => {
          if (onExpire) onExpire();
        }
      });
    } catch (err) {
      console.error('Turnstile render error:', err);
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {}
      }
    };
  }, [scriptLoaded, action, theme, onVerify, onError, onExpire]);

  return (
    <div className="flex flex-col items-center justify-center my-2 select-none min-h-[65px]">
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}
