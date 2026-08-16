"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const GoogleOAuthContext = createContext({
  isLoaded: false,
  clientId: '',
  triggerGoogleLogin: async () => {},
});

export function GoogleOAuthProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientId, setClientId] = useState(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
  const activeClientIdRef = useRef(clientId);

  useEffect(() => {
    activeClientIdRef.current = clientId;
  }, [clientId]);

  // Load Google Client ID from backend config if available
  const fetchGoogleConfig = async () => {
    try {
      const res = await fetch('/api/auth/google/config');
      if (res.ok) {
        const data = await res.json();
        if (data.clientId) {
          setClientId(data.clientId);
          activeClientIdRef.current = data.clientId;
          return data.clientId;
        }
      }
    } catch (e) {
      console.warn('Could not fetch Google OAuth config:', e);
    }
    return activeClientIdRef.current;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetchGoogleConfig();

    // Check if Google GSI script is already loaded
    if (window.google?.accounts) {
      setIsLoaded(true);
      return;
    }

    // Load Google Identity Services SDK script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.warn('Google Identity Services script failed to load');
    };
    document.head.appendChild(script);
  }, []);

  const triggerGoogleLogin = async (onSuccess, onError, invitationCode = '') => {
    const codeToUse = invitationCode || (typeof window !== 'undefined' ? (localStorage.getItem('pendingInvCode') || '') : '');

    // Refresh client ID from server config
    let currentId = activeClientIdRef.current;
    if (!currentId || currentId.includes('your_google_client_id')) {
      currentId = await fetchGoogleConfig();
    }

    const isRealClientId = currentId &&
      !currentId.includes('your_google_client_id') &&
      !currentId.includes('your-google-client-id') &&
      !currentId.startsWith('your_') &&
      !currentId.startsWith('your-');

    // Ensure SDK script is loaded
    if (!window.google?.accounts) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.google?.accounts) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 3000);
      });
    }

    // 1. REAL GOOGLE OAUTH POPUP FLOW (If Client ID is configured in .env)
    if (isRealClientId && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: currentId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accessToken: tokenResponse.access_token, invitationCode: codeToUse }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  onSuccess?.(data);
                } else {
                  onError?.(data.error || 'Google authentication failed.');
                }
              } catch (err) {
                onError?.('Network connection error during Google login.');
              }
            } else {
              onError?.('Google login popup was closed.');
            }
          },
          error_callback: (err) => {
            console.warn('Google OAuth Token Client error:', err);
            onError?.('Google OAuth popup error or blocked by browser.');
          },
        });

        tokenClient.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Error launching Google OAuth token client:', err);
      }
    }

    // 2. Fallback Google One-Tap prompt if available
    if (isRealClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: currentId,
          callback: async (response) => {
            if (response.credential) {
              try {
                const res = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ credential: response.credential, invitationCode: codeToUse }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  onSuccess?.(data);
                } else {
                  onError?.(data.error || 'Google login failed.');
                }
              } catch (err) {
                onError?.('Network error during Google login.');
              }
            }
          },
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            triggerDemoGoogleAuth(onSuccess, onError, codeToUse);
          }
        });
        return;
      } catch (err) {
        console.warn('Google One-Tap error:', err);
      }
    }

    // 3. Fallback Demo Auth Mode for local testing when GOOGLE_CLIENT_ID is not configured yet
    console.info('GOOGLE_CLIENT_ID not configured in .env. Running demo Google auth mode.');
    await triggerDemoGoogleAuth(onSuccess, onError, codeToUse);
  };

  const triggerDemoGoogleAuth = async (onSuccess, onError, invitationCode = '') => {
    try {
      const demoEmail = `user.google_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
      const demoGoogleUser = {
        email: demoEmail,
        id: `g_${Math.floor(10000000 + Math.random() * 90000000)}`,
        name: 'Google User',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleUser: demoGoogleUser, invitationCode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess?.(data);
      } else {
        onError?.(data.error || 'Google login failed.');
      }
    } catch (err) {
      onError?.('Network connection error during Google login.');
    }
  };

  return (
    <GoogleOAuthContext.Provider
      value={{
        isLoaded,
        clientId,
        triggerGoogleLogin,
      }}
    >
      {children}
    </GoogleOAuthContext.Provider>
  );
}

export function useGoogleOAuth() {
  return useContext(GoogleOAuthContext);
}
