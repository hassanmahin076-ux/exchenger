"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Sun, 
  Scan, 
  Settings, 
  Trophy, 
  Ticket, 
  UserPlus, 
  ShieldCheck, 
  FileCheck, 
  UserCheck, 
  BellRing, 
  ChevronRight, 
  Copy, 
  Check, 
  MessageSquare, 
  HelpCircle, 
  Info, 
  Server, 
  LogOut,
  Sparkles,
  LogIn
} from 'lucide-react';

// Helper to mask email like ala12**@gmail.com
const formatMaskedEmail = (rawEmail) => {
  if (!rawEmail) return "ala12**@gmail.com";
  const str = rawEmail.trim();
  if (!str.includes('@')) {
    if (str.length > 5) {
      return `${str.slice(0, 5)}**`;
    }
    return `${str}**`;
  }

  const [name, domain] = str.split('@');
  if (name.length <= 2) {
    return `${name}**@${domain}`;
  } else {
    return `${name.slice(0, 5)}**@${domain}`;
  }
};

export default function ProfilePage() {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");
  const [displayEmail, setDisplayEmail] = useState("");
  const [rawEmail, setRawEmail] = useState("");
  const [userUid, setUserUid] = useState("555345079");
  const [kycStatus, setKycStatus] = useState("unverified");
  const [userAvatar, setUserAvatar] = useState(null);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    const savedEmail = localStorage.getItem('userEmail');
    const savedUid = localStorage.getItem('userUid');
    const savedKyc = localStorage.getItem('kycStatus');
    const savedAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('userAvatarUrl');
    const savedName = localStorage.getItem('userDisplayName');

    if (auth !== null) {
      setIsLoggedIn(auth === 'true');
    } else {
      setIsLoggedIn(false);
    }

    if (savedEmail) {
      setRawEmail(savedEmail);
      setDisplayEmail(formatMaskedEmail(savedEmail));
    }

    if (savedUid) {
      setUserUid(savedUid);
    }

    if (savedKyc) {
      setKycStatus(savedKyc);
    }

    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }

    if (savedName) {
      setCustomName(savedName);
    } else if (savedEmail) {
      setCustomName(savedEmail.split('@')[0]);
    }

    // Fetch authenticated user profile from Express Passport backend /auth/user
    fetch('http://localhost:5000/auth/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          if (data.user.email) {
            setRawEmail(data.user.email);
            setDisplayEmail(formatMaskedEmail(data.user.email));
            localStorage.setItem('userEmail', data.user.email);
          }
          if (data.user.name) {
            setCustomName(data.user.name);
            localStorage.setItem('userDisplayName', data.user.name);
          }
          if (data.user.avatar) {
            setUserAvatar(data.user.avatar);
            localStorage.setItem('userAvatar', data.user.avatar);
            localStorage.setItem('userAvatarUrl', data.user.avatar);
          }
          if (data.user.uid) {
            setUserUid(data.user.uid);
            localStorage.setItem('userUid', data.user.uid);
          }
        }
      })
      .catch(() => {
        // Fallback to Next.js session route
        fetch('/api/auth/session')
          .then(res => res.json())
          .then(data => {
            if (data.isLoggedIn && data.user) {
              setIsLoggedIn(true);
              if (data.user.email) {
                setRawEmail(data.user.email);
                setDisplayEmail(formatMaskedEmail(data.user.email));
              }
              if (data.user.username) setCustomName(data.user.username);
              if (data.user.avatarUrl) setUserAvatar(data.user.avatarUrl);
              if (data.user.uid) setUserUid(data.user.uid);
            }
          })
          .catch(() => {});
      });

    // Fetch live status and balance from PostgreSQL server API
    if (savedUid || savedEmail) {
      fetch(`/api/user/balance?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user?.kycStatus) {
            const serverKycStatus = data.user.kycStatus.toLowerCase();
            setKycStatus(serverKycStatus);
            localStorage.setItem('kycStatus', serverKycStatus);
          }
        })
        .catch(err => console.warn('Profile fetch balance/KYC error:', err));
    }
  }, []);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(userUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', { method: 'POST', credentials: 'include' });
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userUid');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userAvatarUrl');
    localStorage.removeItem('userDisplayName');
    window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: false } }));
    setIsLoggedIn(false);
    router.push('/auth');
  };

  const handleLoginRedirect = () => {
    router.push('/auth');
  };

  // Quick Action Buttons
  const quickActions = [
    { id: 'campaign', label: 'Campaign', icon: Trophy, badge: null, onClick: () => router.push('/camaincenter') },
    { id: 'rewards', label: 'My Rewards', icon: Ticket, badge: null, onClick: () => router.push('/camaincenter/myrewards') },
    { id: 'referral', label: 'Referral', icon: UserPlus, badge: null, onClick: () => router.push('/referral') },
    { id: 'security', label: 'Security', icon: ShieldCheck, badge: 'red-dot', onClick: () => router.push('/satting') },
    { id: 'verify', label: 'Verify', icon: FileCheck, badge: null, onClick: () => router.push('/kycverifyed') },
    { id: 'subaccount', label: 'Sub Account', icon: UserCheck, badge: null, onClick: () => {} },
    { id: 'pricealert', label: 'Price Alert', icon: BellRing, badge: null, onClick: () => {} },
  ];

  // List Items
  const menuList = [
    { id: 'suggestions', label: 'Suggestions', extra: null, onClick: () => router.push('/satting') },
    { 
      id: 'changelog', 
      label: 'Product Changelog', 
      extra: <span className="w-2 h-2 rounded-full bg-[#3b82f6] inline-block ml-1" title="New update" />, 
      onClick: () => router.push('/satting') 
    },
    { id: 'support', label: 'Customer Support', extra: null, onClick: () => router.push('/satting') },
    { id: 'help', label: 'Help Center', extra: null, onClick: () => router.push('/satting') },
    { id: 'about', label: 'About Pokymax', extra: null, onClick: () => router.push('/satting') },
    { 
      id: 'server', 
      label: 'Select Server', 
      extra: <span className="text-xs text-gray-400 font-medium mr-1">Auto Select</span>, 
      onClick: () => router.push('/satting') 
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-12 select-none">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-3.5 py-3.5 flex items-center justify-between border-b border-[#141822] w-full">
        
        {/* Left: Back Arrow */}
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Home"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Right Tools: Theme Sun, Scan QR, Settings Gear */}
        <div className="flex items-center gap-4 text-gray-200">
          <button 
            onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
            className="hover:text-[#aeff00] transition-colors p-1 cursor-pointer"
            title="Toggle Theme"
          >
            <Sun className="w-5 h-5" />
          </button>

          <button 
            className="hover:text-[#aeff00] transition-colors p-1 cursor-pointer"
            title="Scan QR Code"
          >
            <Scan className="w-5 h-5" />
          </button>

          {/* Settings Gear Icon -> Navigates to /satting */}
          <button 
            onClick={() => router.push('/satting')}
            className="hover:text-[#aeff00] transition-colors p-1 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Main Content Body */}
      <div className="px-3.5 pt-3.5 flex flex-col gap-4 w-full">
        
        {/* User Info Profile Row - Clicking profile card does nothing when logged in */}
        <div 
          onClick={() => {
            if (!isLoggedIn) {
              handleLoginRedirect();
            }
          }}
          className="flex items-center justify-between px-1 py-1"
        >
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle with Custom Image or Default Silhouette */}
            <div className="relative w-14 h-14 rounded-full bg-[#84cc16] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md border border-white/10">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-9 h-9 text-[#161920]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}
            </div>

            {/* Email, UID, Status */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isLoggedIn ? (rawEmail || displayEmail || customName || "Google User") : "Guest User"}
                </h2>
              </div>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <span className="font-mono">UID: {userUid}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopyUid(); }}
                      className="p-0.5 hover:text-white transition-colors cursor-pointer"
                      title="Copy UID"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#0ecb81]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                      )}
                    </button>
                    {copied && (
                      <span className="text-[10px] text-[#0ecb81] font-sans animate-fadeIn">Copied</span>
                    )}
                  </div>

                  <div 
                    onClick={(e) => { e.stopPropagation(); router.push('/kycverifyed'); }}
                    className="flex items-center gap-1.5 mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                    title="Click to Check KYC Status"
                  >
                    <span className="text-xs text-gray-400 font-medium">KYC</span>
                    {kycStatus === 'verified' || kycStatus === 'Verified' ? (
                      <span className="text-[10px] font-bold text-[#0ecb81] bg-[#0ecb81]/10 border border-[#0ecb81]/50 px-2 py-0.5 rounded-md leading-none flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Verified</span>
                      </span>
                    ) : kycStatus === 'pending' || kycStatus === 'under_review' ? (
                      <span className="text-[10px] font-bold text-[#eab308] bg-[#eab308]/10 border border-[#eab308]/50 px-2 py-0.5 rounded-md leading-none">
                        Under Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#ff453a] bg-[#ff3b30]/10 border border-[#ff3b30]/50 px-2 py-0.5 rounded-md leading-none">
                        Unverified
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs text-gray-400 hover:text-[#aeff00] transition-colors cursor-pointer">
                  Tap to Sign up / Log in
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>

        {/* VIP 0 Banner */}
        <div className="w-full bg-[#181a20] border border-[#262a35] rounded-2xl p-4 flex items-center justify-between shadow-lg my-1">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide flex items-center gap-1">
              <span>VIP 0</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              View My VIP Status
            </span>
          </div>

          <div className="w-12 h-12 flex items-center justify-center relative opacity-95">
            <svg className="w-11 h-11 text-gray-300" viewBox="0 0 100 100" fill="none">
              <path d="M50 15 L85 32 L85 68 L50 85 L15 68 L15 32 Z" stroke="currentColor" strokeWidth="3" fill="none" />
              <path d="M50 15 L50 85" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
              <path d="M15 32 L85 68" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
              <path d="M85 32 L15 68" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="10" stroke="#aeff00" strokeWidth="3" fill="#181a20" />
            </svg>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-4 gap-y-5 gap-x-2 my-2 py-2">
          {quickActions.map((action) => {
            const IconComp = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="relative w-11 h-11 flex items-center justify-center text-gray-200 group-hover:text-white transition-colors">
                  <IconComp className="w-6 h-6 stroke-[1.8]" />
                  {action.badge === 'red-dot' && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#ff3b30] ring-2 ring-black" />
                  )}
                </div>
                <span className="text-[11px] text-gray-300 font-medium text-center mt-1.5 leading-tight w-full truncate group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#181b22] my-0.5 w-full" />

        {/* Vertical Menu List Items */}
        <div className="flex flex-col divide-y divide-[#181b22] w-full">
          {menuList.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                {item.label}
              </span>

              <div className="flex items-center gap-1">
                {item.extra}
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Auth Action Button */}
        <div className="mt-3 w-full flex justify-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full max-w-[280px] py-2.5 rounded-xl bg-[#2b1719] hover:bg-[#381c1f] border border-[#d32f2f]/40 text-[#ff5252] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="w-full max-w-[280px] py-2.5 rounded-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign up / Log in</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
