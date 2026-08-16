"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  BarChart2, 
  MoreHorizontal, 
  ArrowLeftRight, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  X,
  Check,
  CheckSquare,
  Square
} from 'lucide-react';

export default function FuturesTerminal() {
  // Navigation tabs
  const [topTab, setTopTab] = useState("Futures"); // Futures, Copy, Bots
  
  // Futures config state
  const [pair, setPair] = useState({ symbol: "BTCUSDT", price: 64480.3, change: "+1.34%" });
  const [marginMode, setMarginMode] = useState("Cross"); // Cross, Isolated
  const [leverage, setLeverage] = useState(3);
  
  // Modals state
  const [showPairModal, setShowPairModal] = useState(false);
  const [showMarginModal, setShowMarginModal] = useState(false);
  const [showLeverageModal, setShowLeverageModal] = useState(false);
  const [tempLeverage, setTempLeverage] = useState(3);

  // Form input state
  const [availableBalance] = useState(0); // 0 USDT as in screenshot
  const [orderType, setOrderType] = useState("Limit"); // Limit, Market
  const [priceInput, setPriceInput] = useState("64480.3");
  const [amountInput, setAmountInput] = useState("");
  const [amountUnit, setAmountUnit] = useState("BTC");
  const [sliderPercent, setSliderPercent] = useState(0);
  const [reducedOnly, setReducedOnly] = useState(false);
  const [tpSlChecked, setTpSlChecked] = useState(false);
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");

  // Position state & bottom tabs
  const [activeBottomTab, setActiveBottomTab] = useState("positions"); // positions, openOrders, bots
  const [positions, setPositions] = useState([]);
  const [showChartDrawer, setShowChartDrawer] = useState(false);
  const [showOrderSuccessAlert, setShowOrderSuccessAlert] = useState(null);

  // Countdown timer simulation for Funding rate (05:07:04)
  const [countdown, setCountdown] = useState({ h: 5, m: 7, s: 4 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 7, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync price input when pair changes
  useEffect(() => {
    setPriceInput(pair.price.toLocaleString('en-US', { minimumFractionDigits: 1 }));
  }, [pair]);

  // Real-time market price & orderbook simulation
  const [midPrice, setMidPrice] = useState(64553.2);
  const [indexPrice, setIndexPrice] = useState(64547.1);
  const [priceFlash, setPriceFlash] = useState(null); // 'up' | 'down' | null
  const [updatedAsksIdx, setUpdatedAsksIdx] = useState({});
  const [updatedBidsIdx, setUpdatedBidsIdx] = useState({});

  // Initial Asks (Sell Orders - Red) & Bids (Buy Orders - Green)
  const [asks, setAsks] = useState([
    { price: 64553.9, amount: 0.918, depth: 42 },
    { price: 64553.8, amount: 0.302, depth: 18 },
    { price: 64553.7, amount: 0.810, depth: 62 },
    { price: 64553.6, amount: 0.433, depth: 32 },
    { price: 64553.5, amount: 0.747, depth: 55 },
    { price: 64553.4, amount: 0.145, depth: 14 },
    { price: 64553.3, amount: 1.361, depth: 88 },
  ]);

  const [bids, setBids] = useState([
    { price: 64553.2, amount: 9.653, depth: 95 },
    { price: 64553.1, amount: 0.120, depth: 12 },
    { price: 64553.0, amount: 0.210, depth: 19 },
    { price: 64552.9, amount: 0.304, depth: 22 },
    { price: 64552.8, amount: 0.319, depth: 25 },
    { price: 64552.7, amount: 0.174, depth: 14 },
    { price: 64552.6, amount: 0.201, depth: 18 },
  ]);

  // Real-time market price & orderbook simulation with smooth 1.2s tick speed
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Mid price random tick (-0.2 to +0.2)
      const randMove = (Math.random() - 0.48) * 0.3;
      if (Math.abs(randMove) > 0.05) {
        setMidPrice(prev => {
          const newP = parseFloat((prev + randMove).toFixed(1));
          setPriceFlash(newP > prev ? 'up' : 'down');
          setTimeout(() => setPriceFlash(null), 500);
          return newP;
        });

        setIndexPrice(prev => parseFloat((prev + (Math.random() - 0.5) * 0.08).toFixed(1)));
      }

      // 2. Randomly update 1-2 Asks
      const nextAsksChanged = {};
      setAsks(prev =>
        prev.map((item, idx) => {
          if (Math.random() > 0.65) {
            nextAsksChanged[idx] = true;
            const newAmt = parseFloat((Math.random() * 1.5 + 0.1).toFixed(3));
            const newDepth = Math.min(100, Math.max(10, Math.floor(newAmt * 45)));
            return { ...item, amount: newAmt, depth: newDepth };
          }
          return item;
        })
      );
      setUpdatedAsksIdx(nextAsksChanged);

      // 3. Randomly update 1-2 Bids
      const nextBidsChanged = {};
      setBids(prev =>
        prev.map((item, idx) => {
          if (Math.random() > 0.65) {
            nextBidsChanged[idx] = true;
            const newAmt = parseFloat((Math.random() * 1.8 + 0.1).toFixed(3));
            const newDepth = Math.min(100, Math.max(10, Math.floor(newAmt * 40)));
            return { ...item, amount: newAmt, depth: newDepth };
          }
          return item;
        })
      );
      setUpdatedBidsIdx(nextBidsChanged);

      // Reset flash highlights after 500ms
      setTimeout(() => {
        setUpdatedAsksIdx({});
        setUpdatedBidsIdx({});
      }, 500);

    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Update orderbook prices around midPrice dynamically
  useEffect(() => {
    setAsks(prev =>
      prev.map((item, idx) => ({
        ...item,
        price: parseFloat((midPrice + (7 - idx) * 0.1).toFixed(1))
      }))
    );
    setBids(prev =>
      prev.map((item, idx) => ({
        ...item,
        price: parseFloat((midPrice - idx * 0.1).toFixed(1))
      }))
    );
  }, [midPrice]);


  const handleSliderChange = (pct) => {
    setSliderPercent(pct);
    if (pct === 0) setAmountInput("");
    else {
      const calcVal = ((pct / 100) * 0.05).toFixed(4);
      setAmountInput(calcVal);
    }
  };

  const handlePlaceOrder = (side) => {
    const entryPrice = parseFloat(priceInput.replace(/,/g, '')) || pair.price;
    const qty = parseFloat(amountInput) || 0.01;
    const newPos = {
      id: Date.now(),
      symbol: `${pair.symbol} Perp`,
      side: side, // 'Long' or 'Short'
      marginMode: marginMode,
      leverage: leverage,
      size: `${qty} BTC`,
      entryPrice: entryPrice.toFixed(1),
      markPrice: (entryPrice * 1.0005).toFixed(1),
      pnl: side === 'Long' ? '+1.45 USDT (+2.35%)' : '-0.85 USDT (-1.10%)',
      isProfitable: side === 'Long'
    };

    setPositions([newPos, ...positions]);
    setShowOrderSuccessAlert(`Order Placed: ${side} ${pair.symbol} at $${entryPrice.toFixed(1)}`);
    setTimeout(() => setShowOrderSuccessAlert(null), 3000);
  };

  const handleClosePosition = (id) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const availablePairs = [
    { symbol: "BTCUSDT", price: 64480.3, change: "+1.34%" },
    { symbol: "ETHUSDT", price: 3450.8, change: "+2.15%" },
    { symbol: "SOLUSDT", price: 182.4, change: "-0.85%" },
    { symbol: "BNBUSDT", price: 580.2, change: "+0.45%" },
    { symbol: "XRPUSDT", price: 0.6210, change: "+4.12%" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#eaecef] flex flex-col justify-between font-sans selection:bg-[#0ecb81] selection:text-black">
      
      {/* ----------------- TOP TABS BAR ----------------- */}
      <div className="bg-[#000000] px-4 pt-3 pb-2 flex items-center gap-6 border-b border-[#141822]">
        {["Futures", "Copy", "Bots"].map((tab) => (
          <button
            key={tab}
            onClick={() => setTopTab(tab)}
            className={`relative pb-1 text-base font-bold transition-colors ${
              topTab === tab ? 'text-white font-extrabold' : 'text-[#848e9c] hover:text-gray-300'
            }`}
          >
            {tab}
            {topTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ----------------- MARKET PAIR HEADER ----------------- */}
      <div className="bg-[#000000] px-4 py-2.5 flex items-center justify-between border-b border-[#141822]">
        
        {/* Left Pair Name & Change */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPairModal(true)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-black text-white tracking-tight">{pair.symbol}</span>
            <span className="bg-[#121620] text-[#848e9c] text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#232b38]">
              Perp <ChevronDown className="w-3 h-3 text-[#848e9c]" />
            </span>
          </button>

          <span className="text-xs font-bold text-[#0ecb81] bg-[#0ecb81]/10 px-1.5 py-0.5 rounded">
            {pair.change}
          </span>
        </div>

        {/* Right Header Icons */}
        <div className="flex items-center gap-4 text-[#848e9c]">
          <button className="text-[#f0b90b] hover:opacity-80" title="Rewards Center">
            <Gift className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowChartDrawer(!showChartDrawer)} 
            className="hover:text-white transition-colors"
            title="Chart View"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          <button className="hover:text-white transition-colors" title="Settings">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* ----------------- FUTURES MARGIN & LEVERAGE ROW ----------------- */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#141822] bg-[#000000]">
        
        {/* Margin Mode & Leverage Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMarginModal(true)}
            className="bg-[#1e2329] hover:bg-[#2b2f36] border border-[#2b2f36] text-white text-xs font-bold px-3 py-1 rounded-md transition-colors"
          >
            {marginMode}
          </button>

          <button
            onClick={() => {
              setTempLeverage(leverage);
              setShowLeverageModal(true);
            }}
            className="bg-[#1e2329] hover:bg-[#2b2f36] border border-[#2b2f36] text-white text-xs font-bold px-3 py-1 rounded-md transition-colors"
          >
            {leverage}X
          </button>
        </div>

        {/* Funding / Countdown Info */}
        <div className="text-right text-[11px] font-mono">
          <div className="text-[#848e9c]">Funding / Countdown</div>
          <div className="text-gray-300 font-semibold">
            0.0009% / {String(countdown.h).padStart(2, '0')}:{String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
          </div>
        </div>

      </div>

      {/* Alert Notification Toast */}
      {showOrderSuccessAlert && (
        <div className="bg-[#0ecb81] text-black font-bold text-xs px-4 py-2 text-center animate-pulse flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {showOrderSuccessAlert}
        </div>
      )}

      {/* ----------------- MAIN TRADING SECTION (2 COLUMNS) ----------------- */}
      <div className="p-3 grid grid-cols-12 gap-3 items-start flex-1">
        
        {/* LEFT COLUMN: ORDER ENTRY FORM (~58% width on 12-col grid -> col-span-7) */}
        <div className="col-span-7 flex flex-col gap-2.5">
          
          {/* Available Balance */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#848e9c]">Available</span>
            <div className="flex items-center gap-1 font-bold text-white">
              <span>{availableBalance} USDT</span>
              <button className="text-[#f0b90b] hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Order Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOrderType(orderType === "Limit" ? "Market" : "Limit")}
              className="w-full bg-[#1e2329] border border-[#2b2f36] rounded-md px-2.5 py-1.5 flex items-center justify-between text-xs text-white hover:bg-[#252a32] transition-colors"
            >
              <div className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#848e9c]" />
                <span className="font-bold">{orderType}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#848e9c]" />
            </button>
          </div>

          {/* Price Input Box */}
          <div className="flex flex-col gap-0.5">
            <div className="relative flex items-center bg-[#1e2329] border border-[#2b2f36] focus-within:border-[#f0b90b] rounded-md px-2.5 py-1.5">
              <div className="flex-1 flex flex-col">
                <span className="text-[9px] text-[#848e9c]">Price (USDT)</span>
                <input
                  type="text"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white outline-none w-full"
                />
              </div>
              <button 
                onClick={() => setPriceInput(pair.price.toString())}
                className="bg-[#2b2f36] hover:bg-[#363c4e] text-white text-[10px] font-bold px-2 py-1 rounded transition-colors"
              >
                BBO
              </button>
            </div>
          </div>

          {/* Amount Input Box */}
          <div className="flex flex-col gap-0.5">
            <div className="relative flex items-center bg-[#1e2329] border border-[#2b2f36] focus-within:border-[#f0b90b] rounded-md px-2.5 py-1.5">
              <div className="flex-1 flex flex-col">
                <span className="text-[9px] text-[#848e9c]">Amount</span>
                <input
                  type="number"
                  placeholder="0.000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white outline-none w-full"
                />
              </div>
              <button className="flex items-center gap-0.5 text-xs text-white font-bold bg-[#2b2f36] px-1.5 py-0.5 rounded">
                <span>{amountUnit}</span>
                <ChevronDown className="w-3 h-3 text-[#848e9c]" />
              </button>
            </div>
          </div>

          {/* Percentage Slider Component matching Image 2 */}
          <div className="py-2 px-1">
            <div className="relative flex items-center justify-between">
              {/* Progress Track line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2b2f36] -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-[#848e9c] -translate-y-1/2 z-0 transition-all"
                style={{ width: `${sliderPercent}%` }}
              />

              {/* Slider Dots */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleSliderChange(pct)}
                  className={`w-2.5 h-2.5 rounded-full z-10 border transition-all ${
                    sliderPercent >= pct 
                      ? 'bg-[#848e9c] border-[#848e9c] scale-110' 
                      : 'bg-[#1e2329] border-[#2b2f36]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Checkboxes: Reduced only / TP/SL */}
          <div className="flex items-center justify-between text-[11px] text-[#848e9c] pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <button
                type="button"
                onClick={() => setReducedOnly(!reducedOnly)}
                className="text-[#848e9c] hover:text-white"
              >
                {reducedOnly ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#0ecb81]" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
              </button>
              <span>Reduced only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <button
                type="button"
                onClick={() => setTpSlChecked(!tpSlChecked)}
                className="text-[#848e9c] hover:text-white"
              >
                {tpSlChecked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#0ecb81]" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
              </button>
              <span>TP/SL</span>
            </label>
          </div>

          {/* TP/SL Expandable Inputs */}
          {tpSlChecked && (
            <div className="grid grid-cols-2 gap-1.5 bg-[#181d24] p-1.5 rounded border border-[#2b2f36] text-[10px]">
              <input
                type="number"
                placeholder="TP Price"
                value={tpPrice}
                onChange={(e) => setTpPrice(e.target.value)}
                className="bg-[#1e2329] p-1 rounded text-white outline-none"
              />
              <input
                type="number"
                placeholder="SL Price"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                className="bg-[#1e2329] p-1 rounded text-white outline-none"
              />
            </div>
          )}

          {/* Details Summary Lines (Max / Cost / Est. Liq. Price) */}
          <div className="flex flex-col gap-1 text-[11px] pt-1">
            <div className="flex justify-between">
              <span className="text-[#848e9c]">Max</span>
              <span className="text-[#0ecb81] font-mono font-medium">0.0000 / 0.0000 BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848e9c]">Cost</span>
              <span className="text-[#848e9c] font-mono">-- / -- USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848e9c]">Est. Liq. Price</span>
              <span className="text-[#848e9c] font-mono">-- / -- USDT</span>
            </div>
          </div>

          {/* BUY (LONG) and SELL (SHORT) Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => handlePlaceOrder("Long")}
              className="w-full bg-[#0ecb81] hover:bg-[#0bb874] text-white font-black text-sm py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-md flex items-center justify-center"
            >
              Buy (Long)
            </button>

            <button
              onClick={() => handlePlaceOrder("Short")}
              className="w-full bg-[#f6465d] hover:bg-[#e03a50] text-white font-black text-sm py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-md flex items-center justify-center"
            >
              Sell (Short)
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE ORDER BOOK (~42% width on 12-col grid -> col-span-5) */}
        <div className="col-span-5 flex flex-col font-mono text-[11px]">
          
          {/* Table Header */}
          <div className="flex justify-between text-[#848e9c] pb-1 border-b border-[#1e2329] text-[10px]">
            <span>Price<br/><span className="text-[9px] text-[#5e6673]">(USDT)</span></span>
            <span className="text-right">Amount<br/><span className="text-[9px] text-[#5e6673]">(BTC)</span></span>
          </div>

          {/* Asks (Sell Orders - Red) */}
          <div className="flex flex-col py-1 gap-[3px]">
            {asks.map((ask, idx) => (
              <div 
                key={idx} 
                onClick={() => setPriceInput(ask.price.toLocaleString('en-US', { minimumFractionDigits: 1 }))}
                className={`relative flex justify-between items-center group cursor-pointer px-0.5 rounded transition-colors duration-150 ${
                  updatedAsksIdx[idx] ? 'bg-[#f6465d]/25' : 'hover:bg-[#f6465d]/10'
                }`}
              >
                {/* Background Depth Bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-[#f6465d]/20 pointer-events-none rounded-r transition-all duration-300 ease-out"
                  style={{ width: `${ask.depth}%` }}
                />
                <span className="text-[#f6465d] font-bold z-10">
                  {ask.price.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                </span>
                <span className="text-gray-200 text-right z-10">
                  {ask.amount.toFixed(3)}
                </span>
              </div>
            ))}
          </div>

          {/* Mid Current Price Display with Live Flash effect */}
          <div className={`my-1 py-1 border-y border-[#1e2329] flex flex-col items-start px-0.5 transition-colors duration-200 ${
            priceFlash === 'up' ? 'bg-[#0ecb81]/15' : priceFlash === 'down' ? 'bg-[#f6465d]/15' : ''
          }`}>
            <div className="flex items-center gap-1">
              <span className={`text-base font-extrabold tracking-tight transition-colors duration-200 ${
                priceFlash === 'down' ? 'text-[#f6465d]' : 'text-[#0ecb81]'
              }`}>
                {midPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })}
              </span>
              <span className={`text-xs ${priceFlash === 'down' ? 'text-[#f6465d]' : 'text-[#0ecb81]'}`}>
                {priceFlash === 'down' ? '↓' : '↑'}
              </span>
            </div>
            <span className="text-[10px] text-[#848e9c]">
              {indexPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })}
            </span>
          </div>

          {/* Bids (Buy Orders - Green) */}
          <div className="flex flex-col py-1 gap-[3px]">
            {bids.map((bid, idx) => (
              <div 
                key={idx} 
                onClick={() => setPriceInput(bid.price.toLocaleString('en-US', { minimumFractionDigits: 1 }))}
                className={`relative flex justify-between items-center group cursor-pointer px-0.5 rounded transition-colors duration-150 ${
                  updatedBidsIdx[idx] ? 'bg-[#0ecb81]/25' : 'hover:bg-[#0ecb81]/10'
                }`}
              >
                {/* Background Depth Bar */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-[#0ecb81]/20 pointer-events-none rounded-r transition-all duration-300 ease-out"
                  style={{ width: `${bid.depth}%` }}
                />
                <span className="font-bold text-[#0ecb81] z-10">
                  {bid.price.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                </span>
                <span className="text-gray-200 text-right z-10">
                  {bid.amount.toFixed(3)}
                </span>
              </div>
            ))}
          </div>

          {/* Precision Selector at bottom of orderbook */}
          <div className="flex items-center justify-between pt-1 text-[#848e9c]">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#1e2329] border border-[#2b2f36] rounded-sm flex items-center justify-center text-[8px]">
                ■
              </span>
            </div>
            <button className="bg-[#1e2329] text-gray-300 px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px]">
              0.1 <ChevronDown className="w-3 h-3 text-[#848e9c]" />
            </button>
          </div>

        </div>

      </div>

      {/* ----------------- POSITIONS & OPEN ORDERS TABS ----------------- */}
      <div className="border-t border-[#141822] bg-[#000000] px-3 pt-2">
        
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[#141822] pb-2">
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveBottomTab("positions")}
              className={`relative pb-1 font-bold ${
                activeBottomTab === "positions" ? 'text-white' : 'text-[#848e9c]'
              }`}
            >
              Positions ({positions.length})
              {activeBottomTab === "positions" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0b90b]" />
              )}
            </button>

            <button
              onClick={() => setActiveBottomTab("openOrders")}
              className={`relative pb-1 font-bold flex items-center gap-0.5 ${
                activeBottomTab === "openOrders" ? 'text-white' : 'text-[#848e9c]'
              }`}
            >
              Open Orders (0) <ChevronDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => setActiveBottomTab("bots")}
              className={`relative pb-1 font-bold ${
                activeBottomTab === "bots" ? 'text-white' : 'text-[#848e9c]'
              }`}
            >
              Bots (0)
            </button>
          </div>

          {/* Floating AI / Sparkle button icon */}
          <button className="bg-gradient-to-r from-teal-500 to-emerald-500 p-1.5 rounded-full text-black shadow-lg hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Positions Content */}
        <div className="py-4 min-h-[100px] flex flex-col justify-center">
          {positions.length === 0 ? (
            <div className="text-center text-xs text-[#5e6673]">
              No active positions
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {positions.map((pos) => (
                <div key={pos.id} className="bg-[#181d24] p-3 rounded-lg border border-[#2b2f36] flex justify-between items-center text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${pos.side === 'Long' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                        {pos.side}
                      </span>
                      <span className="font-extrabold text-white">{pos.symbol}</span>
                      <span className="text-[10px] bg-[#2b2f36] px-1 py-0.5 rounded text-[#848e9c]">
                        {pos.marginMode} {pos.leverage}X
                      </span>
                    </div>
                    <div className="text-[11px] text-[#848e9c]">
                      Entry: <span className="text-white">${pos.entryPrice}</span> | Mark: <span className="text-white">${pos.markPrice}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold font-mono ${pos.isProfitable ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                      {pos.pnl}
                    </span>
                    <button
                      onClick={() => handleClosePosition(pos.id)}
                      className="bg-[#2b2f36] hover:bg-[#363c4e] text-white text-[10px] font-bold px-2 py-0.5 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ----------------- COLLAPSIBLE BOTTOM CHART DRAWER BAR ----------------- */}
      <div className="bg-[#12161c] border-t border-[#1e2329] px-4 py-2 flex items-center justify-between text-xs text-gray-300 font-semibold cursor-pointer hover:bg-[#181d24] transition-colors"
           onClick={() => setShowChartDrawer(!showChartDrawer)}
      >
        <span className="flex items-center gap-2 font-mono">
          <BarChart2 className="w-4 h-4 text-[#f0b90b]" />
          {pair.symbol} Perp Chart
        </span>
        {showChartDrawer ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </div>

      {/* Expanded Chart Drawer View */}
      {showChartDrawer && (
        <div className="bg-[#0e1015] p-3 border-t border-[#1e2329] h-48 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between text-[11px] text-[#848e9c]">
            <span>1H Candlesticks</span>
            <span className="text-[#0ecb81]">24h Vol: 142.8M</span>
          </div>
          <svg className="w-full h-32 text-[#0ecb81]" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0,80 Q50,20 100,60 T200,30 T300,70 T400,20 L400,100 L0,100 Z" fill="rgba(14,203,129,0.15)" />
            <path d="M0,80 Q50,20 100,60 T200,30 T300,70 T400,20" fill="none" stroke="#0ecb81" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* ----------------- MODAL: MARGIN MODE (CROSS / ISOLATED) ----------------- */}
      {showMarginModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-[#1e2329] border-t border-[#2b2f36] rounded-t-2xl p-4 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#2b2f36] pb-2">
              <span className="font-bold text-base">Margin Mode</span>
              <button onClick={() => setShowMarginModal(false)}>
                <X className="w-5 h-5 text-[#848e9c]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setMarginMode("Cross"); setShowMarginModal(false); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  marginMode === "Cross" ? 'border-[#f0b90b] bg-[#f0b90b]/10' : 'border-[#2b2f36] bg-[#12161c]'
                }`}
              >
                <span className="font-bold text-sm">Cross</span>
                <span className="text-[10px] text-[#848e9c]">All margin balance is shared across open positions to avoid liquidation.</span>
              </button>

              <button
                onClick={() => { setMarginMode("Isolated"); setShowMarginModal(false); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  marginMode === "Isolated" ? 'border-[#f0b90b] bg-[#f0b90b]/10' : 'border-[#2b2f36] bg-[#12161c]'
                }`}
              >
                <span className="font-bold text-sm">Isolated</span>
                <span className="text-[10px] text-[#848e9c]">Margin is restricted to an individual position.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: LEVERAGE ADJUSTMENT ----------------- */}
      {showLeverageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-[#1e2329] border-t border-[#2b2f36] rounded-t-2xl p-4 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#2b2f36] pb-2">
              <span className="font-bold text-base">Adjust Leverage</span>
              <button onClick={() => setShowLeverageModal(false)}>
                <X className="w-5 h-5 text-[#848e9c]" />
              </button>
            </div>

            <div className="text-center font-extrabold text-2xl text-[#f0b90b]">
              {tempLeverage}X
            </div>

            <input
              type="range"
              min="1"
              max="125"
              value={tempLeverage}
              onChange={(e) => setTempLeverage(Number(e.target.value))}
              className="w-full accent-[#f0b90b] cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-[#848e9c] font-mono">
              <span>1X</span>
              <span>25X</span>
              <span>50X</span>
              <span>75X</span>
              <span>100X</span>
              <span>125X</span>
            </div>

            <button
              onClick={() => {
                setLeverage(tempLeverage);
                setShowLeverageModal(false);
              }}
              className="w-full bg-[#f0b90b] text-black font-extrabold py-3 rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: PAIR SELECTOR ----------------- */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-[#1e2329] border-t border-[#2b2f36] rounded-t-2xl p-4 flex flex-col gap-3 text-white max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2b2f36] pb-2">
              <span className="font-bold text-base">Select Futures Contract</span>
              <button onClick={() => setShowPairModal(false)}>
                <X className="w-5 h-5 text-[#848e9c]" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {availablePairs.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setPair(item);
                    setShowPairModal(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#2b2f36] transition-colors"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm text-white">{item.symbol}</span>
                    <span className="text-[10px] text-[#848e9c]">Perpetual</span>
                  </div>
                  <div className="flex flex-col items-end font-mono text-xs">
                    <span className="font-bold">${item.price}</span>
                    <span className={item.change.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>
                      {item.change}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
