"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MoreVertical, 
  Download, 
  Star, 
  Info, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  ThumbsUp, 
  Gamepad2, 
  Grid, 
  Search, 
  User,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Zap,
  Lock,
  X,
  Copy,
  Check
} from 'lucide-react';

export default function PokymaxStoreAppsPage() {
  const router = useRouter();
  const carouselRef = useRef(null);
  const [installState, setInstallState] = useState("idle"); // idle | downloading | installed
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedAskQuestion, setSelectedAskQuestion] = useState(null);

  // Share Modal & Copy state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000/pokymaxstorapps';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerFileDownload = () => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = '/PokyMax.apk';
      link.download = 'PokyMax.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleInstallClick = () => {
    if (installState === "installed") {
      triggerFileDownload();
      return;
    }
    setInstallState("downloading");
    setDownloadProgress(8);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallState("installed");
          triggerFileDownload();
          return 100;
        }
        return prev + 16;
      });
    }, 250);
  };

  const REVIEWS = [
    {
      id: 1,
      name: "Michael Chen",
      avatarBg: "bg-blue-600",
      rating: 5,
      date: "August 12, 2026",
      comment: "Pokymax wallet is incredible! The P2P speed is lightning fast and sending USDT takes less than 10 seconds. The 100 USDT new user voucher was credited instantly to my account. 100% recommended!"
    },
    {
      id: 2,
      name: "Sophia Martinez",
      avatarBg: "bg-emerald-600",
      rating: 5,
      date: "August 10, 2026",
      comment: "Very intuitive interface and clean dark mode UI. The 10,000 USDT reward hub campaign is legit. Staking yields are way higher than Binance and OKX!"
    },
    {
      id: 3,
      name: "James K.",
      avatarBg: "bg-purple-600",
      rating: 5,
      date: "August 8, 2026",
      comment: "Best exchange app of 2026. Great APY on staking vaults, zero withdrawal fees on lightning network, and biometric passkey login works flawlessly."
    },
    {
      id: 4,
      name: "Tariq Ahmed",
      avatarBg: "bg-amber-600",
      rating: 5,
      date: "August 5, 2026",
      comment: "Super secure with SAFU protection fund. I traded futures with 100x leverage during peak volatility without any lag or slippage!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#202124] font-sans flex flex-col relative select-none pb-20">
      
      {/* 1. Play Store Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#f1f3f4]">
        <button 
          onClick={() => router.back()} 
          className="p-2 text-[#5f6368] hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button (Opens Share Modal) */}
          <button 
            onClick={() => setIsShareOpen(true)}
            className="p-2 text-[#5f6368] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Share app"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button className="p-2 text-[#5f6368] hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Main App Identity Section */}
      <section className="px-5 pt-4 pb-6">
        
        {/* Icon + Title Row */}
        <div className="flex items-start gap-4 mb-4">
          <img 
            src="/app-logo-transparent.png" 
            alt="Pokymax Wallet Icon" 
            className="w-16 h-16 rounded-2xl object-contain shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold text-[#202124] leading-tight mb-1">
              Pokymax Wallet: Crypto, Bitcoin
            </h1>
            <p className="text-sm font-semibold text-[#01875f] cursor-pointer hover:underline">
              Pokymax Exchange
            </p>
          </div>
        </div>

        {/* App Stats Row */}
        <div className="flex items-center justify-between py-3 border-y border-[#f1f3f4] my-4 text-center">
          
          {/* Rating */}
          <div className="flex flex-col items-center flex-1 border-r border-[#f1f3f4]">
            <div className="flex items-center gap-1 text-sm font-bold text-[#202124]">
              <span>4.8</span>
              <Star className="w-3.5 h-3.5 fill-[#202124] text-[#202124]" />
            </div>
            <span className="text-[11px] text-[#5f6368]">368K reviews ⓘ</span>
          </div>

          {/* Size */}
          <div className="flex flex-col items-center flex-1 border-r border-[#f1f3f4]">
            <Download className="w-4 h-4 text-[#5f6368] mb-0.5" />
            <span className="text-[11px] text-[#5f6368]">28 MB</span>
          </div>

          {/* Rating Age */}
          <div className="flex flex-col items-center flex-1 border-r border-[#f1f3f4]">
            <div className="border border-[#202124] text-[10px] font-bold px-1 rounded">3+</div>
            <span className="text-[11px] text-[#5f6368] mt-0.5">Rated for 3+ ⓘ</span>
          </div>

          {/* Downloads (Updated to 100K+ as requested) */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-bold text-[#202124]">100K+</span>
            <span className="text-[11px] text-[#5f6368]">Downloads</span>
          </div>

        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 my-3">
          
          <button 
            onClick={() => router.push('/')}
            className="flex-1 py-2.5 px-4 rounded-full border border-[#dadce0] text-[#01875f] font-semibold text-sm hover:bg-emerald-50 transition-colors text-center cursor-pointer"
          >
            Uninstall
          </button>

          <button 
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#01875f] hover:bg-[#016f4e] active:scale-95 text-white font-semibold text-sm transition-all shadow-sm text-center cursor-pointer relative overflow-hidden"
          >
            {installState === "downloading" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                <span>{downloadProgress}%</span>
              </span>
            ) : installState === "installed" ? (
              <span>Open App</span>
            ) : (
              <span>Update</span>
            )}
          </button>

        </div>

      </section>

      {/* 3. Events & Offers Section */}
      <section className="px-5 py-4 border-t border-[#f1f3f4]">
        <h2 className="text-base font-bold text-[#202124] mb-3">Events & offers</h2>

        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-[220px]">
            <span className="bg-black/40 text-[10px] font-bold uppercase px-2 py-0.5 rounded text-emerald-300">
              Update available
            </span>
            <h3 className="text-base font-extrabold mt-2 leading-snug">
              Choose your asset. Get up to 3% back.
            </h3>
          </div>

          <button 
            onClick={handleInstallClick}
            className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
          >
            View
          </button>
        </div>
      </section>

      {/* 4. Ask Play about this app Section */}
      <section className="px-5 py-4 border-t border-[#f1f3f4]">
        <div className="bg-[#f0f4f9] rounded-2xl p-4">
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f1f1f] mb-3">
            <Sparkles className="w-4 h-4 text-[#0b57d0]" />
            <span>Ask Play about this app</span>
            <span className="bg-[#c2e7ff] text-[#001d35] text-[10px] font-bold px-2 py-0.5 rounded-full">New!</span>
          </div>

          {/* Question Prompt Input Box */}
          <div className="bg-white rounded-full px-4 py-2.5 border border-[#c4c7c5] shadow-inner mb-3 text-xs text-[#5f6368]">
            Ask a question about this app
          </div>

          {/* Interactive Suggestion Chips */}
          <div className="flex flex-col gap-2">
            {[
              "How many blockchains and tokens does it support?",
              "What age is required to use the wallet's services?"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAskQuestion(selectedAskQuestion === idx ? null : idx)}
                className="bg-[#e1e9f6] hover:bg-[#d3e3fd] text-[#041e49] text-xs font-medium py-2 px-3.5 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{q}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#041e49]" />
              </button>
            ))}
          </div>

          {selectedAskQuestion !== null && (
            <div className="mt-3 bg-white p-3 rounded-xl border border-[#c4c7c5] text-xs text-gray-700 leading-relaxed animate-fadeIn">
              <strong>Answer:</strong> Pokymax Wallet supports over 40+ mainnet blockchains including Bitcoin, Ethereum, Solana, BNB Chain, Polygon, and over 10,000+ custom tokens with zero gas fee bridge swaps.
            </div>
          )}

        </div>
      </section>

      {/* 5. Category Chips & Horizontal Screenshot Previews Carousel */}
      <section className="py-4 border-t border-[#f1f3f4] relative">
        
        {/* Category Badges */}
        <div className="px-5 flex items-center gap-2 mb-4">
          <span className="border border-[#dadce0] text-[#3c4043] text-xs font-medium px-3.5 py-1.5 rounded-full">Finance</span>
          <span className="border border-[#dadce0] text-[#3c4043] text-xs font-medium px-3.5 py-1.5 rounded-full">Digital wallets</span>
        </div>

        {/* Screenshot Previews Carousel Container with Next / Prev Arrow Navigation */}
        <div className="relative group px-1">
          
          <div 
            ref={carouselRef}
            className="flex items-center gap-3 overflow-x-auto px-5 scroll-smooth no-scrollbar pb-2"
          >
            {[
              { id: 1, img: "/app-store-1.png", alt: "Pokymax App Preview 1" },
              { id: 2, img: "/app-store-2.png", alt: "Pokymax App Preview 2" },
              { id: 3, img: "/app-store-3.png", alt: "Pokymax App Preview 3" },
              { id: 4, img: "/app-store-4.png", alt: "Pokymax App Preview 4" },
              { id: 5, img: "/app-store-5.png", alt: "Pokymax App Preview 5" },
            ].map((card) => (
              <div 
                key={card.id}
                className="w-40 h-64 rounded-2xl overflow-hidden shrink-0 shadow-md border border-gray-200 bg-slate-900 relative"
              >
                <img 
                  src={card.img} 
                  alt={card.alt}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Next > Chevron Arrow Button */}
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: 180, behavior: 'smooth' });
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:bg-white transition-all cursor-pointer z-20 active:scale-90"
            title="Next image"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Previous < Chevron Arrow Button */}
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: -180, behavior: 'smooth' });
              }
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:bg-white transition-all cursor-pointer z-20 active:scale-90"
            title="Previous image"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5] rotate-180" />
          </button>

        </div>

      </section>

      {/* 6. Data Safety Dropdown */}
      <section className="px-5 py-4 border-t border-[#f1f3f4]">
        <div className="flex items-center justify-between cursor-pointer">
          <h2 className="text-base font-bold text-[#202124]">Data safety</h2>
          <div className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* 7. Ratings and Reviews Section */}
      <section className="px-5 py-6 border-t border-[#f1f3f4]">
        
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-[#202124]">Ratings and reviews</h2>
          <div className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#5f6368] cursor-pointer">
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </div>

        <p className="text-xs text-[#5f6368] leading-tight mb-4">
          Ratings and reviews are verified and are from people who use the same type of device that you use ⓘ
        </p>

        {/* Rating Breakdown Grid */}
        <div className="flex items-center gap-6 mb-6">
          
          {/* Big Number */}
          <div className="flex flex-col items-center">
            <span className="text-5xl font-normal text-[#202124] leading-none tracking-tight">4.8</span>
            <div className="flex items-center gap-0.5 text-[#01875f] mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#01875f]" />
              ))}
            </div>
            <span className="text-[11px] text-[#5f6368] mt-1">368,196</span>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 flex flex-col gap-1 text-xs font-semibold text-[#5f6368]">
            {[
              { num: 5, pct: "88%" },
              { num: 4, pct: "8%" },
              { num: 3, pct: "2%" },
              { num: 2, pct: "1%" },
              { num: 1, pct: "1%" },
            ].map(row => (
              <div key={row.num} className="flex items-center gap-2">
                <span className="w-2">{row.num}</span>
                <div className="flex-1 h-2 bg-[#e8eaed] rounded-full overflow-hidden">
                  <div className="h-full bg-[#01875f] rounded-full" style={{ width: row.pct }} />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Users are saying - AI Summary */}
        <div className="bg-[#f8f9fa] border border-[#e8eaed] rounded-2xl p-4 mb-6">
          <h3 className="text-xs font-bold text-[#202124] mb-2">Users are saying</h3>
          <p className="text-xs text-[#3c4043] leading-relaxed mb-3">
            Users appreciate the app's intuitive interface and the fast, reliable money transfers. They also value the robust security features. However, some experience delays, high gas fees, occasional performance issues and crashes. Conflicting views exist regarding app stability and security.
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-[#5f6368] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#0b57d0]" />
            <span>Summarized by Google AI</span>
          </div>
        </div>

        {/* Fake User Reviews List */}
        <div className="flex flex-col gap-4">
          {REVIEWS.map(rev => (
            <div key={rev.id} className="border-b border-[#f1f3f4] pb-4">
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${rev.avatarBg} text-white font-bold text-xs flex items-center justify-center`}>
                    {rev.name[0]}
                  </div>
                  <span className="text-xs font-bold text-[#202124]">{rev.name}</span>
                </div>
                <MoreVertical className="w-4 h-4 text-[#5f6368]" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5 text-[#01875f]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#01875f]" />
                  ))}
                </div>
                <span className="text-[11px] text-[#5f6368]">{rev.date}</span>
              </div>

              <p className="text-xs text-[#3c4043] leading-relaxed">
                {rev.comment}
              </p>

            </div>
          ))}
        </div>

      </section>

      {/* 8. Google Play Bottom Dock Bar (Non-interactive / Disabled as requested) */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-white border-t border-[#e8eaed] py-2 px-6 flex items-center justify-around z-50 pointer-events-none select-none">
        
        <div className="flex flex-col items-center gap-1 text-[#5f6368] opacity-60">
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[11px] font-medium">Games</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#0b57d0]">
          <div className="bg-[#c2e7ff] text-[#001d35] px-4 py-1 rounded-full flex items-center justify-center">
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold">Apps</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#5f6368] opacity-60">
          <Search className="w-5 h-5" />
          <span className="text-[11px] font-medium">Search</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#5f6368] opacity-60">
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium">You</span>
        </div>

      </nav>

      {/* 9. Interactive Share & Copy Link Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl text-left border border-gray-100 relative">
            
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#01875f]" />
                <span>Share App Link</span>
              </h3>
              <button 
                onClick={() => setIsShareOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Copy and share the official Pokymax Wallet download link with your friends:
            </p>

            {/* URL Input + Copy Button */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 mb-4">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000/pokymaxstorapps'}
                className="bg-transparent text-xs text-gray-800 flex-1 outline-none font-mono tracking-tight"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#01875f] hover:bg-[#016f4e] active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-around text-xs font-semibold text-gray-600 pt-2 border-t border-gray-100">
              <button 
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-1 hover:text-[#01875f] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#01875f] flex items-center justify-center shadow-xs">
                  <Copy className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-gray-700">Copy Link</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
