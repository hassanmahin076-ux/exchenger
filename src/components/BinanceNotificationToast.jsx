"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, X, MoreHorizontal, ChevronDown, CheckCircle2, Link as LinkIcon, Sparkles } from 'lucide-react';

// Official Tether (USDT) Emblem Logo Component
function UsdtLogo({ className = "w-5 h-5 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path d="M17.922 17.383c-.11.008-.68.04-1.922.04-1.07 0-1.74-.03-1.896-.04-.035-.125-.136-.576-.136-1.524h3.954V13.84H14c.038-.344.095-.733.17-1.12h7.662V9h-15.66v3.72h3.931c-.08.433-.146.852-.187 1.12h-3.93v2.019h3.94c0 .883.088 1.345.143 1.524-.132.008-.732.04-1.815.04-1.31 0-1.847-.03-1.942-.04L6 20.359c.288.024 1.32.08 2.658.08 1.488 0 2.217-.066 2.398-.08.067-.024.526-.208.972-.736.56-.664.912-1.728 1.056-3.192.176.008 1.08.048 2.872.048 1.68 0 2.616-.04 2.808-.048.144 1.464.496 2.528 1.056 3.192.446.528.905.712.972.736.18.014.91.08 2.398.08 1.338 0 2.37-.056 2.658-.08l-.131-2.976z" fill="#FFFFFF"/>
    </svg>
  );
}

export default function BinanceNotificationToast() {
  const router = useRouter();
  const pathname = usePathname();
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Helper to reliably get logged-in user credentials from localStorage
  const getUserCredentials = useCallback(() => {
    if (typeof window === 'undefined') return { uid: '', email: '' };
    const savedUid = localStorage.getItem('userUid') || '';
    const savedEmail = localStorage.getItem('userEmail') || '';

    let objectUid = '';
    let objectEmail = '';
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        objectUid = parsed?.uid || '';
        objectEmail = parsed?.email || '';
      }
    } catch (e) {}

    return {
      uid: savedUid || objectUid,
      email: savedEmail || objectEmail
    };
  }, []);

  // Unlock AudioContext on first user interaction to bypass autoplay restrictions
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!window.__globalAudioCtx) {
            window.__globalAudioCtx = new AudioCtx();
          }
          if (window.__globalAudioCtx.state === 'suspended') {
            window.__globalAudioCtx.resume();
          }
        }
      } catch (e) {}
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Play crisp dual-frequency bell chime using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      if (!window.__globalAudioCtx || window.__globalAudioCtx.state === 'closed') {
        window.__globalAudioCtx = new AudioCtx();
      }
      const ctx = window.__globalAudioCtx;
      
      const playChime = () => {
        const now = ctx.currentTime;
        
        // Note 1: E5 (659.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.4);

        // Note 2: B5 (987.77 Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(987.77, now + 0.08);
        gain2.gain.setValueAtTime(0.45, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.6);

        // Note 3: E6 (1318.51 Hz) - High shimmering chime
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(1318.51, now + 0.16);
        gain3.gain.setValueAtTime(0.35, now + 0.16);
        gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.16);
        osc3.stop(now + 0.8);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playChime()).catch(() => playChime());
      } else {
        playChime();
      }
    } catch (e) {
      console.log('Notification sound autoplay prevented:', e);
    }
  }, []);

  const triggerToast = useCallback((data) => {
    // Ignore notification if user is currently on admin panel
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    const defaultData = {
      id: data?.id || Date.now(),
      badgeText: data?.badgeText || 'Reward Received',
      sourceTitle: data?.sourceTitle || 'Pokymax Security',
      title: data?.title || 'Your KYC success, 2.1$ receive',
      amount: data?.amount || '+2.10 USDT',
      assetSymbol: data?.assetSymbol || 'USDT',
      walletTag: data?.walletTag || 'Spot Wallet',
      link: data?.link || '/assets'
    };

    setNotification(defaultData);
    setIsVisible(true);
    playNotificationSound();
  }, [playNotificationSound]);

  // Auto disappear after exactly 4 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Global window event listener so user pages can trigger it
  useEffect(() => {
    const handleCustomNotification = (e) => {
      if (e.detail) {
        triggerToast(e.detail);
      }
    };

    window.addEventListener('showBinanceNotification', handleCustomNotification);
    window.triggerBinanceNotification = (data) => triggerToast(data);

    return () => {
      window.removeEventListener('showBinanceNotification', handleCustomNotification);
      delete window.triggerBinanceNotification;
    };
  }, [triggerToast]);

  // Listen to instant BroadcastChannel notifications from Admin Panel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const bc = new BroadcastChannel('kyc_notifications');
      bc.onmessage = (event) => {
        const { uid } = getUserCredentials();
        const targetUid = event.data?.targetUid;

        if (event.data?.type === 'KYC_APPROVED') {
          if (!targetUid || !uid || String(targetUid).trim().toLowerCase() === String(uid).trim().toLowerCase()) {
            localStorage.setItem('kycStatus', 'verified');
            window.dispatchEvent(new Event('kycStatusUpdated'));
            
            triggerToast({
              badgeText: 'Reward Received',
              sourceTitle: 'Pokymax Security',
              title: event.data.message || 'Your KYC success, 2.1$ receive',
              amount: event.data.amount || '+2.10 USDT',
              assetSymbol: 'USDT',
              walletTag: 'Spot Wallet',
              link: '/assets'
            });
          }
        } else if (event.data?.type === 'DEPOSIT_SUCCESS') {
          if (!targetUid || !uid || String(targetUid).trim().toLowerCase() === String(uid).trim().toLowerCase()) {
            triggerToast({
              badgeText: 'Deposit Successful',
              sourceTitle: 'Pokymax Wallet',
              title: event.data.message || 'Your deposit credit',
              amount: event.data.amount || '+0.00 USDT',
              assetSymbol: 'USDT',
              walletTag: 'Spot Wallet',
              link: '/assets'
            });
          }
        }
      };
      return () => bc.close();
    } catch (e) {}
  }, [getUserCredentials, triggerToast]);

  // Check unread database notifications when user is logged in (polling every 2 seconds)
  useEffect(() => {
    let isMounted = true;

    const checkServerNotifications = async () => {
      if (typeof window === 'undefined') return;
      // Do not poll or show user notifications on admin routes
      if (window.location.pathname.startsWith('/admin')) return;

      const { uid, email } = getUserCredentials();
      if (!uid && !email) return;

      try {
        const res = await fetch(`/api/user/notifications?uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}`);
        if (!res.ok) return;
        const data = await res.json();

        if (isMounted && data.success && data.notifications && data.notifications.length > 0) {
          const unreadNotif = data.notifications[0];
          const isDeposit = unreadNotif.type === 'deposit' || unreadNotif.title?.toLowerCase().includes('deposit') || unreadNotif.message?.toLowerCase().includes('deposit');
          
          triggerToast({
            id: unreadNotif.id,
            badgeText: isDeposit ? 'Deposit Successful' : (unreadNotif.type === 'reward' || unreadNotif.title === 'KYC Approved' ? 'Reward Received' : (unreadNotif.title || 'Reward Received')),
            sourceTitle: isDeposit ? 'Pokymax Wallet' : 'Pokymax Security',
            title: unreadNotif.message || (isDeposit ? 'Your deposit credit' : 'Your KYC success, 2.1$ receive'),
            amount: `+${Number(unreadNotif.amount || 0).toFixed(2)} USDT`,
            assetSymbol: 'USDT',
            walletTag: 'Spot Wallet',
            link: '/assets'
          });

          // Mark user KYC status as verified locally if it's a KYC notification
          if (unreadNotif.title?.toLowerCase().includes('kyc') || unreadNotif.message?.toLowerCase().includes('kyc')) {
            localStorage.setItem('kycStatus', 'verified');
            window.dispatchEvent(new Event('kycStatusUpdated'));
          }

          // Mark notification as read on server
          fetch('/api/user/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: unreadNotif.id })
          }).catch(() => {});
        }
      } catch (err) {
        // Silently catch fetch errors (e.g. server restarting or offline)
      }
    };

    checkServerNotifications();
    const interval = setInterval(checkServerNotifications, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getUserCredentials, triggerToast]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDetailsClick = () => {
    setIsVisible(false);
    if (notification?.link) {
      router.push(notification.link);
    }
  };

  // Do not render anything if on admin route or if not visible
  if (pathname?.startsWith('/admin') || !isVisible || !notification) return null;

  return (
    <div className="absolute top-3 left-3 right-3 z-[9999] animate-slideDown select-none">
      
      {/* High-End Dark Glassmorphism Notification Card */}
      <div className="bg-[#12141D]/95 backdrop-blur-2xl border border-white/20 rounded-[22px] p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-white relative font-sans">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-2.5">
          
          {/* Left: White AI Focus Pill Badge & Source Title */}
          <div className="flex items-center gap-2.5">
            
            {/* White Pill Badge matching Binance UI */}
            <div className="px-2.5 py-0.5 rounded-lg bg-white text-black font-extrabold text-[11px] flex items-center gap-1 shadow-sm shrink-0">
              <span className="text-[10px] font-black text-black">A✦</span>
              <span>Focus</span>
            </div>

            {/* Source Name */}
            <div className="flex items-center gap-1.5 text-gray-200 font-extrabold text-xs tracking-tight">
              <Bell className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{notification.sourceTitle}</span>
            </div>

          </div>

          {/* Right Action Icons: Options (...) & Circular Close (X) */}
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button 
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

        </div>

        {/* Title & Body Text */}
        <div className="mb-2.5 pr-1">
          <div className="text-xs leading-snug">
            <span className="text-[#0ECB81] font-extrabold mr-1.5 inline-flex items-center gap-1 text-sm">
              <CheckCircle2 className="w-4 h-4 inline stroke-[2.5]" />
              {notification.badgeText}
            </span>
            <span className="font-bold text-gray-100 text-sm tracking-tight inline">
              {notification.title}
            </span>
            <LinkIcon className="w-3.5 h-3.5 inline text-gray-400 ml-1 opacity-75" />
          </div>
        </div>

        {/* Bottom Sub-Card / Details Bar with Official Tether USDT Emblem */}
        <div className="bg-[#1A1D27]/90 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs shadow-inner">
          
          {/* Coin Icon & Gain Text with Real USDT Logo */}
          <div className="flex items-center gap-2">
            <UsdtLogo className="w-5 h-5 shrink-0" />
            <div className="flex items-center gap-1.5 font-mono">
              <span className="font-bold text-white text-xs">{notification.assetSymbol}</span>
              <span className="text-[#0ECB81] font-extrabold text-xs">{notification.amount}</span>
            </div>
          </div>

          {/* Details Expand/Navigate Link */}
          <button 
            onClick={handleDetailsClick}
            className="text-[#8B5CF6] hover:text-[#A78BFA] font-bold text-xs flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Details</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

        </div>

      </div>

    </div>
  );
}
