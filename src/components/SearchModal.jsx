"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, TrendingUp, TrendingDown, Sparkles, Layers, ArrowRight, ShieldCheck, Gift, Repeat, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SITE_FEATURES = [
  { id: 'p2p', label: 'P2P Trading', category: 'Feature', icon: Repeat, path: '/p2p', keywords: ['p2p', 'p', 'fiat', 'buy', 'sell', 'merchant', 'express'] },
  { id: 'referral', label: 'Referral Event & Earnings', category: 'Feature', icon: Gift, path: '/referral', keywords: ['referral', 'ref', 'invite', 'friend', 'rebate', 'bonus', 'code'] },
  { id: 'rewards', label: 'Coupon & Rewards Hub', category: 'Feature', icon: Sparkles, path: '/cuponcenter', keywords: ['coupon', 'reward', 'voucher', 'hub', 'task', 'bonus'] },
  { id: 'campaign', label: 'Campaign Center', category: 'Feature', icon: Layers, path: '/camaincenter', keywords: ['campaign', 'center', 'yield', 'rewards', 'pool'] },
  { id: 'kyc', label: 'KYC Identity Verification', category: 'Feature', icon: ShieldCheck, path: '/kycverifyed', keywords: ['kyc', 'verification', 'verify', 'identity', 'id', 'document'] },
  { id: 'futures', label: '125x Perpetual Futures', category: 'Trading', icon: TrendingUp, path: '/futures', keywords: ['futures', 'perpetual', 'leverage', 'trade', 'long', 'short', 'margin'] },
  { id: 'trade', label: 'Spot Exchange Trading', category: 'Trading', icon: Repeat, path: '/trade', keywords: ['spot', 'trade', 'buy', 'sell', 'exchange', 'market'] },
  { id: 'markets', label: 'Markets Overview Matrix', category: 'Market', icon: Search, path: '/markets', keywords: ['markets', 'prices', 'crypto', 'coins', 'list', 'trending'] },
  { id: 'assets', label: 'Assets & Deposit Wallet', category: 'Wallet', icon: Wallet, path: '/assets', keywords: ['assets', 'deposit', 'wallet', 'withdraw', 'balance', 'usdt'] },
  { id: 'satting', label: 'Security & Account Settings', category: 'Settings', icon: ShieldCheck, path: '/satting', keywords: ['satting', 'settings', 'security', 'password', 'passkey', '2fa'] },
];

const POPULAR_PAIRS = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: "63,917.66", change: "+0.33%", isUp: true, icon: "https://assets.coincap.io/assets/icons/btc@2x.png", path: "/futures" },
  { symbol: "ETH/USDT", name: "Ethereum", price: "1,903.92", change: "-0.46%", isUp: false, icon: "https://assets.coincap.io/assets/icons/eth@2x.png", path: "/futures" },
  { symbol: "SOL/USDT", name: "Solana", price: "73.13", change: "-0.51%", isUp: false, icon: "https://assets.coincap.io/assets/icons/sol@2x.png", path: "/futures" },
  { symbol: "BNB/USDT", name: "Pokymax (PMX)", price: "605.31", change: "-0.57%", isUp: false, icon: "https://assets.coincap.io/assets/icons/bnb@2x.png", path: "/futures" },
  { symbol: "NVDAB/USDT", name: "NVIDIA (tokenized)", price: "226.13", change: "+0.88%", isUp: true, icon: "https://assets.coincap.io/assets/icons/usdt@2x.png", path: "/futures" },
  { symbol: "SPCXB/USDT", name: "SpaceX (tokenized)", price: "143.93", change: "-2.02%", isUp: false, icon: "https://assets.coincap.io/assets/icons/usdt@2x.png", path: "/futures" },
  { symbol: "XAU/USDT", name: "Gold Tokenized", price: "4,061.68", change: "+0.86%", isUp: true, icon: "https://assets.coincap.io/assets/icons/usdt@2x.png", path: "/futures" },
];

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const query = searchTerm.trim().toLowerCase();

  // Filter features matching search query
  const filteredFeatures = SITE_FEATURES.filter((feat) => {
    if (!query) return true;
    return (
      feat.label.toLowerCase().includes(query) ||
      feat.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
  });

  // Filter pairs matching search query
  const filteredPairs = POPULAR_PAIRS.filter((pair) => {
    if (!query) return true;
    return (
      pair.symbol.toLowerCase().includes(query) ||
      pair.name.toLowerCase().includes(query)
    );
  });

  const handleNavigate = (path) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 pt-12 animate-fadeIn">
      
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Search Window Container */}
      <div className="relative z-10 w-full max-w-[430px] bg-[#121620] border border-[#2b3142] rounded-3xl p-4 shadow-2xl flex flex-col gap-4 text-white max-h-[85vh] overflow-hidden">
        
        {/* Search Header Input Bar */}
        <div className="flex items-center gap-2 bg-[#1a1f2c] border border-[#2e364a] focus-within:border-[#aeff00] px-3.5 py-3 rounded-2xl transition-all">
          <Search className="w-5 h-5 text-[#aeff00] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search features (e.g. p2p, referral, kyc) or pairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none font-medium"
          />
          {searchTerm ? (
            <button onClick={() => setSearchTerm('')} className="p-1 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Results Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 pr-1">
          
          {/* SECTION 1: SITE FEATURES & OPTIONS */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              <span>Site Features & Options</span>
              {query && <span className="text-[#aeff00] font-mono">{filteredFeatures.length} found</span>}
            </div>

            {filteredFeatures.length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5">
                {filteredFeatures.map((feat) => {
                  const IconComp = feat.icon;
                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleNavigate(feat.path)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#181c27] hover:bg-[#23293a] border border-[#242b3d] hover:border-[#aeff00]/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#242b3b] text-[#aeff00] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <IconComp className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#aeff00] transition-colors">
                            {feat.label}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {feat.category} • {feat.path}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-3 text-center bg-[#181c27]/40 rounded-xl">
                No features matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* SECTION 2: POPULAR COINS & PAIRS (usdt/btc, eth, etc.) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              <span>Trading Coins & Pairs</span>
              {query && <span className="text-[#aeff00] font-mono">{filteredPairs.length} found</span>}
            </div>

            {filteredPairs.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {filteredPairs.map((pair) => (
                  <div
                    key={pair.symbol}
                    onClick={() => handleNavigate(pair.path)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#181c27] hover:bg-[#23293a] border border-[#242b3d] hover:border-[#aeff00]/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#242b3b] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={pair.icon} alt={pair.symbol} className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#aeff00] transition-colors flex items-center gap-1">
                          <span>{pair.symbol}</span>
                          <span className="text-[9px] bg-[#242b3b] text-gray-300 px-1.5 py-0.5 rounded font-mono">HOT</span>
                        </div>
                        <div className="text-[10px] text-gray-400">{pair.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">${pair.price}</div>
                      <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${pair.isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                        {pair.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{pair.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-3 text-center bg-[#181c27]/40 rounded-xl">
                No trading pairs matching "{searchTerm}"
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
