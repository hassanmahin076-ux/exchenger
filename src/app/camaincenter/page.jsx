"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  X, 
  Gift,
  ChevronRight,
  Info,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Clock,
  RotateCw,
  XCircle,
  Copy
} from 'lucide-react';

// Custom Ticket/Coupon Badge Component matching 2nd image design
const TicketCouponBadge = ({ amount, unit }) => {
  return (
    <div className="relative flex items-stretch h-[64px] rounded-lg overflow-hidden flex-shrink-0 shadow-md select-none">
      {/* Left Main Body (Site Lime Green Ticket Body) */}
      <div className="relative bg-gradient-to-r from-[#97f252] via-[#85e640] to-[#55c826] text-[#0d2e02] flex flex-col items-center justify-center px-2.5 min-w-[62px] border-r border-[#000000]/10">
        
        {/* Top Center Notch (Semi-circle cutout matching card background #16171b) */}
        <div className="absolute -top-[7px] -right-[7px] w-3.5 h-3.5 bg-[#16171b] rounded-full z-20 border border-[#16171b]" />
        
        {/* Bottom Center Notch (Semi-circle cutout matching card background #16171b) */}
        <div className="absolute -bottom-[7px] -right-[7px] w-3.5 h-3.5 bg-[#16171b] rounded-full z-20 border border-[#16171b]" />

        {/* Inner Decorative Box */}
        <div className="flex flex-col items-center justify-center border border-[#0d2e02]/25 rounded-md px-1.5 py-0.5 w-full h-[52px]">
          <span className="font-black text-xl leading-none tracking-tight text-[#0d2e02]">
            {amount}
          </span>
          <span className="font-extrabold text-[10px] tracking-tight mt-0.5 text-[#0d2e02]">
            {unit}
          </span>
        </div>
      </div>

      {/* Right Stub Section (Pink/Magenta with Vertical Barcode & Scalloped Right Edge) */}
      <div className="relative bg-[#E8397D] flex items-center justify-center px-2.5 w-[36px] overflow-hidden">
        
        {/* Barcode Lines Graphic */}
        <div className="flex items-center gap-[2px] h-[34px] opacity-85">
          <div className="w-[2px] h-full bg-[#1a000c]" />
          <div className="w-[1px] h-full bg-[#1a000c]" />
          <div className="w-[3px] h-full bg-[#1a000c]" />
          <div className="w-[1px] h-full bg-[#1a000c]" />
          <div className="w-[2px] h-full bg-[#1a000c]" />
          <div className="w-[1px] h-full bg-[#1a000c]" />
          <div className="w-[2.5px] h-full bg-[#1a000c]" />
        </div>

        {/* Right Edge Scalloped (Semi-circle punched holes matching card background #16171b) */}
        <div className="absolute -right-[4.5px] top-0 bottom-0 flex flex-col justify-between py-1.5 z-20">
          <div className="w-2.5 h-2.5 bg-[#16171b] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#16171b] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#16171b] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#16171b] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#16171b] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default function CampaignCenterPage() {
  const router = useRouter();

  // 3 Separate Countdown Timer States:
  // 1. Fast 10$ Deposit (3 Days)
  const [timer1, setTimer1] = useState({ days: 3, hours: 23, minutes: 59, seconds: 59 });
  // 2. First Spot Trade (7 Days)
  const [timer2, setTimer2] = useState({ days: 7, hours: 23, minutes: 59, seconds: 59 });
  // 3. KYC Bonus (24 Hours)
  const [timer3, setTimer3] = useState({ days: 0, hours: 23, minutes: 59, seconds: 59 });

  // Modal, Apply & Claim States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [kycStatus, setKycStatus] = useState("unverified");
  const [isKycClaimed, setIsKycClaimed] = useState(false);
  // Page Loading Progress & Menu state
  const [toastMessage, setToastMessage] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const startPageLoading = () => {
    setIsLoading(true);
    setLoadProgress(15);
    const t1 = setTimeout(() => setLoadProgress(45), 180);
    const t2 = setTimeout(() => setLoadProgress(75), 400);
    const t3 = setTimeout(() => setLoadProgress(100), 650);
    const t4 = setTimeout(() => setIsLoading(false), 850);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  };

  useEffect(() => {
    startPageLoading();

    // Check local storage for tasks & kyc status
    if (typeof window !== 'undefined') {
      const applied = localStorage.getItem('taskCouponApplied') === 'true';
      if (applied) setIsApplied(true);

      const savedKyc = localStorage.getItem('kycStatus');
      if (savedKyc) setKycStatus(savedKyc);

      const kycClaimed = localStorage.getItem('taskKycClaimed') === 'true';
      if (kycClaimed) setIsKycClaimed(true);
    }

    const timer = setInterval(() => {
      // Timer 1: 3 Days
      setTimer1(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });

      // Timer 2: 7 Days
      setTimer2(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });

      // Timer 3: 24 Hours
      setTimer3(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num) => String(num).padStart(2, '0');

  const showToast = (text, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApply = () => {
    if (isApplied) {
      router.push('/assets?action=deposit');
      return;
    }

    if (isApplying) return;

    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('taskCouponApplied', 'true');
      }
      showToast("🎉 Coupon applied! Click 'Deposit 10$' to complete deposit.");
    }, 1200);
  };

  const handleKycClaim = () => {
    if (isKycClaimed) return;
    setIsKycClaimed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskKycClaimed', 'true');
    }
    showToast("🎉 Success! $2.1 Instant KYC Bonus Claimed!");
  };

  const handleClaim = () => {
    const hasApplied = isApplied || (typeof window !== 'undefined' && localStorage.getItem('taskCouponApplied') === 'true');
    
    if (!hasApplied) {
      showToast("⚠️ Please click 'Apply' and complete deposit first!", true);
      return;
    }

    if (isClaimed) {
      showToast("Coupon already claimed to your spot withdraw balance!");
      return;
    }

    setIsClaimed(true);
    showToast("🎉 Success! $3 Instant Spot Withdraw Balance Claimed!");
  };

  const taskData = {
    title: "Fast 10$ Deposit 3$ Coupon Apply",
    desc: "Get 3$ instant spot withdraw balance",
    amount: "3",
    unit: "USDT",
    steps: [
      { num: 1, text: "Click Apply to open your USDT Deposit Address." },
      { num: 2, text: "Deposit minimum 10$ (Must select USDT BEP20 Network)." },
      { num: 3, text: "After deposit completes on-chain, click Claim." },
      { num: 4, text: "Receive 3$ instant spot withdraw balance immediately!" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-16 select-none relative">
      
      {/* Toast Notification (Supports Error & Success) */}
      {toastMessage && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90vw] text-center ${
          toastMessage.isError 
            ? 'bg-[#3d1214] border border-[#ff4d4d]/80 text-[#ff6666]' 
            : 'bg-[#1e2538] border border-[#38bdf8]/40 text-white'
        }`}>
          {toastMessage.isError ? (
            <Info className="w-4 h-4 text-[#ff6666] flex-shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#85e640] flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar matching Image (Fixed at top on scroll) */}
      <header className="fixed top-0 inset-x-0 max-w-[430px] mx-auto z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#141822] w-full">
        
        {/* Left: Back Arrow */}
        <button
          onClick={() => router.push('/profile')}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Profile"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Center Title */}
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight text-center">
          Campaign Center
        </h1>

        {/* Right: Pill Button with ... and X matching Pokymax App Header */}
        <div className="flex items-center bg-[#1e222d] border border-[#2b303f] rounded-full px-2.5 py-1 gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer p-0.5"
            title="Options Menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3.5 bg-gray-600/60" />
          <button 
            onClick={() => router.push('/profile')}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer p-0.5"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CHROME STYLE TOP PAGE LOADING PROGRESS BAR */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-[#141822] overflow-hidden pointer-events-none">
          <div 
            className="h-full bg-[#8cff00] transition-all duration-300 ease-out shadow-[0_0_12px_#8cff00]"
            style={{ 
              width: `${loadProgress}%`, 
              opacity: isLoading || loadProgress < 100 ? 1 : 0 
            }}
          />
        </div>

        {/* 3-DOT OPTIONS DROPDOWN POPOVER MENU */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsMenuOpen(false)} 
            />

            {/* Menu Popover */}
            <div className="absolute top-12 right-4 z-50 bg-[#161922] border border-[#2b3040] rounded-2xl p-1.5 shadow-2xl w-44 text-xs flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Option 1: Reload Page */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  startPageLoading();
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#232836] text-gray-200 hover:text-white transition-colors text-left font-medium cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-[#8cff00]" />
                <span>Reload Page</span>
              </button>

              {/* Option 2: Copy Page Link */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#232836] text-gray-200 hover:text-white transition-colors text-left font-medium cursor-pointer"
              >
                <Copy className="w-4 h-4 text-blue-400" />
                <span>Copy Page Link</span>
              </button>

              <div className="h-[1px] bg-[#262b3a] my-0.5" />

              {/* Option 3: Close Tab */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/profile');
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#381a1c] text-red-400 hover:text-red-300 transition-colors text-left font-medium cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Close Tab</span>
              </button>

            </div>
          </>
        )}

      </header>

      {/* Main Campaign Center Content */}
      <div className="px-4 pt-16 flex flex-col gap-5 w-full max-w-[430px] mx-auto">
        
        {/* Top Hero Section matching Image */}
        <div className="flex flex-col items-center text-center gap-3 pt-1 mb-1">
          
          {/* Top Campaign Image Logo (/public/campain.png) */}
          <div className="my-1 flex items-center justify-center">
            <img 
              src="/campain.png" 
              alt="Campaign Center Logo" 
              className="w-64 sm:w-72 h-auto object-contain transition-transform hover:scale-105" 
            />
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col gap-1.5 items-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              Campaign Center
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-[300px] mx-auto">
              Enter the campaign, receive rewards and start your crypto journey!
            </p>
          </div>

          {/* Action Button: My Rewards */}
          <button 
            onClick={() => router.push('/camaincenter/myrewards')}
            className="bg-[#212735] border border-[#313747] hover:bg-[#2b3143] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 mt-1"
          >
            <Gift className="w-4 h-4 text-[#85e640]" />
            <span>My Rewards</span>
          </button>

        </div>

        {/* Task Box Container */}
        <div className="flex flex-col">
          
          {/* Task Card 1: Identity Verification (KYC) Bonus */}
          <div className="relative bg-[#16171b] border border-[#24262d] rounded-[24px] p-5 flex flex-col gap-4 shadow-xl overflow-hidden">
            
            {/* Top Right Timer Badge (24 Hours) */}
            <div className="absolute top-0 right-0 bg-[#212329] text-gray-200 text-[11px] font-mono font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-[22px] border-l border-b border-[#2d3039] tracking-wider">
              {formatTwoDigits(timer3.days)}D : {formatTwoDigits(timer3.hours)} : {formatTwoDigits(timer3.minutes)} : {formatTwoDigits(timer3.seconds)}
            </div>

            {/* Content Row: Left Ticket Badge + Title/Description */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-start gap-3.5">
                {/* Coupon Ticket Badge matching Image 2 */}
                <TicketCouponBadge amount="2.1" unit="USDT" />

                {/* Title & Description */}
                <div className="flex flex-col justify-center max-w-[180px] sm:max-w-[200px]">
                  <h3 className="text-white font-bold text-base sm:text-[17px] tracking-tight leading-snug">
                    KYC Bonus 2.1 USDT
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-[13px] font-normal mt-1 leading-snug">
                    Complete identity verification to receive reward
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Action Button based on KYC status */}
            {kycStatus === 'verified' || kycStatus === 'approved' ? (
              <button
                onClick={handleKycClaim}
                disabled={isKycClaimed}
                className={`w-full font-black text-base py-3.5 rounded-full transition-all active:opacity-90 cursor-pointer shadow-lg mt-1 select-none ${
                  isKycClaimed 
                    ? 'bg-[#10b981]/30 text-[#10b981]' 
                    : 'bg-[#85e640] hover:bg-[#76d335] text-[#0c2e02]'
                }`}
              >
                {isKycClaimed ? "Claimed ✓" : "Claim"}
              </button>
            ) : kycStatus === 'pending' || kycStatus === 'under_review' ? (
              <button
                disabled
                className="w-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] font-extrabold text-base py-3.5 rounded-full cursor-not-allowed shadow-lg mt-1 select-none flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5 animate-pulse text-[#f59e0b]" />
                <span>Pending</span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/kycverifyed')}
                className="w-full bg-white hover:bg-gray-100 text-black font-black text-base py-3.5 rounded-full transition-all active:opacity-90 cursor-pointer shadow-lg mt-1 select-none"
              >
                Verification
              </button>
            )}

          </div>

          {/* Task Card 2: Fast 10$ Deposit 3$ Coupon Apply */}
          <div className="relative bg-[#16171b] border border-[#24262d] rounded-[24px] p-5 flex flex-col gap-4 shadow-xl overflow-hidden mt-2">
            
            {/* Top Right Timer Badge (3 Days) */}
            <div className="absolute top-0 right-0 bg-[#212329] text-gray-200 text-[11px] font-mono font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-[22px] border-l border-b border-[#2d3039] tracking-wider">
              {timer1.days}D : {formatTwoDigits(timer1.hours)} : {formatTwoDigits(timer1.minutes)} : {formatTwoDigits(timer1.seconds)}
            </div>

            {/* Content Row: Left Ticket Badge + Title/Description + Right Details Option */}
            <div className="flex items-start justify-between gap-2.5 pt-1">
              
              <div className="flex items-start gap-3">
                {/* Coupon Ticket Badge matching Image 2 */}
                <TicketCouponBadge amount={taskData.amount} unit={taskData.unit} />

                {/* Title & Description */}
                <div className="flex flex-col justify-center max-w-[160px] sm:max-w-[180px]">
                  <h3 className="text-white font-bold text-base sm:text-[17px] tracking-tight leading-snug">
                    {taskData.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-[13px] font-normal mt-1 leading-snug">
                    {taskData.desc}
                  </p>
                </div>
              </div>

              {/* Details > Option */}
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="mt-7 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 bg-[#23252c] hover:bg-[#2d3039] px-2.5 py-1.5 rounded-full border border-[#31343f] transition-all cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

            </div>

            {/* Seamless Joined Split Pill Button Container */}
            <div className="w-full rounded-full overflow-hidden flex border border-[#30333d] shadow-lg mt-1 select-none">
              
              {/* Left Half: Apply (White Background) */}
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="flex-1 bg-white hover:bg-gray-100 text-black font-black text-base py-3.5 flex items-center justify-center gap-2 transition-all active:opacity-90 cursor-pointer disabled:opacity-80"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span>Applying...</span>
                  </>
                ) : isApplied ? (
                  "Deposit 10$"
                ) : (
                  "Apply"
                )}
              </button>

              {/* Right Half: Claim (Lime Green Background) */}
              <button
                onClick={handleClaim}
                className={`flex-1 font-black text-base py-3.5 flex items-center justify-center transition-all active:opacity-90 cursor-pointer ${
                  isClaimed 
                    ? 'bg-[#10b981]/30 text-[#10b981]' 
                    : 'bg-[#85e640] hover:bg-[#76d335] text-[#0c2e02]'
                }`}
              >
                {isClaimed ? "Claimed ✓" : "Claim"}
              </button>

            </div>

          </div>

          {/* Task Card 3: First Spot Trade */}
          <div className="relative bg-[#16171b] border border-[#24262d] rounded-[24px] p-5 flex flex-col gap-4 shadow-xl overflow-hidden mt-2">
            
            {/* Top Right Timer Badge (7 Days) */}
            <div className="absolute top-0 right-0 bg-[#212329] text-gray-200 text-[11px] font-mono font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-[22px] border-l border-b border-[#2d3039] tracking-wider">
              {timer2.days}D : {formatTwoDigits(timer2.hours)} : {formatTwoDigits(timer2.minutes)} : {formatTwoDigits(timer2.seconds)}
            </div>

            {/* Content Row: Left Ticket Badge + Title/Description */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-start gap-3.5">
                {/* Coupon Ticket Badge matching Image 2 */}
                <TicketCouponBadge amount="2" unit="USDT" />

                {/* Title & Description */}
                <div className="flex flex-col justify-center max-w-[180px] sm:max-w-[200px]">
                  <h3 className="text-white font-bold text-base sm:text-[17px] tracking-tight leading-snug">
                    First Spot Trade
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-[13px] font-normal mt-1 leading-snug">
                    First spot buy amount ≥ 20 USDT
                  </p>
                </div>
              </div>
            </div>

            {/* Full-width White Trade Button matching screenshot */}
            <button
              onClick={() => router.push('/trade')}
              className="w-full bg-white hover:bg-gray-100 text-black font-black text-base py-3.5 rounded-full transition-all active:opacity-90 cursor-pointer shadow-lg mt-1 select-none"
            >
              Trade
            </button>

          </div>

          {/* Bottom "No more tasks available" Footer Text */}
          <div className="flex items-center justify-center pt-8 pb-4 text-xs font-semibold text-gray-500 tracking-wider select-none">
            No more tasks available
          </div>

        </div>

      </div>

      {/* STEP-BY-STEP DETAILS POPUP MODAL */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsDetailsOpen(false)} 
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-[430px] bg-[#14161b] border-t sm:border border-[#262933] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Top Handle Bar for mobile */}
            <div className="w-10 h-1 bg-[#2c2f3a] rounded-full mx-auto sm:hidden -mt-1"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222530]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#85e640]" />
                <h3 className="font-extrabold text-base text-white">Task Details & Rules</h3>
              </div>

              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#1f222b] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Task Info Summary */}
            <div className="bg-[#1c1f27] border border-[#2a2e3a] p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white">{taskData.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{taskData.desc}</p>
              </div>

              <div className="bg-gradient-to-b from-[#97f252] to-[#55c826] text-[#0d2e02] px-3 py-1.5 rounded-xl font-black text-sm flex items-center justify-center shadow-sm">
                {taskData.amount} {taskData.unit}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="flex flex-col gap-3 my-1">
              <h5 className="text-xs font-bold text-[#85e640] uppercase tracking-wider">
                Step-by-Step Instructions:
              </h5>

              <div className="flex flex-col gap-2.5">
                {taskData.steps.map((step) => (
                  <div key={step.num} className="flex items-start gap-3 bg-[#181b22] p-3 rounded-xl border border-[#232733]">
                    <span className="w-6 h-6 rounded-full bg-[#85e640]/20 text-[#85e640] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#85e640]/30">
                      {step.num}
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Network Requirement Note */}
              <div className="bg-[#241d13] border border-[#4d3618] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#f5a623] mt-1">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <strong>Important:</strong> Deposit amount must be at least 10 USDT using <strong>USDT BEP20 (BSC) Network</strong> only.
                </p>
              </div>
            </div>

            {/* Modal Bottom CTA Button */}
            <button
              onClick={() => {
                if (isApplied) {
                  setIsDetailsOpen(false);
                  router.push('/assets?action=deposit');
                } else {
                  setIsDetailsOpen(false);
                  handleApply();
                }
              }}
              disabled={isApplying}
              className="w-full bg-[#85e640] hover:bg-[#76d335] text-[#0c2e02] font-black text-sm py-3.5 rounded-full transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-80"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0c2e02]" />
                  <span>Applying...</span>
                </>
              ) : isApplied ? (
                <>
                  <span>Deposit 10$</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Apply & Go to Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}



