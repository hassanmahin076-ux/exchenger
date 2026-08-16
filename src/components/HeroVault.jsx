"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ShieldCheck, Eye, EyeOff, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroVault({ onOpenAuth, onOpenTasks }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 59, seconds: 59 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [isTrendingUp, setIsTrendingUp] = useState(true);

  const [userBalanceUsdt, setUserBalanceUsdt] = useState(0.00);

  useEffect(() => {
    const fetchBalance = () => {
      const auth = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(auth === 'true');

      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');
      if (savedUid || savedEmail) {
        fetch(`/api/user/balance?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.balance) {
              setUserBalanceUsdt(data.balance.totalUsdt);
            }
          })
          .catch(err => console.warn('HeroVault fetch balance error:', err));
      }
    };

    fetchBalance();

    window.addEventListener('storage', fetchBalance);
    window.addEventListener('authChange', fetchBalance);

    return () => {
      window.removeEventListener('storage', fetchBalance);
      window.removeEventListener('authChange', fetchBalance);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (num) => String(num).padStart(2, '0');

  const [graphKey, setGraphKey] = useState(0);
  const [isJittering, setIsJittering] = useState(false);

  const handleGraphTap = () => {
    setGraphKey(prev => prev + 1);
    setIsJittering(true);
    setTimeout(() => setIsJittering(false), 750);
  };

  // LOGGED IN DASHBOARD VIEW (Matching 1st & 2nd Images)
  if (isLoggedIn) {
    return (
      <section className="flex flex-col pt-3 pb-0 px-4 bg-[#000000] text-white select-none">
        
        {/* Inline CSS animation for sparkline draw */}
        <style>{`
          @keyframes sparklineDraw {
            0% {
              stroke-dashoffset: 300;
              opacity: 0.2;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
        `}</style>

        {/* Total Value Header Row matching Images 1 & 2 */}
        <div className="flex items-start justify-between mb-1">
          
          {/* Left Column: Total Value & Balances */}
          <div className="flex flex-col">
            {/* Label + Eye Icon */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 font-medium">
              <span>Total Value</span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white transition-colors"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Main Balance Display */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight font-sans leading-none">
                {showBalance ? (userBalanceUsdt > 0 ? userBalanceUsdt.toFixed(2) : "0.00") : "••••••"}
              </span>
              <button className="text-xs font-bold text-white flex items-center gap-0.5 hover:text-gray-200">
                <span>USDT</span>
                <span className="text-[9px] text-white">▼</span>
              </button>
            </div>

            {/* Sub-balance in BTC */}
            <button className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 hover:text-gray-300 font-sans">
              <span>≈ {showBalance ? (userBalanceUsdt > 0 ? (userBalanceUsdt / 64037.84).toFixed(8) : "0.00000000") : "••••••••"} BTC</span>
              <span className="text-[8px] text-gray-500">▼</span>
            </button>
          </div>

          {/* Right Column: Deposit Button & Interactive Neon Green Graph */}
          <div className="flex flex-col items-end gap-1.5">
            
            {/* Deposit Pill Button */}
            <button
              onClick={() => router.push('/assets?action=deposit')}
              className="bg-white hover:bg-gray-100 text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95 mt-1 cursor-pointer"
            >
              Deposit
            </button>

            {/* Live Neon Green Sparkline Graph (Tap to Animate & Fluctuate) */}
            <div 
              onClick={handleGraphTap}
              className="flex flex-col items-end cursor-pointer group p-1 -mr-1 rounded-lg hover:bg-[#181a20]/60 transition-colors"
              title="Tap to trigger graph animation"
            >
              <div className="relative w-28 h-8 overflow-hidden flex items-center justify-end">
                <svg className="w-full h-full" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="neonGlowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ff66" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill under neon curve */}
                  <path
                    d="M 2 24 L 14 16 L 22 20 L 32 12 L 42 16 L 55 4 L 68 18 L 82 8 L 94 14 L 106 3 L 106 32 L 2 32 Z"
                    fill="url(#neonGlowGrad)"
                  />

                  {/* Neon Green Stepped Peak Line matching Screenshot */}
                  <path
                    key={graphKey}
                    d="M 2 24 L 14 16 L 22 20 L 32 12 L 42 16 L 55 4 L 68 18 L 82 8 L 94 14 L 106 3"
                    stroke="#00ff66"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: 0,
                      animation: 'sparklineDraw 0.75s ease-out forwards',
                      filter: 'drop-shadow(0px 0px 6px #00ff66)'
                    }}
                    className={isJittering ? 'animate-pulse' : ''}
                  />

                  {/* Live Pulsing Glowing Tip Dot */}
                  <circle
                    cx="106"
                    cy="3"
                    r="3.5"
                    fill="#00ff66"
                    className="animate-ping opacity-75"
                  />
                  <circle
                    cx="106"
                    cy="3"
                    r="2.5"
                    fill="#00ff66"
                    style={{ filter: 'drop-shadow(0px 0px 4px #00ff66)' }}
                  />
                </svg>
              </div>

              {/* Live Trend Percentage Indicator & Tap Hint */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span className="font-bold text-[#00ff66] flex items-center gap-0.5 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  <span>+0.00%</span>
                </span>
                <span className="text-gray-500 font-sans text-[9px]">24h</span>
              </div>
            </div>

          </div>

        </div>

      </section>
    );
  }

  // GUEST VIEW (Before Sign Up / Log In)
  return (
    <section className="flex flex-col items-center text-center pt-2 pb-4 px-4 bg-[#000000]">
      
      {/* Reward Image Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-1 flex items-center justify-center">
        <img
          src="/reward.png"
          alt="Crypto Bonus Treasure Box"
          className="w-full h-full object-contain"
          onError={(e) => { e.preventDefault(); }}
        />
      </div>

      {/* Main Title matching user screenshot */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-xs mb-1">
        Up to <span className="text-[#aeff00] font-black">10,000 USDT</span> Bonus for New Users
      </h1>

      <p className="text-xs text-gray-400 mb-4">
        Sign up now for limited-time rewards
      </p>

      {/* Countdown Timer Blocks */}
      <div className="flex items-center justify-center gap-1.5 font-mono text-sm mb-3">
        <div className="bg-[#181a20] border border-[#2b2f36] px-2.5 py-1 rounded text-white font-bold">
          {formatUnit(timeLeft.days)}D
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="bg-[#181a20] border border-[#2b2f36] px-2.5 py-1 rounded text-white font-bold">
          {formatUnit(timeLeft.hours)}H
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="bg-[#181a20] border border-[#2b2f36] px-2.5 py-1 rounded text-white font-bold">
          {formatUnit(timeLeft.minutes)}M
        </div>
        <span className="text-gray-400 font-bold">:</span>
        <div className="bg-[#181a20] border border-[#2b2f36] px-2.5 py-1 rounded text-white font-bold">
          {formatUnit(timeLeft.seconds)}S
        </div>
      </div>

      {/* Task Center Link */}
      <button 
        onClick={onOpenTasks}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mb-5 font-medium"
      >
        <span>Task Center</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Full-width Electric Lime Green Button */}
      <button
        onClick={onOpenAuth}
        className="w-full py-3.5 rounded-full bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Open lid slants */}
          <path d="M5 8.5L11 5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 5L18 8.5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 5L15 2.5" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Teal coin peeking out */}
          <circle cx="11.5" cy="10" r="3" fill="#00d294" />
          {/* Main black box */}
          <rect x="5" y="12" width="13" height="8" rx="1.5" fill="#000000" />
          {/* White badge on bottom right */}
          <rect x="13.5" y="16.5" width="3.5" height="2" rx="0.5" fill="#ffffff" />
        </svg>
        <span>Sign up / Log In</span>
      </button>

      {/* Proof of Reserves Trust Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3 font-medium">
        <ShieldCheck className="w-4 h-4 text-gray-400" />
        <span>100% Proof of Reserves (PoR) Verified</span>
      </div>

    </section>
  );
}
