"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Sliders, DollarSign, Activity, CheckCircle2 } from 'lucide-react';

export default function TradeTerminal({ pair, mode = "Futures", onOrderPlaced }) {
  const [leverage, setLeverage] = useState(20);
  const [orderType, setOrderType] = useState("Market");
  const [tradeDirection, setTradeDirection] = useState("Long");
  const [amountPercent, setAmountPercent] = useState(50);
  const [price, setPrice] = useState(pair ? pair.price : 42.85);
  const [quantity, setQuantity] = useState("100");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (pair) setPrice(pair.price);
  }, [pair]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      if (onOrderPlaced) onOrderPlaced();
    }, 2000);
  };

  // Mock Order Book data
  const asks = [
    { price: (price * 1.004).toFixed(2), amount: "1.42", total: "60.8K" },
    { price: (price * 1.003).toFixed(2), amount: "0.85", total: "36.4K" },
    { price: (price * 1.002).toFixed(2), amount: "2.10", total: "90.0K" },
    { price: (price * 1.001).toFixed(2), amount: "0.45", total: "19.2K" },
  ];

  const bids = [
    { price: (price * 0.999).toFixed(2), amount: "0.95", total: "40.6K" },
    { price: (price * 0.998).toFixed(2), amount: "1.80", total: "77.0K" },
    { price: (price * 0.997).toFixed(2), amount: "3.20", total: "136.9K" },
    { price: (price * 0.996).toFixed(2), amount: "0.50", total: "21.4K" },
  ];

  return (
    <section className="bg-[#000000] border border-[#141822] rounded-2xl p-4 sm:p-5">
      
      {/* Terminal Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#141822] mb-4">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold text-white font-mono">{pair ? pair.symbol : "EX3 / USDT"}</span>
          <span className="bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400] text-xs font-mono font-bold px-2 py-0.5 rounded">
            {mode} Mode
          </span>
        </div>

        {/* Leverage Slider Control for Futures */}
        {mode === "Futures" && (
          <div className="flex items-center gap-2 bg-[#121620] px-3 py-1.5 rounded-lg border border-[#232b38]">
            <Sliders className="w-3.5 h-3.5 text-[#FFD400]" />
            <span className="text-xs font-mono font-bold text-[#FFD400]">{leverage}x Leverage</span>
            <input
              type="range"
              min="1"
              max="150"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-20 accent-[#FFD400] cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Live Chart & Order Book */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Chart Display Container */}
          <div className="bg-[#0b0f19] border border-[#1f2b45] rounded-xl p-3 h-48 sm:h-60 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#8b98a5] font-mono">
              <span className="flex items-center gap-1 text-[#FFD400]"><Activity className="w-3.5 h-3.5" /> QUANTUM TICKER</span>
              <span>1H Candlesticks</span>
            </div>

            {/* SVG Simulated Chart Wave */}
            <svg className="w-full h-32 text-[#FFD400] opacity-80" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD400" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#FFD400" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M0,80 Q50,20 100,60 T200,30 T300,70 T400,20 L400,100 L0,100 Z" fill="url(#chartGrad)" />
              <path d="M0,80 Q50,20 100,60 T200,30 T300,70 T400,20" fill="none" stroke="#FFD400" strokeWidth="2.5" />
            </svg>

            <div className="flex items-center justify-between text-xs font-mono text-[#8b98a5] pt-1 border-t border-[#1f2b45]">
              <span>24h High: ${(price * 1.05).toFixed(2)}</span>
              <span>24h Low: ${(price * 0.95).toFixed(2)}</span>
              <span className="text-[#10b981]">24h Vol: 142.8M</span>
            </div>
          </div>

          {/* Order Book Grid */}
          <div className="bg-[#0b0f19] border border-[#1f2b45] rounded-xl p-3 font-mono text-xs">
            <div className="text-[#8b98a5] font-bold mb-2 pb-1 border-b border-[#1f2b45] flex justify-between">
              <span>ORDER BOOK MATRIX</span>
              <span>SIZE</span>
            </div>

            {/* Asks (Sell) */}
            <div className="flex flex-col gap-1 mb-2">
              {asks.map((a, i) => (
                <div key={i} className="flex justify-between text-red-400 text-[11px]">
                  <span>${a.price}</span>
                  <span>{a.amount} EX3</span>
                </div>
              ))}
            </div>

            {/* Current Price Banner */}
            <div className="bg-[#131a2a] py-1 px-2 rounded text-center font-bold text-white text-sm my-1 border border-[#FFD400]/30">
              ${price.toFixed(2)} <span className="text-[#10b981] text-xs">▲ +18.42%</span>
            </div>

            {/* Bids (Buy) */}
            <div className="flex flex-col gap-1 mt-2">
              {bids.map((b, i) => (
                <div key={i} className="flex justify-between text-[#10b981] text-[11px]">
                  <span>${b.price}</span>
                  <span>{b.amount} EX3</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Order Form */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-[#1f2b45] rounded-xl p-4 flex flex-col justify-between">
          
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3">
            
            {/* Long / Short Direction Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-[#131a2a] p-1 rounded-xl border border-[#1f2b45]">
              <button
                type="button"
                onClick={() => setTradeDirection("Long")}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                  tradeDirection === "Long" ? 'bg-[#10b981] text-white shadow-lg' : 'text-[#8b98a5] hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Open Long</span>
              </button>

              <button
                type="button"
                onClick={() => setTradeDirection("Short")}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                  tradeDirection === "Short" ? 'bg-red-500 text-white shadow-lg' : 'text-[#8b98a5] hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Open Short</span>
              </button>
            </div>

            {/* Order Type Tabs */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#8b98a5]">
              {["Market", "Limit", "Stop-Limit"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOrderType(t)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    orderType === t ? 'bg-[#FFD400] text-[#0b0f19] font-bold' : 'hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#8b98a5] font-mono">ORDER PRICE (USDT)</label>
              <div className="flex items-center bg-[#131a2a] border border-[#1f2b45] rounded-lg px-3 py-2 text-xs text-white font-mono">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-transparent flex-1 outline-none font-bold"
                />
                <span className="text-[#8b98a5]">USDT</span>
              </div>
            </div>

            {/* Amount / Quantity Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#8b98a5] font-mono">QUANTITY</label>
              <div className="flex items-center bg-[#131a2a] border border-[#1f2b45] rounded-lg px-3 py-2 text-xs text-white font-mono">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-transparent flex-1 outline-none font-bold"
                />
                <span className="text-[#FFD400] font-bold">EX3</span>
              </div>
            </div>

            {/* Percentage Quick Select */}
            <div className="grid grid-cols-4 gap-1 font-mono text-[11px] text-[#8b98a5]">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmountPercent(pct)}
                  className={`py-1 rounded bg-[#131a2a] border border-[#1f2b45] hover:border-[#FFD400]/40 transition-all ${
                    amountPercent === pct ? 'border-[#FFD400] text-[#FFD400] font-bold' : ''
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Order Margin Summary */}
            <div className="bg-[#131a2a] p-2.5 rounded-lg border border-[#1f2b45] text-[11px] font-mono flex flex-col gap-1 text-[#8b98a5]">
              <div className="flex justify-between">
                <span>Required Margin:</span>
                <span className="text-white font-bold">${((price * Number(quantity || 0)) / leverage).toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Liquidation Price:</span>
                <span className="text-red-400 font-bold">${(price * 0.85).toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-cyberGlow ${
                tradeDirection === "Long"
                  ? 'bg-gradient-to-r from-[#10b981] to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
              }`}
            >
              {tradeDirection === "Long" ? `Execute Long (${leverage}x)` : `Execute Short (${leverage}x)`}
            </button>

            {orderSuccess && (
              <div className="flex items-center justify-center gap-2 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] text-xs font-mono font-bold p-2 rounded-lg animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>ORDER EXECUTED ON VAULT 3TH!</span>
              </div>
            )}

          </form>

        </div>

      </div>

    </section>
  );
}
