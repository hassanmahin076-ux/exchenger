"use client";

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Repeat, 
  TrendingUp, 
  Gift, 
  Lock, 
  Headphones, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Award,
  ChevronRight,
  Layers,
  FileCheck
} from 'lucide-react';

function AboutPokymaxContent() {
  const router = useRouter();

  const steps = [
    {
      stepNumber: "01",
      title: "Quick Registration & Security",
      subtitle: "Instant Access & Military-Grade Protection",
      icon: ShieldCheck,
      color: "from-amber-500 to-yellow-400",
      details: [
        "Sign up in seconds using Google One-Tap or Passkey credentials.",
        "Automated KYC verification approved within 5 to 15 minutes.",
        "Two-factor authentication (2FA) and cold wallet isolation protect all accounts."
      ]
    },
    {
      stepNumber: "02",
      title: "Multi-Chain Asset Vault",
      subtitle: "Seamless Deposits & Zero-Fee Transfers",
      icon: Zap,
      color: "from-emerald-500 to-teal-400",
      details: [
        "Deposit USDT, BTC, ETH, and major tokens via TRC20, BEP20, and ERC20 networks.",
        "Real-time asset tracking with zero internal transfer fees between accounts.",
        "Instant withdrawal processing with automated on-chain verification."
      ]
    },
    {
      stepNumber: "03",
      title: "Spot & 125x Perpetual Futures",
      subtitle: "High Liquidity & Precision Execution Engine",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500",
      details: [
        "Trade spot market crypto pairs with ultra-low 0.1% transaction fees.",
        "Access up to 125x leverage on perpetual futures contracts.",
        "Integrated TradingView charting with real-time Take-Profit and Stop-Loss orders."
      ]
    },
    {
      stepNumber: "04",
      title: "P2P Escrow Marketplace",
      subtitle: "Zero-Fee Local Currency Trading",
      icon: Repeat,
      color: "from-purple-500 to-indigo-500",
      details: [
        "Buy and sell crypto directly using your preferred local bank and mobile payment methods.",
        "100% escrow protection guarantees seller funds before releasing crypto.",
        "24/7 dedicated dispute Resolution agents available for instant support."
      ]
    },
    {
      stepNumber: "05",
      title: "Rewards, Referrals & Red Packets",
      subtitle: "Maximize Earnings Through Ecosystem Incentives",
      icon: Gift,
      color: "from-rose-500 to-pink-500",
      details: [
        "Claim instant welcome credit upon completing identity verification.",
        "Earn up to 40% commission rebates by inviting friends with your referral code.",
        "Receive Red Packet crypto gifts and task center mission bonuses daily."
      ]
    }
  ];

  const highlights = [
    { title: "1.4M TPS Engine", desc: "Ultra-fast matching engine handling 1.4 million transactions per second.", icon: Zap },
    { title: "100% Cold Storage", desc: "User funds are stored in multi-signature offline cold storage vaults.", icon: Lock },
    { title: "24/7 Live Support", desc: "Round-the-clock dedicated customer assistance via live ticket support.", icon: Headphones },
    { title: "Global Ecosystem", desc: "Serving millions of active crypto traders worldwide with multi-language UI.", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto relative border-x border-[#1e2329] shadow-2xl selection:bg-[#aeff00] selection:text-black">
      
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#181a20]">
        <button
          onClick={() => router.push('/profile')}
          className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Profile</span>
        </button>

        <h1 className="text-base font-extrabold text-white tracking-tight">About Pokymax</h1>

        <div className="w-6" /> {/* Spacer */}
      </header>

      {/* 2. Hero Header Banner */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-[#121620] to-[#000000] border-b border-[#181a20]">
        
        {/* Glow Background */}
        <div className="absolute top-0 w-48 h-48 bg-[#aeff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#aeff00] to-emerald-500 p-0.5 shadow-2xl mb-3 flex items-center justify-center">
          <div className="w-full h-full rounded-[14px] bg-[#0c0e12] flex items-center justify-center">
            <span className="font-mono font-black text-2xl text-[#aeff00] tracking-tighter">PMX</span>
          </div>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 justify-center">
          <span>Pokymax Exchange</span>
          <Sparkles className="w-5 h-5 text-[#aeff00] animate-pulse" />
        </h2>

        <p className="text-xs text-gray-300 mt-2 leading-relaxed max-w-[340px]">
          Next-generation crypto trading matrix delivering high-speed 125x perpetual leverage, zero-fee P2P escrow, and real-time yield rewards.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-[#1e2329]">
          <div className="flex flex-col items-center p-2 bg-[#12141a] rounded-xl border border-[#232730]">
            <span className="text-sm font-black text-[#aeff00] font-mono">125x</span>
            <span className="text-[10px] text-gray-400 font-medium">Max Leverage</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-[#12141a] rounded-xl border border-[#232730]">
            <span className="text-sm font-black text-[#0ecb81] font-mono">0% Fee</span>
            <span className="text-[10px] text-gray-400 font-medium">P2P Escrow</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-[#12141a] rounded-xl border border-[#232730]">
            <span className="text-sm font-black text-amber-400 font-mono">24/7</span>
            <span className="text-[10px] text-gray-400 font-medium">Live Support</span>
          </div>
        </div>

      </div>

      {/* 3. Main Step-by-Step Guide Section */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-6 pb-24">
        
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-gray-400">
            How Pokymax Works Step by Step
          </h3>
          <p className="text-xs text-gray-400">
            Follow these steps to navigate and maximize your trading experience on Pokymax.
          </p>
        </div>

        {/* Step Cards List */}
        <div className="flex flex-col gap-4">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#12141a] border border-[#232730] hover:border-[#353b49] rounded-2xl p-4 flex flex-col gap-3 relative shadow-lg transition-all"
              >
                {/* Top Step Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} p-0.5 shrink-0 shadow-md`}>
                      <div className="w-full h-full bg-[#12141a] rounded-[10px] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black font-mono text-gray-500 bg-[#1a1d26] px-2 py-1 rounded-md border border-[#232730]">
                    STEP {item.stepNumber}
                  </span>
                </div>

                {/* Details Bullet Points */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#1e2329]">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#aeff00] shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-300 leading-snug">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* 4. Platform Trust & Security Pillars */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#181a20]">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-gray-400">
            Why Traders Choose Pokymax
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {highlights.map((h, hIdx) => {
              const HIcon = h.icon;
              return (
                <div 
                  key={hIdx}
                  className="bg-[#12141a] border border-[#232730] p-3.5 rounded-2xl flex flex-col gap-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1c202a] border border-[#2f3544] flex items-center justify-center text-[#aeff00] mb-0.5">
                    <HIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">{h.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Bottom Action CTAs */}
        <div className="flex flex-col gap-2.5 pt-4">
          <button
            onClick={() => router.push('/markets')}
            className="w-full py-3.5 rounded-2xl bg-[#aeff00] hover:bg-[#9ded00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
          >
            <span>Start Trading Markets</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={() => router.push('/support')}
            className="w-full py-3.5 rounded-2xl bg-[#161922] hover:bg-[#202532] text-white border border-[#283042] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-[#aeff00]" />
            <span>Contact 24/7 Customer Support</span>
          </button>
        </div>

      </main>

    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <AboutPokymaxContent />
    </Suspense>
  );
}
