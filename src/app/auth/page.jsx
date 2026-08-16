"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Gift, 
  Check, 
  X, 
  ShieldCheck, 
  Loader2
} from 'lucide-react';
import { useGoogleOAuth } from '@/components/GoogleOAuthProvider';
import TurnstileWidget from '@/components/TurnstileWidget';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const codeParam = searchParams ? (searchParams.get('invCode') || searchParams.get('code') || searchParams.get('ref')) : null;
  const modeParam = searchParams ? searchParams.get('mode') : null;

  // Mode & Step state
  const initialMode = modeParam === "login" ? "login" : "register";
  const [authMode, setAuthMode] = useState(initialMode);
  const [step, setStep] = useState(initialMode);
  
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [invitationCode, setInvitationCode] = useState(codeParam || "");
  const [showInviteCode, setShowInviteCode] = useState(Boolean(codeParam));
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Password state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Google OAuth hook
  const { triggerGoogleLogin } = useGoogleOAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleAuthClick = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");
    try {
      const codeToUse = invitationCode || (typeof window !== 'undefined' ? localStorage.getItem('pendingInvCode') : '');
      await triggerGoogleLogin(
        (data) => {
          setIsGoogleLoading(false);
          const userEmail = data.user?.email;
          const userUid = data.user?.uid;

          localStorage.setItem('isLoggedIn', 'true');
          if (userEmail) localStorage.setItem('userEmail', userEmail);
          if (userUid) localStorage.setItem('userUid', userUid);
          if (data.user?.kycStatus) localStorage.setItem('kycStatus', data.user.kycStatus);
          if (data.user?.username) localStorage.setItem('userDisplayName', data.user.username);
          if (data.user?.avatarUrl) localStorage.setItem('userAvatarUrl', data.user.avatarUrl);

          window.dispatchEvent(new CustomEvent('authChange', { 
            detail: { isLoggedIn: true, email: userEmail, uid: userUid } 
          }));

          router.replace('/home');
        },
        (errorText) => {
          setIsGoogleLoading(false);
          setErrorMsg(errorText || "Google authentication failed.");
        },
        codeToUse
      );
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMsg("Google authentication error.");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUp', 'true');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        router.replace('/home');
        return;
      }
    }
    const activeCode = codeParam || (typeof window !== 'undefined' ? localStorage.getItem('pendingInvCode') : null);
    if (activeCode) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingInvCode', activeCode);
      }
      setInvitationCode(activeCode);
      setShowInviteCode(true);

      // If visitor accesses /auth?invCode=... directly without mode=register, redirect to /home?invCode=...
      if (codeParam && modeParam !== 'register' && modeParam !== 'login') {
        router.replace(`/home?invCode=${encodeURIComponent(codeParam)}`);
        return;
      }

      setAuthMode("register");
      setStep("register");
    }
  }, [codeParam, modeParam, router]);

  useEffect(() => {
    if (modeParam === "login") {
      setAuthMode("login");
      setStep("login");
    } else if (modeParam === "register") {
      setAuthMode("register");
      setStep("register");
    }
  }, [modeParam]);

  // Password Validation Rules for Registration
  const hasNumber = /\d/.test(password);
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const isCorrectLength = password.length >= 8 && password.length <= 40;
  const hasSymbol = /[-_.!@#$%^?]/.test(password);
  const isPasswordValid = password.length >= 6;
  const isSubmitPasswordValid = authMode === "login" ? password.trim().length > 0 : isPasswordValid;

  const handleSwitchMode = (targetMode) => {
    setAuthMode(targetMode);
    setStep(targetMode);
    setErrorMsg("");
  };

  const handleStep1Submit = (e) => {
    e?.preventDefault();
    setErrorMsg("");
    if (!emailOrMobile.trim()) return;
    if (authMode === "register" && !agreedToTerms) return;
    setStep("password");
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    if (!isSubmitPasswordValid) return;

    setAuthLoading(true);

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "login"
        ? { emailOrMobile: emailOrMobile.trim(), password, turnstileToken }
        : { emailOrMobile: emailOrMobile.trim(), password, invitationCode: invitationCode.trim(), turnstileToken };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthLoading(false);
        setErrorMsg(data.error || "Authentication failed. Please try again.");
        return;
      }

      setAuthLoading(false);

      const userEmail = data.user?.email || emailOrMobile.trim();
      const userUid = data.user?.uid;

      localStorage.setItem('isLoggedIn', 'true');
      if (userEmail) localStorage.setItem('userEmail', userEmail);
      if (userUid) localStorage.setItem('userUid', userUid);
      if (data.user?.kycStatus) localStorage.setItem('kycStatus', data.user.kycStatus);
      if (data.user?.username) localStorage.setItem('userDisplayName', data.user.username);

      window.dispatchEvent(new CustomEvent('authChange', { 
        detail: { isLoggedIn: true, email: userEmail, uid: userUid } 
      }));

      router.replace('/home');

    } catch (err) {
      console.error("Auth submit error:", err);
      setAuthLoading(false);
      setErrorMsg("Network or server connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto px-5 py-4 relative">
      
      {/* 1. Header Bar matching Image 2 */}
      <header className="flex items-center justify-between pt-2 pb-6">
        <button
          onClick={() => {
            if (step === "password") {
              setStep(authMode);
            } else {
              router.push('/home');
            }
          }}
          className="p-1 text-white hover:text-gray-300 transition-colors"
          title="Back to home"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div>
          {authMode === "register" ? (
            <button
              onClick={() => handleSwitchMode("login")}
              className="text-[#aeff00] font-bold text-sm hover:underline tracking-tight"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() => handleSwitchMode("register")}
              className="text-[#aeff00] font-bold text-sm hover:underline tracking-tight"
            >
              Sign up
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Title Section matching Image 2 */}
      <main className="flex-1 flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {authMode === "register" ? "Sign up" : "Log in"}
          </h1>
          <p className="text-xs text-gray-400 font-medium leading-normal">
            {authMode === "register" ? (
              <>
                Sign up in just one minute to claim <span className="text-[#aeff00] font-bold">10,000 USDT</span> for new users only
              </>
            ) : (
              <>
                Sign up in just one minute to claim <span className="text-[#aeff00] font-bold">10,000 USDT</span> for new users only
              </>
            )}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* STEP 1: Email / Mobile Form */}
        {(step === "register" || step === "login") && (
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-4 mt-2">
            
            {/* Email / Mobile Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-300">Email / Mobile</label>
              <div className="bg-[#181a20] border border-[#2b2f36] focus-within:border-gray-400 rounded-2xl px-4 py-3.5 transition-colors">
                <input
                  type="text"
                  placeholder="Email / Mobile / Username"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none font-medium"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Invitation Code Dropdown (Matching Image 2) */}
            {authMode === "register" && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteCode(!showInviteCode)}
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white font-medium self-start"
                >
                  <span>Invitation code {invitationCode ? `(${invitationCode})` : '(optional)'}</span>
                  {showInviteCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showInviteCode && (
                  <div className="bg-[#181a20] border border-[#2b2f36] focus-within:border-[#aeff00] rounded-2xl px-4 py-3">
                    <input
                      type="text"
                      placeholder="Enter invitation code"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#aeff00] placeholder-gray-500 outline-none font-mono uppercase font-bold"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Terms Agreement Checkbox (Matching Image 2) */}
            {authMode === "register" && (
              <div className="flex items-start gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                    agreedToTerms ? 'bg-white border-white text-black' : 'border-gray-600 bg-transparent text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>

                <p className="text-xs text-gray-300 leading-snug font-medium">
                  Read and agree to <Link href="/terms" className="text-white underline font-semibold">Pokymax User Agreement</Link> and <Link href="/privacy" className="text-white underline font-semibold">Pokymax Privacy Policy</Link>.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!emailOrMobile.trim() || (authMode === "register" && !agreedToTerms)}
              className={`w-full py-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all mt-4 active:scale-[0.98] ${
                emailOrMobile.trim() && (authMode === "login" || agreedToTerms)
                  ? 'bg-[#aeff00] hover:bg-[#9ef000] text-black shadow-lg cursor-pointer'
                  : 'bg-[#22262e] text-gray-500 cursor-not-allowed'
              }`}
            >
              {authMode === "register" && <Gift className="w-4 h-4" />}
              <span>{authMode === "register" ? "Sign up" : "Next"}</span>
            </button>
          </form>
        )}

        {/* STEP 2: Password Input */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-300">
                {authMode === "login" ? "Enter Password" : "Create Password"}
              </label>
              <div className="bg-[#181a20] border rounded-2xl px-4 py-3.5 flex items-center justify-between border-gray-400 focus-within:border-[#aeff00]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none font-medium"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authMode === "register" && (
              <div className="flex flex-col gap-1.5 text-xs text-gray-400 bg-[#181a20]/50 p-3 rounded-xl border border-[#2b2f36]">
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-[#0ecb81]' : ''}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                  <span>Contains numbers</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUpperAndLower ? 'text-[#0ecb81]' : ''}`}>
                  {hasUpperAndLower ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                  <span>Upper & lowercase letters</span>
                </div>
                <div className={`flex items-center gap-2 ${isCorrectLength ? 'text-[#0ecb81]' : ''}`}>
                  {isCorrectLength ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                  <span>8 to 40 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSymbol ? 'text-[#0ecb81]' : ''}`}>
                  {hasSymbol ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                  <span>Contains symbols (-_.!@#$%^?)</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isSubmitPasswordValid}
              className={`w-full py-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all mt-2 active:scale-[0.98] ${
                isSubmitPasswordValid
                  ? 'bg-[#aeff00] hover:bg-[#9ef000] text-black shadow-lg cursor-pointer'
                  : 'bg-[#22262e] text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{authMode === "login" ? "Log in" : "Complete registration"}</span>
            </button>
          </form>
        )}

        {/* 3. Social Logins Section matching Image 2 */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e2329]" />
            </div>
            <span className="relative bg-[#000000] px-3 text-xs text-gray-400 font-medium">
              Or continue with
            </span>
          </div>

          <div className="flex items-center justify-center gap-5">
            {/* Google Sign In Circle Button */}
            <button 
              type="button"
              onClick={handleGoogleAuthClick}
              disabled={isGoogleLoading}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              title="Continue with Google"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
            </button>

            {/* Apple Sign In Circle Button */}
            <button 
              type="button"
              onClick={() => handleStep1Submit()}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-100 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Continue with Apple"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-1.01 3 .1.01 2.22-.55 2.89-1.37z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 4. Embedded Cloudflare Turnstile CAPTCHA Widget (Red Box Location) */}
        <div className="mt-8 mb-4 p-3 bg-[#181a20]/60 border border-[#2b2f36] rounded-2xl flex flex-col items-center justify-center min-h-[85px] shadow-lg">
          <TurnstileWidget 
            action={authMode}
            onVerify={(token) => {
              setTurnstileToken(token);
              setErrorMsg("");
            }}
            onError={() => {
              console.warn("Turnstile widget load error");
            }}
          />
        </div>

      </main>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <AuthContent />
    </Suspense>
  );
}
