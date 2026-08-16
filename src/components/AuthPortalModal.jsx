"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Lock, Key, ArrowRight, Loader2 } from 'lucide-react';
import { useGoogleOAuth } from './GoogleOAuthProvider';
import TurnstileWidget from './TurnstileWidget';

export default function AuthPortalModal({ isOpen, onClose }) {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { triggerGoogleLogin } = useGoogleOAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const pendingCode = localStorage.getItem('pendingInvCode');
      if (pendingCode) {
        setReferralCode(pendingCode);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleAuthClick = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");
    try {
      const pendingCode = referralCode || (typeof window !== 'undefined' ? localStorage.getItem('pendingInvCode') : '');
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

          onClose();
        },
        (errorText) => {
          setIsGoogleLoading(false);
          setErrorMsg(errorText || "Google authentication failed.");
        },
        pendingCode
      );
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMsg("Google authentication error.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const activeRefCode = referralCode.trim() || (typeof window !== 'undefined' ? (localStorage.getItem('pendingInvCode') || '') : '');
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "login"
        ? { emailOrMobile: email.trim(), password, turnstileToken }
        : { emailOrMobile: email.trim(), password, invitationCode: activeRefCode, turnstileToken };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        setErrorMsg(data.error || "Authentication failed. Please try again.");
        return;
      }

      setLoading(false);
      const userEmail = data.user?.email || email.trim();
      const userUid = data.user?.uid;

      localStorage.setItem('isLoggedIn', 'true');
      if (userEmail) localStorage.setItem('userEmail', userEmail);
      if (userUid) localStorage.setItem('userUid', userUid);
      if (data.user?.kycStatus) localStorage.setItem('kycStatus', data.user.kycStatus);
      if (data.user?.username) localStorage.setItem('userDisplayName', data.user.username);

      window.dispatchEvent(new CustomEvent('authChange', { 
        detail: { isLoggedIn: true, email: userEmail, uid: userUid } 
      }));

      onClose();
    } catch (err) {
      console.error("Auth submit error:", err);
      setLoading(false);
      setErrorMsg("Network or server connection error. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-[#131a2a] border border-[#FFD400]/40 rounded-2xl p-6 shadow-cyberGlow overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8b98a5] hover:text-white bg-[#0b0f19] rounded-lg border border-[#1f2b45] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0b0f19] border border-[#FFD400] text-[#FFD400] font-mono font-bold text-xl mb-3 shadow-cyberGlow">
            3TH
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {authMode === "login" ? "Access Cyber Vault" : "Create Exchanger 3th Account"}
          </h3>
          <p className="text-xs text-[#8b98a5] mt-1 font-mono">
            {authMode === "login" ? "Enter your security matrix credentials" : "Join Season 3 Quantum Matrix Yield Pool"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#0b0f19] p-1 rounded-xl border border-[#1f2b45] mb-5">
          <button
            onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "login" ? 'bg-[#FFD400] text-[#0b0f19]' : 'text-[#8b98a5] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "register" ? 'bg-[#FFD400] text-[#0b0f19]' : 'text-[#8b98a5] hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-xs text-red-400 font-medium mb-4 flex items-center justify-between animate-fadeIn">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-[#8b98a5]">EMAIL OR CYBER ID</label>
            <div className="flex items-center gap-2 bg-[#0b0f19] border border-[#1f2b45] focus-within:border-[#FFD400] px-3 py-2.5 rounded-xl text-xs text-white">
              <Mail className="w-4 h-4 text-[#8b98a5]" />
              <input
                type="text"
                placeholder="cyber@exchanger3th.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono text-[#8b98a5]">PASSKEY / ACCESS PASSWORD</label>
            <div className="flex items-center gap-2 bg-[#0b0f19] border border-[#1f2b45] focus-within:border-[#FFD400] px-3 py-2.5 rounded-xl text-xs text-white">
              <Lock className="w-4 h-4 text-[#8b98a5]" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 outline-none font-mono"
                required
              />
            </div>
          </div>

          {authMode === "register" && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-mono text-[#8b98a5]">REFERRAL MATRIX CODE (OPTIONAL)</label>
              <div className="flex items-center gap-2 bg-[#0b0f19] border border-[#1f2b45] px-3 py-2.5 rounded-xl text-xs text-white">
                <Key className="w-4 h-4 text-[#FFD400]" />
                <input
                  type="text"
                  placeholder="EX3-YIELD-884"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="bg-transparent flex-1 outline-none font-mono uppercase"
                />
              </div>
            </div>
          )}

          {/* Cloudflare Turnstile CAPTCHA Widget */}
          <div className="bg-[#0b0f19] border border-[#1f2b45] rounded-xl p-2 my-1 flex justify-center">
            <TurnstileWidget 
              action={authMode} 
              onVerify={(token) => setTurnstileToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-[#0b0f19] font-extrabold text-sm uppercase tracking-wider shadow-cyberGlow transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0b0f19]" />
            ) : (
              <>
                <span>{authMode === "login" ? "Unlock Vault" : "Create Cyber Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f2b45]" />
            </div>
            <span className="relative bg-[#131a2a] px-3 text-[11px] text-[#8b98a5] font-mono">
              OR CONTINUE WITH
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuthClick}
            disabled={isGoogleLoading}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#10b981] font-mono mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protected by Exchanger 3th Passkey Security</span>
          </div>

        </form>

      </div>

    </div>
  );
}
