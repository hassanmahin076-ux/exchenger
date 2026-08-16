"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Bell, 
  Headphones, 
  User, 
  X, 
  Gift, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Repeat, 
  Wallet, 
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const SITE_FEATURES = [
  { id: 'p2p', label: 'P2P Trading', icon: Repeat, path: '/p2p', keywords: ['p2p', 'p', 'fiat', 'buy', 'sell', 'merchant', 'express'] },
  { id: 'referral', label: 'Referral Event & Earnings', icon: Gift, path: '/referral', keywords: ['referral', 'ref', 'invite', 'friend', 'rebate', 'bonus', 'code'] },
  { id: 'rewards', label: 'Coupon & Rewards Hub', icon: Sparkles, path: '/cuponcenter', keywords: ['coupon', 'reward', 'voucher', 'hub', 'task', 'bonus'] },
  { id: 'campaign', label: 'Campaign Center', icon: Layers, path: '/camaincenter', keywords: ['campaign', 'center', 'yield', 'rewards', 'pool'] },
  { id: 'kyc', label: 'KYC Identity Verification', icon: ShieldCheck, path: '/kycverifyed', keywords: ['kyc', 'verification', 'verify', 'identity', 'id', 'document'] },
  { id: 'futures', label: '125x Perpetual Futures', icon: TrendingUp, path: '/futures', keywords: ['futures', 'perpetual', 'leverage', 'trade', 'long', 'short', 'margin'] },
  { id: 'assets', label: 'Assets & Deposit Wallet', icon: Wallet, path: '/assets', keywords: ['assets', 'deposit', 'wallet', 'withdraw', 'balance', 'usdt'] },
  { id: 'app', label: 'Pokymax App Download', icon: Smartphone, path: '/pokymaxstorapps', keywords: ['app', 'download', 'apk', 'mobile'] },
];

const SEARCH_PAIRS = [
  { symbol: "MNT/USDT", type: "Spot", price: "0.4475", change: "-0.91%", isUp: false, path: "/futures" },
  { symbol: "KII/USDT", type: "Spot", price: "0.07772", change: "+288.60%", isUp: true, path: "/futures" },
  { symbol: "BTC/USDT", type: "Spot", price: "63069.2", change: "-0.24%", isUp: false, path: "/futures" },
  { symbol: "HEIUSDT", type: "Perpetual", price: "0.13858", change: "+12.39%", isUp: true, path: "/futures" },
  { symbol: "ACEUSDT", type: "Perpetual", price: "0.29263", change: "+152.92%", isUp: true, path: "/futures" },
  { symbol: "XAUT/USDT", type: "Spot", price: "4361.2", change: "+0.36%", isUp: true, path: "/futures" },
  { symbol: "AKEUSDT", type: "Perpetual", price: "0.01269", change: "+109.47%", isUp: true, path: "/futures" },
  { symbol: "SOL/USDT", type: "Spot", price: "75.35", change: "-0.59%", isUp: false, path: "/futures" },
];

export default function Navbar({ onOpenAuth }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  // Fullscreen Search Screen State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(auth);
        const avatar = localStorage.getItem('userAvatar') || localStorage.getItem('userAvatarUrl');
        setUserAvatar(avatar);
      }
    };

    checkAuthStatus();

    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  // ONLY show top search Navbar on the /home page
  if (pathname !== '/home') {
    return null;
  }

  const handleAvatarClick = () => {
    const auth = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
    if (auth) {
      router.push('/profile');
    } else {
      if (onOpenAuth) {
        onOpenAuth();
      } else {
        router.push('/auth');
      }
    }
  };

  const handleActivateSearch = () => {
    setIsSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 80);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchTerm('');
  };

  const handleNavigate = (path) => {
    handleCloseSearch();
    router.push(path);
  };

  const query = searchTerm.trim().toLowerCase();

  const filteredFeatures = SITE_FEATURES.filter((feat) => {
    if (!query) return true;
    return (
      feat.label.toLowerCase().includes(query) ||
      feat.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
  });

  const filteredPairs = SEARCH_PAIRS.filter((pair) => {
    if (!query) return true;
    return pair.symbol.toLowerCase().includes(query);
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000]/95 backdrop-blur-md px-4 py-3 border-b border-[#141822] shadow-md relative">
      
      {/* Default Top Header Bar Row */}
      <div className="flex items-center justify-between gap-3 w-full">
        
        {/* Left: User Avatar Button */}
        <button 
          onClick={handleAvatarClick}
          className="w-8 h-8 rounded-full bg-[#2b2f36] hover:bg-[#363b44] flex items-center justify-center text-gray-300 transition-colors overflow-hidden border border-white/10 cursor-pointer shrink-0"
          title={isLoggedIn ? "My Profile" : "User Profile / Sign In"}
        >
          {isLoggedIn && userAvatar ? (
            <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-gray-200" />
          )}
        </button>

        {/* Center: Search Bar Trigger Pill */}
        <div 
          onClick={handleActivateSearch}
          className="flex-1 max-w-[240px] flex items-center gap-2 bg-[#181a20] hover:bg-[#252830] border border-[#2b2f36] rounded-full px-3 py-1.5 cursor-pointer text-xs text-gray-400 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <div className="flex items-center gap-1 text-[11px] truncate">
            <span className="text-orange-500">🔥</span>
            <span className="font-semibold text-gray-300 tracking-wide">UAIUSDT</span>
          </div>
        </div>

        {/* Right: Support Headphone & Notification Bell */}
        <div className="flex items-center gap-3 text-gray-200 shrink-0">
          <button 
            onClick={() => router.push('/support')}
            className="hover:text-[#aeff00] transition-colors cursor-pointer" 
            title="Customer Support"
          >
            <Headphones className="w-5 h-5" />
          </button>

          <button 
            onClick={() => router.push('/notifications')}
            className="relative hover:text-[#aeff00] transition-colors cursor-pointer" 
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* SEARCH OVERLAY SCREEN (Constrained to Site Frame max-w-[430px] with Borders) */}
      {isSearchActive && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex justify-center animate-fadeIn">
          {/* Main App Frame Overlay Container */}
          <div className="w-full max-w-[430px] h-full min-h-screen bg-[#000000] border-x border-[#1a1f2c] text-white flex flex-col p-4 pt-6 overflow-y-auto no-scrollbar font-sans relative shadow-[0_0_80px_rgba(0,0,0,0.95)]">
            
            {/* Top Search Bar Row with Input and Cancel Button */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2.5 bg-[#161a22] border border-[#252c3a] focus-within:border-[#384257] rounded-2xl px-3.5 py-2.5 transition-all">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Please enter preferred trading pair"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none font-medium"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-white p-0.5">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button 
                onClick={handleCloseSearch}
                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 px-1"
              >
                Cancel
              </button>
            </div>

            {/* Quick Site Features (Show if typing query matches features) */}
            {query && filteredFeatures.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  Quick Features
                </div>
                <div className="flex flex-col gap-1">
                  {filteredFeatures.map((feat) => {
                    const IconComp = feat.icon;
                    return (
                      <div
                        key={feat.id}
                        onClick={() => handleNavigate(feat.path)}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#161c28] cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className="w-4 h-4 text-[#aeff00] shrink-0" />
                          <span className="text-sm font-semibold text-gray-200 group-hover:text-[#aeff00]">
                            {feat.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{feat.path}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 1: TOP SEARCHED */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3 tracking-tight">Top Searched</h2>
              
              {/* Table Headers */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-3 px-1">
                <span>Trading Pairs</span>
                <div className="flex items-center gap-10">
                  <span>Price</span>
                  <span>24H Change</span>
                </div>
              </div>

              {/* Trading Pair Rows */}
              <div className="flex flex-col gap-3.5">
                {filteredPairs.map((pair) => (
                  <div
                    key={pair.symbol}
                    onClick={() => handleNavigate(pair.path)}
                    className="flex items-center justify-between py-1 cursor-pointer group hover:bg-[#121620] px-1 rounded-xl transition-colors"
                  >
                    {/* Left: Symbol & Type */}
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#aeff00] transition-colors tracking-wide">
                        {pair.symbol}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {pair.type}
                      </div>
                    </div>

                    {/* Right: Price & 24H Change Pill */}
                    <div className="flex items-center gap-5">
                      <span className="text-sm font-semibold text-white font-mono">
                        {pair.price}
                      </span>
                      
                      <div className={`min-w-[76px] py-1.5 rounded-lg text-xs font-bold font-mono text-center shadow-sm ${
                        pair.isUp 
                          ? 'bg-[#00c076] text-white' 
                          : 'bg-[#ff3b5c] text-white'
                      }`}>
                        {pair.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: TOP MASTER TRADER */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-3 tracking-tight">Top Master Trader</h2>
              
              {/* Master Trader Card */}
              <div className="bg-[#121620] border border-[#1f2636] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1b2230] border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 relative">
                    <span className="text-base">👑</span>
                    <span className="absolute -top-1 -right-1 text-[9px] bg-amber-500 text-black px-1 rounded-full font-bold">T</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      <span>f13</span>
                      <span className="text-xs">👑</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="bg-[#1c2434] text-gray-300 text-[10px] px-2 py-0.5 rounded font-medium">
                        Top Profit
                      </span>
                      <span className="bg-[#1c2434] text-gray-300 text-[10px] px-2 py-0.5 rounded font-medium">
                        High Leverage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
