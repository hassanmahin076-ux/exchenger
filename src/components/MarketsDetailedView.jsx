"use client";

import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Edit2 } from 'lucide-react';

const TARGET_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", defaultPrice: 64511.0, defaultChange: 1.29, defaultVol: 313139000 },
  { symbol: "ETHUSDT", name: "Ethereum", defaultPrice: 1924.59, defaultChange: 0.77, defaultVol: 181683000 },
  { symbol: "SOLUSDT", name: "Solana", defaultPrice: 74.33, defaultChange: 0.69, defaultVol: 53399000 },
  { symbol: "DOGEUSDT", name: "Dogecoin", defaultPrice: 0.07094, defaultChange: 0.40, defaultVol: 27008000 },
  { symbol: "XRPUSDT", name: "XRP", defaultPrice: 1.0877, defaultChange: 3.00, defaultVol: 18100000 },
  { symbol: "ZECUSDT", name: "Zcash", defaultPrice: 468.99, defaultChange: 0.62, defaultVol: 12496000 },
  { symbol: "SUIUSDT", name: "Sui", defaultPrice: 0.6952, defaultChange: 1.03, defaultVol: 10282000 },
  { symbol: "SNDKUSDT", name: "SanDisk", defaultPrice: 1108.31, defaultChange: 2.16, defaultVol: 10173000 },
  { symbol: "SKHYNIXUSDT", name: "SK Hynix", defaultPrice: 985.06, defaultChange: -2.57, defaultVol: 9236000 },
  { symbol: "XAUUSDT", name: "Gold", defaultPrice: 4063.82, defaultChange: 0.86, defaultVol: 15650000 },
  { symbol: "ADAUSDT", name: "Cardano", defaultPrice: 0.3842, defaultChange: -1.15, defaultVol: 8450000 },
  { symbol: "AVAXUSDT", name: "Avalanche", defaultPrice: 24.85, defaultChange: 1.84, defaultVol: 14200000 }
];

// Helper Component to render real crypto logos with fallbacks
function CoinLogo({ symbol }) {
  const baseSymbol = symbol.replace("USDT", "").toLowerCase();
  const [imgSrc, setImgSrc] = useState(
    `https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(`https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`);
    setHasError(false);
  }, [baseSymbol]);

  // Custom fallback SVG badges for stock/commodity pairs like SNDK, SKHYNIX, XAU
  if (hasError) {
    let color = "bg-blue-600";
    if (baseSymbol.includes("sndk") || baseSymbol.includes("red")) color = "bg-red-600";
    else if (baseSymbol.includes("xau") || baseSymbol.includes("gold")) color = "bg-amber-500";
    else if (baseSymbol.includes("skhynix")) color = "bg-rose-600";

    return (
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center font-black text-xs text-white uppercase shadow-sm flex-shrink-0`}>
        {baseSymbol.slice(0, 3)}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={symbol}
      className="w-8 h-8 rounded-full object-contain flex-shrink-0"
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

export default function MarketsDetailedView({ onSelectPair }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("Favorites");
  const [subType, setSubType] = useState("Futures");
  const [marketData, setMarketData] = useState({});

  // Real-time API fetch from Binance
  useEffect(() => {
    let isMounted = true;

    const fetchLivePrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        if (!res.ok) return;
        const text = await res.text();
        if (!text || !text.trim()) return;
        const data = JSON.parse(text);

        if (isMounted && Array.isArray(data)) {
          const priceMap = {};
          data.forEach(item => {
            priceMap[item.symbol] = {
              price: parseFloat(item.lastPrice),
              change: parseFloat(item.priceChangePercent),
              vol: parseFloat(item.quoteVolume)
            };
          });
          setMarketData(priceMap);
        }
      } catch (err) {
        console.log("Binance API fetch notice - using live fallback", err);
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 3000); // 3-second live refresh

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredCoins = TARGET_COINS.filter(c => 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white px-3 pt-3 pb-20 font-sans">
      
      {/* Search Input matching 2nd screenshot */}
      <div className="flex items-center gap-2.5 bg-[#121620] border border-[#1e2533] rounded-xl px-3 py-2.5 text-sm text-gray-400 mb-4">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search what you need"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-white text-xs outline-none w-full placeholder-gray-500 font-medium"
        />
      </div>

      {/* Main Tabs: Favorites, Futures, Spot, TradFi matching 2nd screenshot */}
      <div className="flex items-center justify-between border-b border-[#141822] mb-4">
        <div className="flex items-center gap-6">
          {["Favorites", "Futures", "Spot", "TradFi"].map((tab) => {
            const isActive = activeMainTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveMainTab(tab)}
                className={`pb-2.5 text-base font-extrabold transition-all relative ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  {tab}
                  {tab === "Futures" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mb-2" />
                  )}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Pills & Edit Icon matching 2nd screenshot */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-5">
          {["Futures", "Spot"].map((type) => {
            const isActive = subType === type;
            return (
              <button
                key={type}
                onClick={() => setSubType(type)}
                className={`text-sm font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <button className="text-gray-400 hover:text-white p-1">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Table Column Headers matching 2nd screenshot */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold pb-2 border-b border-[#141822] mb-1 px-1">
        <div className="flex items-center gap-1 cursor-pointer hover:text-white">
          <span>Contracts</span>
          <ArrowUpDown className="w-3 h-3 text-gray-500" />
          <span className="text-gray-500 mx-0.5">/</span>
          <span>24h Vol</span>
          <ArrowUpDown className="w-3 h-3 text-gray-500" />
        </div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <span>Price</span>
            <ArrowUpDown className="w-3 h-3 text-gray-500" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <span>24h Change</span>
            <ArrowUpDown className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Real-time Crypto List Rows matching 2nd screenshot */}
      <div className="divide-y divide-[#141822]">
        {filteredCoins.map((coin) => {
          const live = marketData[coin.symbol];
          const price = live ? live.price : coin.defaultPrice;
          const change = live ? live.change : coin.defaultChange;
          const vol = live ? live.vol : coin.defaultVol;
          const isPos = change >= 0;

          const formattedVol = vol >= 1e9 
            ? `${(vol / 1e6).toFixed(3)}M` 
            : `${(vol / 1e6).toFixed(3)}M`;

          return (
            <div
              key={coin.symbol}
              onClick={() => onSelectPair && onSelectPair({ ...coin, price, change })}
              className="flex items-center justify-between py-3 px-1 cursor-pointer hover:bg-[#121620] transition-colors"
            >
              {/* Left: Real Logo + Symbol + Vol */}
              <div className="flex items-center gap-3">
                <CoinLogo symbol={coin.symbol} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-white tracking-tight">{coin.symbol}</span>
                    <span className="bg-[#22262e] text-gray-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Perp
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {formattedVol} USDT
                  </div>
                </div>
              </div>

              {/* Right: Price & 24h Change Badge */}
              <div className="flex items-center gap-3.5 text-right">
                <div>
                  <div className="font-mono text-sm font-extrabold text-white">
                    {price > 10 
                      ? price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                      : price.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    ${price > 10 
                      ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : price.toFixed(4)}
                  </div>
                </div>

                {/* Bright Pill Badge matching 2nd screenshot */}
                <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold min-w-[72px] text-center shadow-sm ${
                  isPos ? 'bg-[#0ecb81] text-black' : 'bg-[#f6465d] text-white'
                }`}>
                  {isPos ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
