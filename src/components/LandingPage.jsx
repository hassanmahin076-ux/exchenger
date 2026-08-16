"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  ChevronRight, 
  Plus, 
  Minus, 
  Globe, 
  DollarSign, 
  Moon, 
  X,
  ShieldCheck,
  Gift,
  Award,
  TrendingUp,
  Lock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

function LiveUserCounter() {
  const [userCount, setUserCount] = useState(327945584);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
      setUserCount(prev => prev + increment);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FCD535] tracking-tight mb-1 animate-fadeIn font-mono">
      {userCount.toLocaleString()}
    </h1>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('popular');
  const [openFaq, setOpenFaq] = useState(null);
  const [openFooterSection, setOpenFooterSection] = useState(null);
  const [showAppBanner, setShowAppBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') {
      router.replace('/home');
    }
  }, [router]);

  const handleSignUp = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUp', 'true');
    }
    router.push('/auth');
  };

  const handleDownloadApp = () => {
    router.push('/pokymaxstorapps');
  };

  const handleMarketClick = () => {
    router.push('/markets');
  };

  // Real Crypto & Stock Market Logos
  const MARKETS = {
    popular: [
      { symbol: "BTC", name: "Bitcoin", price: "$62,904.13", change: "-0.90%", isUp: false, logo: "https://assets.coincap.io/assets/icons/btc@2x.png" },
      { symbol: "ETH", name: "Ethereum", price: "$1,880.17", change: "+0.07%", isUp: true, logo: "https://assets.coincap.io/assets/icons/eth@2x.png" },
      { symbol: "BNB", name: "Pokymax (PMX)", price: "$605.31", change: "-0.57%", isUp: false, logo: "https://assets.coincap.io/assets/icons/bnb@2x.png" },
      { symbol: "SPCXB", name: "SpaceX (tokenized)", price: "$143.93", change: "-2.02%", isUp: false, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
      { symbol: "NVDAB", name: "NVIDIA (tokenized)", price: "$226.13", change: "+0.88%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    ],
    newListings: [
      { symbol: "EX3", name: "Exchanger Token", price: "$42.85", change: "+18.42%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
      { symbol: "SOL", name: "Solana Nexus", price: "$178.40", change: "+7.80%", isUp: true, logo: "https://assets.coincap.io/assets/icons/sol@2x.png" },
      { symbol: "AIX", name: "Cyber AI Matrix", price: "$1.45", change: "+12.30%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    ],
    stocks: [
      { symbol: "NVDAB", name: "NVIDIA Corp", price: "$226.13", change: "+0.88%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
      { symbol: "TSLAB", name: "Tesla Inc", price: "$210.45", change: "-1.15%", isUp: false, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
      { symbol: "AAPLB", name: "Apple Inc", price: "$224.20", change: "+0.45%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    ],
    commodities: [
      { symbol: "GLD3", name: "Gold Yield 3th", price: "$2,450.80", change: "+1.85%", isUp: true, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
      { symbol: "SLV3", name: "Silver Index", price: "$29.40", change: "-0.30%", isUp: false, logo: "https://assets.coincap.io/assets/icons/usdt@2x.png" },
    ]
  };

  const NEWS_ITEMS = [
    { title: "Pokymax Financial Report Q3: Institutional Trading Inflows Surge 145% Year-Over-Year", date: "Today" },
    { title: "Pokymax Expands Zero-Fee P2P Trading Platform Across 45 Global Fiat Currencies", date: "Today" },
    { title: "Pokymax Upgrades Cold-Storage Vault Infrastructure with Multi-Sig Threshold Signatures", date: "Today" },
    { title: "Pokymax Launchpad Announces Next-Generation Web3 Token Offerings for Verified Users", date: "Today" },
  ];

  const FAQS = [
    {
      id: 1,
      q: "What sets Pokymax apart as a premier global cryptocurrency exchange?",
      a: "Pokymax delivers sub-millisecond trade execution, 100% verifiable Merkle-Tree proof of reserves, zero-slippage perpetual futures, ultra-low 0.01% trading fees, and 24/7 multi-lingual customer support."
    },
    {
      id: 2,
      q: "How do I buy Bitcoin, Ethereum, and crypto on Pokymax?",
      a: "You can purchase crypto directly using Credit/Debit cards, wire bank transfers, or Instant P2P fiat conversion with zero processing fees."
    },
    {
      id: 3,
      q: "How do I start trading spot and high-leverage futures on Pokymax?",
      a: "Simply click 'Sign Up', complete fast automated identity verification (KYC), fund your Pokymax wallet, and begin spot or up to 125x perpetual futures trading instantly."
    },
    {
      id: 4,
      q: "Is the Pokymax Mobile App available for iOS and Android?",
      a: "Yes! Download the official Pokymax Mobile App to enjoy real-time price notification alerts, instant trading execution, biometric passkey login, and complete portfolio management on the go."
    },
    {
      id: 5,
      q: "What digital financial products does Pokymax provide?",
      a: "Pokymax offers Spot Trading, 125x Perpetual Futures, High-Yield Staking Vaults, P2P Fiat Exchange, Copy Trading, and up to 10,000 USDT New Trader Welcome Bonus Rewards."
    },
    {
      id: 6,
      q: "How can I earn passive income on my crypto assets?",
      a: "Deposit your assets in Pokymax Flexible Staking or APY Vaults to earn up to 24.5% daily compounding yields, or join the Affiliate Program to earn lifetime commission rebates."
    },
    {
      id: 7,
      q: "How does Pokymax protect user funds and security?",
      a: "100% of user digital assets are backed 1:1 in multi-signature offline cold storage, backed by the Pokymax Emergency SafeShield Reserve Protection Fund."
    },
    {
      id: 8,
      q: "Where can I view real-time cryptocurrency prices and charts?",
      a: "Track 24/7 live price trends, 24h trading volume, interactive charts, and real-time market depth directly on the Pokymax Markets matrix."
    }
  ];

  const FOOTER_LINKS = [
    { title: "About Us", links: ["About Pokymax", "Careers", "Press & News", "Community", "Risk Disclosure"] },
    { title: "Products", links: ["Spot Exchange", "Perpetual Futures", "Pokymax Wallet", "P2P Trading", "Reward Hub"] },
    { title: "Service", links: ["Trading Fee Schedule", "VIP Services", "API Documentation", "Historical Market Data"] },
    { title: "Business", links: ["Token Listing Application", "Affiliate Program", "Institutional Services", "P2P Merchant Portal"] },
    { title: "Support", links: ["24/7 Help Center", "Submit Support Ticket", "Security & SafeShield", "Law Enforcement Inquiries"] },
    { title: "Learn", links: ["What is Bitcoin?", "Crypto Trading Basics", "Futures Strategy Guides", "Security Best Practices"] },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] font-sans flex flex-col relative select-none">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0b0e11]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#1e2329]">
        {/* Left: Brand Logo */}
        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="Pokymax Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
            POKYMAX
          </span>
        </div>

        {/* Right: Hamburger Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-gray-300 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1e2329] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Pokymax Logo"
                className="w-7 h-7 rounded-lg object-contain"
              />
              <span className="font-extrabold text-lg text-white">POKYMAX</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm font-semibold text-gray-200">
            <button onClick={() => { router.push('/auth'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#1e2329] text-[#aeff00]">Log In / Sign Up</button>
            <button onClick={() => { router.push('/markets'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#1e2329]">Markets</button>
            <button onClick={() => { router.push('/trade'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#1e2329]">Trade</button>
            <button onClick={() => { router.push('/futures'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#1e2329]">Futures</button>
            <button onClick={() => { router.push('/p2p'); setMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#1e2329]">P2P Trading</button>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="px-5 pt-8 pb-10 text-center flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0e11] via-[#12161c] to-[#0b0e11]">
        
        {/* Big Dynamic Stats Number */}
        <LiveUserCounter />

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider mb-2 uppercase">
          GLOBAL TRADERS TRUST POKYMAX
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-400 font-medium mb-6">
          Next-Gen Digital Asset Exchange & Web3 Infrastructure
        </p>

        {/* Badges Row */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold mb-6">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-[#aeff00] text-base">🌿</span>
            <div className="text-center leading-tight">
              <span className="block text-[11px] text-gray-400">No.1</span>
              <span className="text-white font-bold text-xs">Liquidity Depth</span>
            </div>
            <span className="text-[#aeff00] text-base">🌿</span>
          </div>

          <div className="w-[1px] h-8 bg-[#1e2329]" />

          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-[#aeff00] text-base">🌿</span>
            <div className="text-center leading-tight">
              <span className="block text-[11px] text-gray-400">No.1</span>
              <span className="text-white font-bold text-xs">Execution Speed</span>
            </div>
            <span className="text-[#aeff00] text-base">🌿</span>
          </div>
        </div>

        {/* Industry Security Highlight */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#aeff00] font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Institutional Grade Cold Storage Security</span>
        </div>

        {/* Neon Green Sign Up Button */}
        <button
          onClick={handleSignUp}
          className="w-full max-w-xs bg-[#aeff00] hover:bg-[#9ef000] active:scale-[0.98] text-black font-extrabold py-3.5 px-8 rounded-xl text-base transition-all cursor-pointer border-none outline-none shadow-none"
        >
          Sign Up
        </button>

      </section>

      {/* 3. Market Matrix Section with Real API / CDN Coin Icons */}
      <section className="px-4 py-6 border-t border-[#1e2329] bg-[#0b0e11]">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-5 border-b border-[#1e2329] pb-2 mb-4 overflow-x-auto no-scrollbar text-xs font-bold">
          {[
            { id: 'popular', label: 'Popular' },
            { id: 'newListings', label: 'New Listing' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'commodities', label: 'tCommodities' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#aeff00] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Crypto Rows with Real Logos */}
        <div className="flex flex-col gap-2">
          {(MARKETS[activeTab] || MARKETS.popular).map((coin) => (
            <div
              key={coin.symbol}
              onClick={handleMarketClick}
              className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#181a20] cursor-pointer transition-colors border border-transparent hover:border-[#1e2329]"
            >
              {/* Left: Real Coin Image Logo & Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#181a20] border border-[#2b2f36] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={coin.logo}
                    alt={coin.symbol}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coin.symbol.toLowerCase().slice(0, 3)}.png`;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{coin.symbol}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{coin.name}</span>
                </div>
              </div>

              {/* Right: Price & 24h Change */}
              <div className="text-right">
                <div className="font-bold text-sm text-white font-mono">{coin.price}</div>
                <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                  coin.isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                }`}>
                  {coin.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{coin.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-4">
          <button
            onClick={handleMarketClick}
            className="text-xs font-semibold text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <span>View All Markets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* 4. News Section */}
      <section className="px-5 py-8 border-t border-[#1e2329] bg-[#0e1217]">
        <h3 className="text-lg font-bold text-white mb-4 text-center">Market News & Updates</h3>

        <div className="flex flex-col gap-3">
          {NEWS_ITEMS.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#181a20] hover:bg-[#20242c] p-3.5 rounded-xl border border-[#1e2329] cursor-pointer transition-colors"
            >
              <p className="text-xs text-gray-200 font-semibold leading-relaxed hover:text-[#aeff00] transition-colors">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="text-xs font-semibold text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto">
            <span>View All News</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. 100% PROOF OF RESERVES & SAFESHIELD Section */}
      <section className="px-5 py-10 border-t border-[#1e2329] bg-gradient-to-b from-[#0b0e11] via-[#121720] to-[#0b0e11] text-center">
        
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
          100% PROOF OF RESERVES & <span className="text-[#aeff00]">SAFESHIELD</span>
        </h2>

        <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto mb-4">
          The Pokymax Emergency Asset Protection Reserve (SafeShield) secures 100% of user deposits in multi-signature cold storage vaults. Fully backed and cryptographically audited daily.
        </p>

        <p className="text-[11px] text-gray-400 mb-2">
          Verified Active Institutional Reserve Fund:
        </p>

        {/* Big Highlight */}
        <div className="text-2xl sm:text-3xl font-extrabold text-[#aeff00] mb-2 tracking-tight">
          15,000 BTC + $250M USDT
        </div>

        {/* Monospace Wallet Address */}
        <div className="bg-[#181a20] border border-[#2b2f36] inline-block px-3 py-1.5 rounded-lg text-[10px] text-gray-400 font-mono tracking-tighter">
          Pokymax Reserve Vault: <span className="text-gray-300">1BAuq7Vho2CEkVkUxbfU26LhwQjbCmWQkD</span>
        </div>

      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="px-5 py-10 border-t border-[#1e2329] bg-[#0b0e11]">
        
        <h2 className="text-xl font-extrabold text-white text-center mb-6">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-[#181a20] border border-[#1e2329] rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#20242c] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#22262e] text-[#aeff00] text-xs font-bold flex items-center justify-center shrink-0">
                      {faq.id}
                    </span>
                    <span className="text-xs font-bold text-gray-100 leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-[#aeff00] shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-400 leading-relaxed border-t border-[#22262e] bg-[#12161c]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 7. Sign Up Banner & Footer */}
      <section className="px-5 pt-10 pb-20 border-t border-[#1e2329] bg-[#080a0d] text-center">
        
        <h2 className="text-lg font-extrabold text-white mb-4">
          Trade Digital Assets with Ultra-Low Fees on Pokymax
        </h2>

        {/* Neon Green Sign Up Button */}
        <button
          onClick={handleSignUp}
          className="bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold py-3 px-8 rounded-xl text-sm transition-all cursor-pointer mb-10 border-none outline-none shadow-none"
        >
          Sign Up Now
        </button>

        {/* Footer Navigation Accordions */}
        <div className="flex flex-col gap-2 max-w-md mx-auto text-left mb-8">
          {FOOTER_LINKS.map((sec, idx) => {
            const isOpen = openFooterSection === idx;
            return (
              <div key={sec.title} className="border-b border-[#1e2329] pb-2">
                <button
                  onClick={() => setOpenFooterSection(isOpen ? null : idx)}
                  className="w-full py-2.5 flex items-center justify-between text-xs font-bold text-gray-200 hover:text-white"
                >
                  <span>{sec.title}</span>
                  {isOpen ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="py-2 flex flex-col gap-2 pl-2">
                    {sec.links.map((link) => (
                      <span key={link} className="text-xs text-gray-400 hover:text-[#aeff00] cursor-pointer">
                        {link}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Community Social Icons */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <span className="text-xs font-semibold text-gray-400">Community</span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <span className="hover:text-white cursor-pointer text-sm font-bold">💬 Discord</span>
            <span className="hover:text-white cursor-pointer text-sm font-bold">✈️ Telegram</span>
            <span className="hover:text-white cursor-pointer text-sm font-bold">🎵 TikTok</span>
            <span className="hover:text-white cursor-pointer text-sm font-bold">📘 Facebook</span>
            <span className="hover:text-white cursor-pointer text-sm font-bold">𝕏 Twitter</span>
          </div>
        </div>

        {/* Preferences Toggles */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 border-t border-[#1e2329] pt-6 mb-6">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>

          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <DollarSign className="w-4 h-4" />
            <span>USD</span>
          </div>

          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <span>Theme</span>
            <Moon className="w-4 h-4" />
          </div>
        </div>

        {/* Regulatory Footer Text */}
        <p className="text-[10px] text-gray-500 leading-snug max-w-sm mx-auto">
          Pokymax Financial Technology Corp. Registered & Regulated Digital Asset Service Provider. All rights reserved.
        </p>

      </section>

      {/* 8. Download Pokymax App Floating Bottom Banner */}
      {showAppBanner && (
        <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto z-50 bg-[#12161c] border-t border-[#1e2329] px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-5px_30px_rgba(0,0,0,0.95)] animate-fadeIn">
          <div className="flex items-center gap-3">
            {/* App Icon */}
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="Pokymax App Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-xs text-white leading-tight">
                Download Pokymax App
              </div>
              <div className="text-[10px] text-gray-400">
                Claim up to 100 USDT vouchers
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadApp}
              className="bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-xs py-1.5 px-4 rounded-lg cursor-pointer transition-all active:scale-95 shadow-none"
            >
              Download
            </button>
            <button
              onClick={() => setShowAppBanner(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              title="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
