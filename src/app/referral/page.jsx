"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  UserPlus, 
  Wallet, 
  ChevronRight,
  ArrowRight,
  RotateCw,
  XCircle,
  Sparkles,
  Info,
  Send,
  MessageCircle,
  FileText,
  Users,
  Search,
  Gift
} from 'lucide-react';

export default function ReferralPage() {
  const router = useRouter();

  // Default 8-character referral code starting with PKMX
  const DEFAULT_CODE = 'PKMX839A';
  const [inviteCode, setInviteCode] = useState(DEFAULT_CODE);
  const [inviteLink, setInviteLink] = useState(`https://www.pokymax.link/home?invCode=${DEFAULT_CODE}`);
  
  // Copy feedback state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toast, setToast] = useState(null);

  // Page Loading Progress & Menu state
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [referralList, setReferralList] = useState([]);

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

    if (typeof window !== 'undefined') {
      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');

      let customCode = DEFAULT_CODE;
      if (savedUid) {
        const cleanUid = savedUid.replace(/\D/g, '');
        const suffix = cleanUid.length >= 4 ? cleanUid.slice(-4) : cleanUid;
        customCode = `PKMX${suffix}`;
      } else if (savedEmail) {
        const hash = Math.abs(savedEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)).toString(36).toUpperCase();
        const suffix = (hash + '9876').slice(0, 4);
        customCode = `PKMX${suffix}`;
      }

      setInviteCode(customCode);
      const origin = window.location.origin;
      setInviteLink(`${origin}/home?invCode=${customCode}`);

      // Fetch referrals from database API
      if (savedUid || savedEmail) {
        fetch(`/api/user/referrals?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              if (data.referrals) {
                setReferralList(data.referrals);
              }
              if (data.userRefCode) {
                setInviteCode(data.userRefCode);
                setInviteLink(`${origin}/home?invCode=${data.userRefCode}`);
              }
            }
          })
          .catch(err => console.warn('Referrals fetch error:', err));
      }
    }
  }, []);

  const getAvatarUrl = (user) => {
    if (user?.avatarUrl && !user.avatarUrl.includes('default-user')) {
      return user.avatarUrl;
    }
    const str = String(user?.email || user?.uid || user?.id || 'user');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatarNum = (Math.abs(hash) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${avatarNum}`;
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteCode);
    }
    setCopiedCode(true);
    showToast('🎉 Invitation code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    setCopiedLink(true);
    showToast('🎉 Invitation link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSocialShare = (platform) => {
    const text = encodeURIComponent(`Join me on Pokymax Exchange and enjoy 20% trading fee rebate! Use my code: ${inviteCode}`);
    const encodedUrl = encodeURIComponent(inviteLink);
    
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      showToast(`Sharing invitation via ${platform.toUpperCase()}...`);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-16 select-none relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1a1e29] border border-[#8cff00]/40 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 max-w-[90vw]">
          <Sparkles className="w-4 h-4 text-[#8cff00] flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar matching Pokymax App Mobile Web Top Bar */}
      <header className="fixed top-0 inset-x-0 max-w-[430px] mx-auto z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#141822] w-full relative">
        
        {/* Left: Back Arrow */}
        <button
          onClick={() => router.push('/profile')}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Profile"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Center Title */}
        <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[220px]">
          Pokymax Invite Program...
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

      {/* Main Referral Page Body Container */}
      <div className="relative w-full max-w-[430px] mx-auto px-4 flex flex-col gap-6 pt-16">
        
        {/* Background Spotlight Image from picture folder */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[340px] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <img 
            src="/referral-bg.png" 
            alt="Referral Background Light" 
            className="w-full h-full object-cover object-center opacity-95"
          />
        </div>

        {/* TOP HERO BANNER AREA (Concise 2-liner) */}
        <div className="relative z-10 flex flex-col items-center text-center pt-2 pb-1 px-2">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-2xl sm:text-[28px] font-black text-white tracking-tight leading-tight drop-shadow-md whitespace-nowrap">
              Invite Friends & Do KYC
            </h2>
            <h3 className="text-2xl sm:text-[28px] font-black text-white tracking-tight leading-tight drop-shadow-md whitespace-nowrap">
              Get <span className="text-[#8cff00]">$0.5</span> + <span className="text-[#8cff00]">40%</span> Rebate
            </h3>
          </div>
        </div>

        {/* EXCLUSIVE INVITATION CODE CARD (Transparent Glassmorphism Effect) */}
        <div className="relative z-10 bg-[#0c0f16]/60 backdrop-blur-2xl border border-white/10 rounded-[28px] p-5 shadow-2xl flex flex-col gap-4">
          
          <span className="text-gray-400 text-xs font-semibold tracking-wide">
            Your exclusive invitation code
          </span>

          {/* Code Box 1: Invitation Code */}
          <div className="bg-[#141722]/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between group hover:border-white/20 transition-colors">
            <span className="text-white font-mono font-bold text-base tracking-wider">
              {inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer active:scale-90"
              title="Copy Code"
            >
              {copiedCode ? (
                <Check className="w-5 h-5 text-[#8cff00]" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Code Box 2: Invitation Link */}
          <div className="bg-[#141722]/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between group hover:border-white/20 transition-colors">
            <span className="text-gray-300 font-mono text-xs truncate max-w-[240px] tracking-tight">
              {inviteLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer active:scale-90 flex-shrink-0"
              title="Copy Link"
            >
              {copiedLink ? (
                <Check className="w-5 h-5 text-[#8cff00]" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Social Share Icon Buttons Row */}
          <div className="flex items-center justify-center gap-5 pt-2 pb-1">
            
            {/* Facebook Share Button */}
            <button
              onClick={() => handleSocialShare('facebook')}
              className="w-11 h-11 rounded-full bg-[#141722]/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 hover:border-[#8cff00]/40 transition-all cursor-pointer active:scale-95 shadow-md group"
              title="Share to Facebook"
            >
              <span className="font-serif font-black text-lg group-hover:text-[#8cff00]">f</span>
            </button>

            {/* X / Twitter Share Button */}
            <button
              onClick={() => handleSocialShare('x')}
              className="w-11 h-11 rounded-full bg-[#141722]/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 hover:border-[#8cff00]/40 transition-all cursor-pointer active:scale-95 shadow-md group"
              title="Share to X (Twitter)"
            >
              <span className="font-sans font-bold text-base group-hover:text-[#8cff00]">✕</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="w-11 h-11 rounded-full bg-[#141722]/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-[#8cff00] hover:bg-white/10 hover:border-[#8cff00]/40 transition-all cursor-pointer active:scale-95 shadow-md group"
              title="Share to WhatsApp"
            >
              <MessageCircle className="w-5 h-5 group-hover:text-[#8cff00]" />
            </button>

            {/* Telegram Share Button */}
            <button
              onClick={() => handleSocialShare('telegram')}
              className="w-11 h-11 rounded-full bg-[#141722]/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-[#8cff00] hover:bg-white/10 hover:border-[#8cff00]/40 transition-all cursor-pointer active:scale-95 shadow-md group"
              title="Share to Telegram"
            >
              <Send className="w-4 h-4 group-hover:text-[#8cff00] -ml-0.5 mt-0.5" />
            </button>

          </div>

        </div>

        {/* 3-STEP REFERRAL FLOW DIAGRAM MATCHING IMAGE 2 EXACTLY */}
        <div className="relative pt-4 pb-2 px-1">
          
          {/* Top Icons Row using user's official graphic images + neon green arrows */}
          <div className="flex items-center justify-between w-full relative mb-3">
            
            {/* Step 1 Icon Graphic */}
            <div className="flex justify-center flex-1">
              <img 
                src="/ref-step1.png" 
                alt="1. Share Link" 
                className="w-20 sm:w-24 h-auto object-contain hover:scale-105 transition-transform" 
              />
            </div>

            {/* Neon Green Right Arrow 1 */}
            <div className="flex items-center justify-center flex-shrink-0 -mx-1">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#8cff00] stroke-[3] drop-shadow-[0_0_8px_rgba(140,255,0,0.6)]" />
            </div>

            {/* Step 2 Icon Graphic */}
            <div className="flex justify-center flex-1">
              <img 
                src="/ref-step2.png" 
                alt="2. Friend Accepts Invitation" 
                className="w-20 sm:w-24 h-auto object-contain hover:scale-105 transition-transform" 
              />
            </div>

            {/* Neon Green Right Arrow 2 */}
            <div className="flex items-center justify-center flex-shrink-0 -mx-1">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#8cff00] stroke-[3] drop-shadow-[0_0_8px_rgba(140,255,0,0.6)]" />
            </div>

            {/* Step 3 Icon Graphic */}
            <div className="flex justify-center flex-1">
              <img 
                src="/ref-step3.png" 
                alt="3. Easy long-term gains" 
                className="w-20 sm:w-24 h-auto object-contain hover:scale-105 transition-transform" 
              />
            </div>

          </div>

          {/* Text Labels Row with Connecting Lines matching Image 2 */}
          <div className="flex items-center justify-between w-full relative text-xs">
            
            {/* Step 1 Label */}
            <div className="w-[30%] text-center">
              <span className="text-white font-semibold leading-tight text-[11px] sm:text-xs">
                1. Share Link
              </span>
            </div>

            {/* Connector Line 1 */}
            <div className="h-[1px] bg-gray-600/70 flex-1 my-auto mx-1" />

            {/* Step 2 Label */}
            <div className="w-[36%] text-center flex flex-col items-center">
              <span className="text-white font-semibold leading-tight text-[11px] sm:text-xs">
                2. Friend Accepts Invitation
              </span>
            </div>

            {/* Connector Line 2 */}
            <div className="h-[1px] bg-gray-600/70 flex-1 my-auto mx-1" />

            {/* Step 3 Label */}
            <div className="w-[30%] text-center flex flex-col items-center">
              <span className="text-white font-semibold leading-tight text-[11px] sm:text-xs">
                3. Easy long-term gains
              </span>
            </div>

          </div>

        </div>

        {/* REFERRAL OVERVIEW SECTION */}
        <div className="flex flex-col gap-3 pt-2">
          
          {/* Section Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-white text-base sm:text-lg font-black tracking-tight">
                Referral Overview
              </h3>
              <span className="text-xs bg-[#1f2613] text-[#8cff00] font-mono font-bold px-2 py-0.5 rounded-full border border-[#8cff00]/30">
                {referralList.length} Total
              </span>
            </div>
          </div>

          {/* Referral Cards List */}
          <div className="flex flex-col gap-3">
            {referralList.length === 0 ? (
              <div className="bg-[#0c0f16]/60 backdrop-blur-2xl border border-white/10 rounded-[22px] p-5 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#181c28] border border-white/10 flex items-center justify-center text-gray-500 mb-1">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-gray-300">No Referred Users Yet</p>
                <p className="text-[11px] text-gray-400 max-w-[280px]">
                  Share your invitation code to invite friends and get $0.50 + 40% rebate!
                </p>
              </div>
            ) : (
              referralList.map((refUser, idx) => (
                <div
                  key={refUser.id || idx}
                  className="bg-[#0c0f16]/80 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-[22px] p-4 flex items-center justify-between gap-3 shadow-lg transition-all"
                >
                  {/* Left: User Avatar & Email + User ID */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1f2c] to-[#0d1017] border border-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      <img 
                        src={getAvatarUrl(refUser)} 
                        alt="User Profile Avatar" 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <span className="hidden font-mono font-black text-sm text-[#8cff00]">
                        {refUser.email ? refUser.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-xs text-white truncate max-w-[170px] sm:max-w-[210px]">
                        {refUser.email || refUser.maskedEmail || `User_${refUser.uid}`}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                        <span>UID: {refUser.uid}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: KYC Status Badge & Bonus Text */}
                  <div className="flex flex-col items-end gap-1">
                    {refUser.kycStatus === 'verified' ? (
                      <>
                        <span className="text-[10px] font-extrabold text-[#0ecb81] bg-[#0ecb81]/15 border border-[#0ecb81]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Verified</span>
                        </span>
                        <span className="text-[11px] font-mono font-extrabold text-[#8cff00]">
                          +0.5$ added
                        </span>
                      </>
                    ) : refUser.kycStatus === 'pending' || refUser.kycStatus === 'under_review' ? (
                      <span className="text-[10px] font-extrabold text-[#eab308] bg-[#eab308]/15 border border-[#eab308]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span>Pending</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-gray-400 bg-gray-800/60 border border-gray-600/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* ALL RECORDS MODAL / DRAWER */}
      {isRecordsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          
          {/* Backdrop Click */}
          <div 
            className="absolute inset-0" 
            onClick={() => setIsRecordsOpen(false)} 
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-[430px] bg-[#14161c] border-t sm:border border-[#262a37] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            
            {/* Mobile Handle Bar */}
            <div className="w-10 h-1 bg-[#2b2f3d] rounded-full mx-auto sm:hidden -mt-1"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#212431]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#8cff00]" />
                <h3 className="font-extrabold text-base text-white">Referral Records</h3>
              </div>

              <button 
                onClick={() => setIsRecordsOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg bg-[#1f222d] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#1b1e27] p-1 rounded-xl border border-[#272b38]">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'all' ? 'bg-[#8cff00] text-[#0a2300]' : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({referralList.length})
              </button>
              <button
                onClick={() => setActiveTab('direct')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'direct' ? 'bg-[#8cff00] text-[#0a2300]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Direct ({referralList.length})
              </button>
              <button
                onClick={() => setActiveTab('indirect')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'indirect' ? 'bg-[#8cff00] text-[#0a2300]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Indirect (0)
              </button>
            </div>

            {/* Records Content */}
            {referralList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#1e222e] flex items-center justify-center text-gray-500 border border-[#2b3040]">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-xs font-medium">
                  No referral records yet. Share your code to earn 40% rebate!
                </p>
                <button
                  onClick={() => {
                    setIsRecordsOpen(false);
                    handleCopyLink();
                  }}
                  className="mt-1 bg-[#8cff00] text-[#0a2300] font-black text-xs px-5 py-2.5 rounded-full hover:bg-[#aeff00] transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Copy Invite Link
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {referralList.map((refUser, idx) => (
                  <div
                    key={refUser.id || idx}
                    className="bg-[#1b1e27] border border-[#282d3c] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a1f2c] to-[#0d1017] border border-white/20 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        <img 
                          src={getAvatarUrl(refUser)} 
                          alt="User Profile Avatar" 
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <span className="hidden font-mono font-black text-xs text-[#8cff00]">
                          {refUser.email ? refUser.email.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white font-mono">
                          {refUser.email || refUser.maskedEmail}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          UID: {refUser.uid}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {refUser.kycStatus === 'verified' ? (
                        <>
                          <span className="text-[10px] font-extrabold text-[#0ecb81] bg-[#0ecb81]/15 px-2 py-0.5 rounded-md">
                            Verified
                          </span>
                          <span className="text-[10px] font-mono text-[#8cff00] font-bold">
                            +0.5$ added
                          </span>
                        </>
                      ) : refUser.kycStatus === 'pending' || refUser.kycStatus === 'under_review' ? (
                        <span className="text-[10px] font-extrabold text-[#eab308] bg-[#eab308]/15 px-2 py-0.5 rounded-md">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
