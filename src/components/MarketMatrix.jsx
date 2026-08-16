"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';

const GRID_COINS = [
  { id: "BTCUSDT", symbol: "BTCUSDT", name: "Bitcoin", price: 63933.60, change: 0.33, iconColor: "text-amber-500", vol: "1.87B" },
  { id: "ETHUSDT", symbol: "ETHUSDT", name: "Ethereum", price: 1901.89, change: -0.47, iconColor: "text-indigo-400", vol: "1.47B" },
  { id: "SNDKUSDT", symbol: "SNDKUSDT", name: "SanDisk", price: 1055.79, change: -2.74, tag: "Stocks", iconColor: "text-red-500", vol: "328.20M" },
  { id: "SOLUSDT", symbol: "SOLUSDT", name: "Solana", price: 73.53, change: -0.46, iconColor: "text-cyan-400", vol: "302.88M" },
  { id: "SKHYNIXUSDT", symbol: "SKHYNIXUSDT", name: "SK Hynix", price: 985.06, change: -6.57, tag: "Stocks", iconColor: "text-rose-400", vol: "236.51M" },
  { id: "XAUUSDT", symbol: "XAUUSDT", name: "Gold", price: 4063.82, change: 0.86, iconColor: "text-amber-400", vol: "650.10M" }
];

function CoinLogo({ symbol, size = "w-6 h-6" }) {
  const baseSymbol = symbol.replace("USDT", "").toLowerCase();
  const [imgSrc, setImgSrc] = useState(
    `https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(`https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`);
    setHasError(false);
  }, [baseSymbol]);

  if (hasError) {
    let color = "bg-blue-600";
    if (baseSymbol.includes("sndk")) color = "bg-red-600";
    else if (baseSymbol.includes("xau")) color = "bg-amber-500";
    else if (baseSymbol.includes("skhynix")) color = "bg-rose-600";

    return (
      <div className={`${size} rounded-full ${color} flex items-center justify-center font-black text-[10px] text-white uppercase shadow-sm flex-shrink-0`}>
        {baseSymbol.slice(0, 3)}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={symbol}
      loading="lazy"
      decoding="async"
      className={`${size} rounded-full object-contain flex-shrink-0`}
      onError={() => {
        if (imgSrc.includes("coincap")) {
          setImgSrc(`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e3df471347774f36856516ddca82bc/128/color/${baseSymbol}.png`);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

export default function MarketMatrix({ onSelectPair, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState("Favorites");
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [coins, setCoins] = useState(GRID_COINS);
  const [flashMap, setFlashMap] = useState({});
  const [checkedCoins, setCheckedCoins] = useState(() =>
    GRID_COINS.reduce((acc, coin) => ({ ...acc, [coin.id]: true }), {})
  );

  // Read saved Add state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('marketViewExpanded');
    if (saved === 'true') {
      setIsExpandedView(true);
    }
  }, []);

  const toggleCheck = (e, id) => {
    e.stopPropagation();
    setCheckedCoins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddClick = () => {
    setIsExpandedView(true);
    localStorage.setItem('marketViewExpanded', 'true');
  };

  // Real-time price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const item = prev[idx];
        const isUp = Math.random() > 0.45;
        const delta = (Math.random() * 0.2 + 0.05) * (isUp ? 1 : -1);
        const newPrice = Number((item.price * (1 + delta / 100)).toFixed(2));
        const newChange = Number((item.change + delta * 0.1).toFixed(2));

        setFlashMap(p => ({ ...p, [item.id]: isUp ? 'up' : 'down' }));
        setTimeout(() => setFlashMap(p => ({ ...p, [item.id]: null })), 500);

        return prev.map((m, i) => i === idx ? { ...m, price: newPrice, change: newChange } : m);
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-4 px-3 pb-6 text-white font-sans">
      
      {/* Main Category Tabs matching Images 2 & 3 */}
      <div className="flex items-center justify-between border-b border-[#181a20] pb-2 mb-3">
        <div className="flex items-center gap-6">
          {["Favorites", "Popular", "Gainers", "Losers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-base font-bold transition-colors ${
                activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: Grid Card Layout (2nd Image View) */}
      {!isExpandedView ? (
        <div className="flex flex-col items-center">
          
          {/* 2-Column Grid of Cards matching Image 2 */}
          <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
            {coins.map((coin) => {
              const isPos = coin.change >= 0;
              const isChecked = checkedCoins[coin.id] !== false;

              return (
                <div
                  key={coin.id}
                  onClick={() => onSelectPair(coin)}
                  className="bg-[#14161b] border border-[#22262e] rounded-lg p-3 flex flex-col justify-between cursor-pointer hover:border-gray-500 transition-all"
                >
                  {/* Top Row: Symbol & Toggle Check Box */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <CoinLogo symbol={coin.symbol} size="w-5 h-5" />
                      <span className="font-bold text-xs text-white tracking-tight">{coin.symbol}</span>
                    </div>

                    {/* Interactive Check/Uncheck Box */}
                    <button
                      type="button"
                      onClick={(e) => toggleCheck(e, coin.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#aeff00] text-black'
                          : 'border border-gray-600 bg-transparent text-transparent hover:border-gray-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </div>

                  {/* Price */}
                  <div className="font-mono text-sm font-bold text-white mb-0.5">
                    {coin.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </div>

                  {/* 24h Change Percentage */}
                  <div className={`text-xs font-mono font-semibold ${isPos ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {isPos ? '+' : ''}{coin.change}%
                  </div>

                </div>
              );
            })}
          </div>

          {/* Centered [ Add ] Button matching Image 2 */}
          <button
            onClick={handleAddClick}
            className="bg-[#22262e] hover:bg-[#2c313c] text-white text-xs font-semibold px-8 py-2 rounded-full transition-all mb-6 shadow-sm active:scale-95"
          >
            Add
          </button>

        </div>
      ) : (
        /* VIEW 2: Detailed List View (3rd Image View after clicking Add) */
        <div className="flex flex-col">
          
          {/* Table Header matching Image 3 */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pb-2 border-b border-[#181a20] mb-1">
            <span>Pair / Volume</span>
            <div className="flex items-center gap-10">
              <span>Last Price</span>
              <span>24H Change</span>
            </div>
          </div>

          {/* Detailed Ticker List matching Image 3 */}
          <div className="divide-y divide-[#181a20] mb-3">
            {coins.map((coin) => {
              const isPos = coin.change >= 0;

              return (
                <div
                  key={coin.id}
                  onClick={() => onSelectPair(coin)}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#181a20]/60 rounded-lg px-1 transition-colors"
                >
                  {/* Pair Info */}
                  <div className="flex items-center gap-2.5">
                    <CoinLogo symbol={coin.symbol} size="w-8 h-8" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{coin.symbol}</span>
                        {coin.tag && (
                          <span className="bg-emerald-950 text-emerald-400 text-[9px] font-semibold px-1 rounded">
                            {coin.tag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                        <span className="text-amber-500 text-[10px]">★</span>
                        <span>{coin.vol} USDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Change Pill Badge */}
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-white">
                      {coin.price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </span>

                    {/* Pill Badge matching Image 3 */}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold min-w-[65px] text-center ${
                      isPos ? 'bg-[#0ecb81] text-black' : 'bg-[#f6465d] text-white'
                    }`}>
                      {isPos ? '+' : ''}{coin.change}%
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* View More Link matching Image 3 */}
          <div className="text-center mb-6">
            <Link
              href="/markets"
              className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto font-medium"
            >
              <span>View more</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}

      {/* ANNOUNCEMENTS SECTION matching Images 2 & 3 */}
      <div className="mt-2 pt-4 border-t border-[#181a20]">
        
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">Announcements</h3>
          <Link href="/markets" className="text-xs text-gray-400 hover:text-white flex items-center gap-0.5">
            <span>View more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs text-gray-300 mb-4 leading-normal">
          Pokymax to Launch GSUSDT, PYPLUSDT, SMHUSDT in Perpetual Futures
        </p>

        {/* Bottom Bonus Sign Up Banner matching Images 2 & 3 */}
        <Link 
          href="/pokymaxstorapps"
          className="bg-[#14161b] hover:bg-[#1a1d24] border border-[#22262e] rounded-lg p-3.5 flex items-center justify-between gap-2 transition-colors cursor-pointer block"
        >
          <div>
            <h4 className="text-xs font-bold text-white">
              Download app to claim <span className="text-[#aeff00]">10,000 USDT</span> bonus!
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5 max-w-[200px]">
              Download now and claim the highest reward!
            </p>
          </div>

          <div
            className="bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95 whitespace-nowrap"
          >
            Open
          </div>
        </Link>

      </div>

    </section>
  );
}
