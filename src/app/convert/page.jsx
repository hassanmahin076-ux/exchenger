"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gift, 
  SlidersHorizontal, 
  FileText, 
  ArrowUpDown, 
  ChevronDown, 
  Menu, 
  Home, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Wallet,
  X,
  CheckCircle,
  AlertCircle,
  BarChart2,
  Plus
} from 'lucide-react';

const COIN_RATES_IN_USDT = {
  USDT: 1,
  BTC: 64037.84,
  ETH: 3450.00,
  BNB: 570.00,
  TON: 6.80,
  TRX: 0.13,
  SOL: 145.50
};

const COIN_LOGOS = {
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029",
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029",
  BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029",
  TON: "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=029",
  TRX: "https://cryptologos.cc/logos/tron-trx-logo.svg?v=029",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029"
};

// Helper Component for Real Crypto Logos with Fallbacks
function CoinLogo({ symbol, size = "w-6 h-6" }) {
  const baseSymbol = (symbol || 'usdt').toLowerCase();
  const [imgSrc, setImgSrc] = useState(
    `https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(`https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`);
    setHasError(false);
  }, [baseSymbol]);

  if (hasError) {
    let bg = "bg-[#26a17b]";
    if (baseSymbol === "btc") bg = "bg-[#f7931a]";
    else if (baseSymbol === "eth") bg = "bg-[#627eea]";
    else if (baseSymbol === "bnb") bg = "bg-[#f3ba2f]";
    else if (baseSymbol === "ton") bg = "bg-[#0088cc]";
    else if (baseSymbol === "trx") bg = "bg-[#eb0029]";
    else if (baseSymbol === "sol") bg = "bg-[#14f195]";

    return (
      <div className={`${size} rounded-full ${bg} flex items-center justify-center font-extrabold text-[10px] text-white uppercase flex-shrink-0`}>
        {baseSymbol.slice(0, 3)}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={symbol}
      className={`${size} rounded-full object-contain flex-shrink-0 bg-[#161a22] p-0.5`}
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

export default function ConvertPage({ defaultTab = 'Convert' }) {
  const router = useRouter();

  // Navigation state
  const [topTab, setTopTab] = useState(defaultTab);
  const [modePill, setModePill] = useState('Instant');

  // Spot Trading state
  const [spotSide, setSpotSide] = useState('buy'); // 'buy' or 'sell'
  const [spotOrderType, setSpotOrderType] = useState('Market'); // 'Market' or 'Limit'
  const [spotOrderValue, setSpotOrderValue] = useState('');
  const [spotSliderPercent, setSpotSliderPercent] = useState(0);
  const [spotMarginEnabled, setSpotMarginEnabled] = useState(true);

  // Live Orderbook state (animates / ticks continuously in real time)
  const [orderbookAsks, setOrderbookAsks] = useState([
    { price: '63,002.2', qty: '0.3484', depth: 40 },
    { price: '63,001.9', qty: '0.0100', depth: 15 },
    { price: '63,001.6', qty: '0.0594', depth: 25 },
    { price: '63,001.2', qty: '1.1780', depth: 75 }
  ]);

  const [orderbookBids, setOrderbookBids] = useState([
    { price: '63,001.1', qty: '1.7118', depth: 80 },
    { price: '63,001.0', qty: '0.3732', depth: 45 },
    { price: '63,000.7', qty: '0.2274', depth: 30 },
    { price: '62,999.7', qty: '0.0265', depth: 10 }
  ]);

  const [liveBtcPrice, setLiveBtcPrice] = useState(63001.2);
  const [buyRatioPercent, setBuyRatioPercent] = useState(64);

  // Live orderbook animation ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderbookAsks(prev => prev.map(item => {
        const delta = (Math.random() * 0.08 - 0.04);
        const newQty = Math.max(0.005, parseFloat(item.qty) + delta);
        const newDepth = Math.min(95, Math.max(10, item.depth + Math.floor(Math.random() * 11 - 5)));
        return { ...item, qty: newQty.toFixed(4), depth: newDepth };
      }));

      setOrderbookBids(prev => prev.map(item => {
        const delta = (Math.random() * 0.08 - 0.04);
        const newQty = Math.max(0.005, parseFloat(item.qty) + delta);
        const newDepth = Math.min(95, Math.max(10, item.depth + Math.floor(Math.random() * 11 - 5)));
        return { ...item, qty: newQty.toFixed(4), depth: newDepth };
      }));

      setLiveBtcPrice(prev => {
        const priceDelta = (Math.random() * 0.6 - 0.3);
        return parseFloat((prev + priceDelta).toFixed(1));
      });

      setBuyRatioPercent(prev => {
        const ratioDelta = Math.floor(Math.random() * 5 - 2);
        return Math.min(78, Math.max(50, prev + ratioDelta));
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Convert pairs & amounts
  const [fromCoin, setFromCoin] = useState('USDT');
  const [toCoin, setToCoin] = useState('BTC');
  const [fromAmount, setFromAmount] = useState('');

  // User Balance State
  const [userUsdtBalance, setUserUsdtBalance] = useState(8.00);
  const [allBalances, setAllBalances] = useState({
    USDT: 8.00,
    BTC: 0,
    ETH: 0,
    BNB: 0,
    TON: 0,
    TRX: 0,
    SOL: 0
  });

  // Modal states
  const [selectCoinModalFor, setSelectCoinModalFor] = useState(null); // 'from' or 'to'
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Custom In-App Center Popup Modal State
  const [customPopup, setCustomPopup] = useState({ show: false, message: '' });

  const showInAppPopup = (message) => {
    setCustomPopup({ show: true, message });
  };

  // Fetch real user balance
  const fetchUserBalance = () => {
    const savedUid = typeof window !== 'undefined' ? localStorage.getItem('userUid') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

    if (savedUid || savedEmail) {
      fetch(`/api/user/balance?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.balance) {
            const b = data.balance;
            const newBals = {
              USDT: parseFloat(b.availableUsdt !== undefined ? b.availableUsdt : (b.totalUsdt || 0)),
              BTC: parseFloat(b.btc || 0),
              ETH: parseFloat(b.eth || 0),
              BNB: parseFloat(b.bnb || 0),
              TON: parseFloat(b.ton || 0),
              TRX: parseFloat(b.trx || 0),
              SOL: parseFloat(b.sol || 0)
            };
            setAllBalances(newBals);
            setUserUsdtBalance(parseFloat(b.totalUsdt || 0));
          }
        })
        .catch(err => console.warn('Fetch balance error:', err));
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const currentFromBalance = allBalances[fromCoin] !== undefined ? allBalances[fromCoin] : 0;

  // Calculate rate
  const fromRate = COIN_RATES_IN_USDT[fromCoin] || 1;
  const toRate = COIN_RATES_IN_USDT[toCoin] || 1;
  const exchangeRate = fromRate / toRate; // 1 FromCoin = exchangeRate ToCoin

  // Converted amount calculation (Deducting $0.10 USD fee from trade output)
  const parsedFrom = parseFloat(fromAmount) || 0;
  const grossToAmount = parsedFrom * exchangeRate;
  let netToAmountVal = 0;
  if (parsedFrom > 0) {
    if (toCoin === 'USDT') {
      netToAmountVal = Math.max(0, grossToAmount - 0.10);
    } else if (fromCoin === 'USDT') {
      const netFromUsdt = Math.max(0, parsedFrom - 0.10);
      netToAmountVal = netFromUsdt * exchangeRate;
    } else {
      const feeInToCoin = 0.10 / toRate;
      netToAmountVal = Math.max(0, grossToAmount - feeInToCoin);
    }
  }
  const convertedToAmount = parsedFrom > 0 ? netToAmountVal.toFixed(8) : '0.00000016';

  // Swap From and To coins
  const handleSwapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  // Execute Convert via backend API
  const handleExecuteConvert = async () => {
    const inputAmt = parseFloat(fromAmount);
    const fromRate = COIN_RATES_IN_USDT[fromCoin] || 1;
    const orderUsdtVal = inputAmt * fromRate;

    if (isNaN(inputAmt) || inputAmt <= 0) {
      showInAppPopup('Please enter a valid amount to convert');
      return;
    }

    if (orderUsdtVal < 1) {
      showInAppPopup('Minimum convert amount is $1 USDT.');
      return;
    }

    const savedUid = localStorage.getItem('userUid');
    const savedEmail = localStorage.getItem('userEmail');

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: savedUid,
          userEmail: savedEmail,
          fromCoin,
          toCoin,
          fromAmount: inputAmt,
          toAmount: parseFloat(convertedToAmount),
          feeUsdt: 0.1
        })
      });

      const data = await res.json();
      setIsSubmitting(false);
      setShowPreviewModal(false);

      if (data.success) {
        fetchUserBalance();
        setFromAmount('');

        // Update local asset state so assets page reflects converted coins instantly
        const currentSavedAssets = JSON.parse(localStorage.getItem('user_converted_assets') || '{}');
        currentSavedAssets[fromCoin] = Math.max(0, (currentSavedAssets[fromCoin] || (fromCoin === 'USDT' ? userUsdtBalance : 0)) - inputAmt);
        currentSavedAssets[toCoin] = (currentSavedAssets[toCoin] || 0) + parseFloat(convertedToAmount);
        localStorage.setItem('user_converted_assets', JSON.stringify(currentSavedAssets));

        // Notify app
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('balanceUpdated'));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('notificationUpdated'));
        }
      } else {
        showInAppPopup(`Conversion Error: ${data.error || 'Failed to execute convert'}`);
      }
    } catch (err) {
      setIsSubmitting(false);
      setShowPreviewModal(false);
      console.error('Convert submission error:', err);
      showInAppPopup('Server error processing conversion');
    }
  };

  // Execute Spot Trade (Buy or Sell)
  const handleExecuteSpotTrade = async () => {
    const inputVal = parseFloat(spotOrderValue);
    const btcPrice = COIN_RATES_IN_USDT.BTC || 64037.84;
    const orderUsdtVal = spotSide === 'buy' ? inputVal : (inputVal * btcPrice);

    if (isNaN(inputVal) || inputVal <= 0) {
      showInAppPopup(`Please enter a valid order value in ${spotSide === 'buy' ? 'USDT' : 'BTC'}`);
      return;
    }

    if (orderUsdtVal < 5) {
      showInAppPopup('Minimum order value is $5 USDT.');
      return;
    }

    const savedUid = typeof window !== 'undefined' ? localStorage.getItem('userUid') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

    setIsSubmitting(true);

    try {
      const fromC = spotSide === 'buy' ? 'USDT' : 'BTC';
      const toC = spotSide === 'buy' ? 'BTC' : 'USDT';
      const btcPrice = COIN_RATES_IN_USDT.BTC || 64037.84;
      
      let fromAmt = 0;
      let toAmt = 0;

      if (spotSide === 'buy') {
        fromAmt = inputVal;
        toAmt = inputVal / btcPrice;
      } else {
        fromAmt = inputVal / btcPrice;
        toAmt = inputVal;
      }

      const res = await fetch('/api/user/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: savedUid,
          userEmail: savedEmail,
          fromCoin: fromC,
          toCoin: toC,
          fromAmount: fromAmt,
          toAmount: toAmt,
          feeUsdt: 0.1
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        fetchUserBalance();
        setSpotOrderValue('');
        setSpotSliderPercent(0);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('balanceUpdated'));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('notificationUpdated'));
        }
      } else {
        showInAppPopup(`Spot Trade Error: ${data.error || 'Failed to execute trade'}`);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Spot trade error:', err);
      showInAppPopup('Server error processing spot trade');
    }
  };

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-black text-white flex flex-col mx-auto relative font-sans selection:bg-[#fcd535] selection:text-black overflow-x-hidden pb-20">
      
      {/* ---------------- 1. TOP NAVIGATION TABS (Convert, Spot, Futures, Options, Alpha) ---------------- */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#1c1c1e] bg-black z-10">
        <div className="flex items-center gap-5 text-sm font-semibold overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setTopTab('Convert')}
            className={`pb-1 font-bold whitespace-nowrap transition-colors ${topTab === 'Convert' ? 'text-[#fcd535] border-b-2 border-[#fcd535]' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Convert
          </button>
          <button 
            onClick={() => setTopTab('Spot')}
            className={`pb-1 font-bold whitespace-nowrap transition-colors ${topTab === 'Spot' ? 'text-white border-b-2 border-[#fcd535]' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Spot
          </button>
          <button 
            onClick={() => router.push('/futures')}
            className="pb-1 text-gray-400 hover:text-gray-200 whitespace-nowrap font-bold"
          >
            Futures
          </button>
        </div>

        <button className="text-gray-400 hover:text-white pl-2">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {topTab === 'Spot' ? (
        /* ---------------- SPOT TRADING VIEW (100% Matching 2nd Picture) ---------------- */
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 no-scrollbar pb-28">
          
          {/* Pair Header Row matching Image 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectCoinModalFor('from')}
                className="flex items-center gap-1.5 text-lg font-black text-white hover:text-gray-200"
              >
                <span>BTC/USDT</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-xs font-bold text-[#22c55e]">+0.24%</span>
              <span className="text-[9px] bg-[#1c2230] text-[#00ff66] px-1.5 py-0.5 rounded border border-[#2b3548] font-mono">
                MM 0.00%
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <button className="hover:text-white" title="Candlestick Chart">
                <BarChart2 className="w-5 h-5" />
              </button>
              <button className="hover:text-white" title="Orders History">
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Trading Grid: Left Order Entry (7 cols) + Right Orderbook (5 cols) */}
          <div className="grid grid-cols-12 gap-3">
            
            {/* Left Column: Buy/Sell Order Entry */}
            <div className="col-span-7 flex flex-col gap-3">
              
              {/* Buy / Sell Toggle Pills */}
              <div className="flex items-center bg-[#16171a] p-1 rounded-xl border border-[#242730]">
                <button
                  onClick={() => setSpotSide('buy')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    spotSide === 'buy'
                      ? 'bg-[#22c55e] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSpotSide('sell')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    spotSide === 'sell'
                      ? 'bg-[#ef4444] text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Leverage & Margin Controls */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 px-0.5">
                <div className="flex items-center gap-1.5">
                  <button className="bg-[#1c1d22] border border-[#2e313d] px-2 py-1 rounded-md text-white font-bold flex items-center gap-1">
                    <span>USDT 10x</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  <button className="bg-[#1c1d22] border border-[#2e313d] px-2 py-1 rounded-md text-white font-bold flex items-center gap-1">
                    <span>Borrow</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </div>

                <div className="flex flex-col items-end text-[9px] leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Margin</span>
                    <button 
                      onClick={() => setSpotMarginEnabled(!spotMarginEnabled)}
                      className={`w-6 h-3.5 rounded-full transition-colors relative ${spotMarginEnabled ? 'bg-[#22c55e]' : 'bg-gray-700'}`}
                    >
                      <span className={`block w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 transition-transform ${spotMarginEnabled ? 'left-3' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <span className="text-gray-500 text-[8px]">0.45% | 3.94%</span>
                </div>
              </div>

              {/* Available Balance */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-gray-400">Available</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="font-bold text-white">
                    {spotSide === 'buy' ? `${allBalances.USDT || 0} USDT` : `${allBalances.BTC || 0} BTC`}
                  </span>
                  <button 
                    onClick={() => router.push('/assets?action=deposit')}
                    className="w-3.5 h-3.5 bg-[#fcd535] text-black font-black rounded-full flex items-center justify-center text-[9px]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Type Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSpotOrderType(spotOrderType === 'Market' ? 'Limit' : 'Market')}
                  className="w-full bg-[#16171a] border border-[#282b33] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-white font-bold"
                >
                  <span>{spotOrderType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* Order Value Input */}
              <div className="bg-[#16171a] border border-[#282b33] rounded-xl px-3 py-2 flex items-center justify-between">
                <input
                  type="number"
                  placeholder={spotSide === 'buy' ? 'Order Value (USDT)' : 'Order Value (BTC)'}
                  value={spotOrderValue}
                  onChange={(e) => setSpotOrderValue(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-gray-500 font-mono font-bold outline-none"
                />
                <button className="flex items-center gap-0.5 text-xs text-gray-400 font-bold ml-1">
                  <span>{spotSide === 'buy' ? 'USDT' : 'BTC'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Interactive 5-Step Slider with Percentage Badge */}
              <div className="flex flex-col gap-1.5 py-1">
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono px-0.5">
                  <span>0%</span>
                  <span className="font-extrabold text-[#fcd535] bg-[#1a1c22] px-2 py-0.5 rounded-md border border-[#2b2e38] shadow-sm">
                    {spotSliderPercent}%
                  </span>
                  <span>100%</span>
                </div>

                <div className="relative flex items-center justify-between px-1 py-1.5">
                  {/* Track line background */}
                  <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-[#242730] rounded-full z-0" />
                  {/* Active track fill */}
                  <div 
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-[#fcd535] rounded-full z-0 transition-all"
                    style={{ width: `${Math.min(96, Math.max(0, spotSliderPercent))}%` }}
                  />
                  {/* HTML Range input for continuous smooth dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={spotSliderPercent}
                    onChange={(e) => {
                      const pct = parseInt(e.target.value, 10);
                      setSpotSliderPercent(pct);
                      if (spotSide === 'buy') {
                        const maxUsdt = allBalances.USDT || 0;
                        const val = (maxUsdt * pct) / 100;
                        setSpotOrderValue(val > 0 ? val.toFixed(2) : '');
                      } else {
                        const maxBtc = allBalances.BTC || 0;
                        const valInBtc = (maxBtc * pct) / 100;
                        setSpotOrderValue(valInBtc > 0 ? valInBtc.toFixed(8) : '');
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full"
                  />

                  {/* 5-Step visual nodes */}
                  {[0, 25, 50, 75, 100].map((pct) => {
                    const isPassed = spotSliderPercent >= pct;
                    return (
                      <div
                        key={pct}
                        className={`relative z-10 w-3.5 h-3.5 rounded-full border-2 transition-all pointer-events-none ${
                          spotSliderPercent === pct
                            ? 'bg-[#fcd535] border-white scale-125 shadow-[0_0_8px_#fcd535]'
                            : isPassed
                            ? 'bg-[#fcd535] border-[#fcd535]'
                            : 'bg-[#16171a] border-[#3e4350]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Order Calculations Breakdown */}
              <div className="bg-[#141518] border border-[#24262b] rounded-xl p-2.5 flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Max. {spotSide === 'buy' ? 'Buy' : 'Sell'}</span>
                  <span className="text-white font-bold">
                    {spotSide === 'buy' 
                      ? `${((parseFloat(spotOrderValue) || 0) / (COIN_RATES_IN_USDT.BTC || 64037.84)).toFixed(6)} BTC`
                      : `${allBalances.BTC || 0} BTC (≈ $${((parseFloat(spotOrderValue) || 0) * (COIN_RATES_IN_USDT.BTC || 64037.84)).toFixed(2)} USDT)`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Borrowed Amount</span>
                  <span className="text-white">0 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>To Borrow</span>
                  <span className="text-white">0.0000000 USDT</span>
                </div>
              </div>

              {/* Max Slippage Checkbox */}
              <label className="flex items-center gap-2 text-[11px] text-gray-400 cursor-pointer select-none">
                <input type="checkbox" className="rounded bg-[#16171a] border-[#2a2d37] text-[#22c55e] focus:ring-0 w-3.5 h-3.5" />
                <span>Max. Slippage</span>
              </label>

              {/* Action Button: Buy BTC / Sell BTC */}
              <button
                disabled={isSubmitting}
                onClick={handleExecuteSpotTrade}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-lg transition-all active:scale-[0.98] ${
                  spotSide === 'buy'
                    ? 'bg-[#22c55e] hover:bg-[#1eb054] text-black'
                    : 'bg-[#ef4444] hover:bg-[#dc2626] text-white'
                }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : spotSide === 'buy' ? "Buy BTC" : "Sell BTC"}
              </button>

            </div>

            {/* Right Column: Order Book matching Image 2 */}
            <div className="col-span-5 flex flex-col gap-1.5 bg-[#121316] border border-[#202228] p-2 rounded-2xl">
              
              {/* Order Book Header */}
              <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 pb-1 border-b border-[#1c1e24]">
                <span>Price (USDT)</span>
                <span>Qty (BTC)</span>
              </div>

              {/* Asks (Red Rows) with animated depth bars */}
              <div className="flex flex-col gap-1 font-mono text-[10px]">
                {orderbookAsks.map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center relative overflow-hidden px-1 py-0.5 rounded">
                    <div 
                      className="absolute right-0 top-0 bottom-0 bg-[#ef4444]/15 transition-all duration-500"
                      style={{ width: `${row.depth}%` }}
                    />
                    <span className="text-[#ef4444] font-semibold relative z-10">{row.price}</span>
                    <span className="text-gray-300 relative z-10 font-bold">{row.qty}</span>
                  </div>
                ))}
              </div>

              {/* Middle Current Price */}
              <div className="my-1 py-1 px-1 bg-[#1a1c22] rounded-lg border border-[#282b36] flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#22c55e] font-mono transition-all">
                    {liveBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">➔</span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">
                  ≈ {liveBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 1 })} USD
                </span>
              </div>

              {/* Bids (Green Rows) with animated depth bars */}
              <div className="flex flex-col gap-1 font-mono text-[10px]">
                {orderbookBids.map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center relative overflow-hidden px-1 py-0.5 rounded font-mono">
                    <div 
                      className="absolute right-0 top-0 bottom-0 bg-[#22c55e]/15 transition-all duration-500"
                      style={{ width: `${row.depth}%` }}
                    />
                    <span className="text-[#22c55e] font-semibold relative z-10">{row.price}</span>
                    <span className="text-gray-300 relative z-10 font-bold">{row.qty}</span>
                  </div>
                ))}
              </div>

              {/* Buy / Sell Volume ratio bar */}
              <div className="mt-1 pt-1 border-t border-[#1c1e24] flex items-center justify-between text-[9px] font-bold">
                <div 
                  className="bg-[#22c55e] h-4 rounded-l flex items-center justify-start px-1 text-black font-extrabold transition-all duration-500"
                  style={{ width: `${buyRatioPercent}%` }}
                >
                  <span>B {buyRatioPercent}%</span>
                </div>
                <div 
                  className="bg-[#ef4444] h-4 rounded-r flex items-center justify-end px-1 text-white font-extrabold transition-all duration-500"
                  style={{ width: `${100 - buyRatioPercent}%` }}
                >
                  <span>{100 - buyRatioPercent}% S</span>
                </div>
              </div>

              {/* Orderbook Precision Selector */}
              <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                <button className="bg-[#1c1d22] border border-[#2a2d37] px-2 py-0.5 rounded text-white font-mono font-bold flex items-center gap-1">
                  <span>0.1</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="p-1 hover:text-white">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Orders(0), Positions(0), Assets, Borrowing */}
          <div className="mt-2 border-t border-[#1c1c1e] pt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold border-b border-[#1c1c1e] pb-2">
              <div className="flex items-center gap-4">
                <button className="text-white border-b-2 border-[#fcd535] pb-1">Orders(0)</button>
                <button className="text-gray-500 hover:text-gray-300 pb-1">Positions(0)</button>
                <button className="text-gray-500 hover:text-gray-300 pb-1">Assets</button>
                <button className="text-gray-500 hover:text-gray-300 pb-1">Borrowing</button>
              </div>
            </div>

            {/* Empty Orders State */}
            <div className="py-8 flex flex-col items-center justify-center text-center gap-2 text-gray-500">
              <FileText className="w-8 h-8 stroke-1 text-gray-600" />
              <span className="text-xs">No open orders</span>
            </div>
          </div>

        </div>
      ) : (
        /* INSTANT CONVERT VIEW */
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 no-scrollbar pb-28">
          {/* ---------------- 2. EXECUTION MODE PILLS (Instant Only) ---------------- */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 bg-[#16171a] p-1 rounded-xl border border-[#272a30]">
            <button
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#2b2f38] text-white shadow-md cursor-default"
            >
              Instant
            </button>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <button className="hover:text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="hover:text-white" onClick={() => router.push('/assets')}>
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------- 4. EXCHANGE RATE EXCHANGE BANNER ---------------- */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 px-1">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-white font-bold">1 {fromCoin} = {exchangeRate >= 1 ? exchangeRate.toFixed(2) : exchangeRate.toFixed(6)} {toCoin}</span>
            <span className="text-[#22c55e] text-[10px] font-semibold">+0.29%</span>
          </div>
          <button onClick={handleSwapCoins} className="hover:text-white p-1" title="Swap Pair">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* ---------------- 5. FROM CONTAINER (Matching Image 100%) ---------------- */}
        <div className="bg-[#141518] border border-[#24262b] rounded-2xl p-4 flex flex-col gap-3">
          {/* Header Line */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-semibold">From</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Wallet className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-white font-bold">{['BTC', 'ETH', 'SOL'].includes(fromCoin) ? currentFromBalance.toFixed(6) : currentFromBalance.toFixed(2)} {fromCoin}</span>
              <button 
                onClick={() => router.push('/assets?action=deposit')}
                className="w-4 h-4 bg-[#fcd535] text-black font-extrabold rounded-full flex items-center justify-center text-[10px]"
              >
                +
              </button>
            </div>
          </div>

          {/* Input & Coin Selector Row */}
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => setSelectCoinModalFor('from')}
              className="flex items-center gap-2 bg-[#1e2026] hover:bg-[#282a32] border border-[#2e313d] px-3 py-2 rounded-xl text-white font-bold text-sm transition-colors"
            >
              <CoinLogo key={fromCoin} symbol={fromCoin} size="w-6 h-6" />
              <span>{fromCoin}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-gray-400 font-mono text-base">&gt;</span>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.01"
                className="w-28 bg-transparent text-right font-mono font-bold text-base text-white outline-none placeholder-gray-600"
              />
              <button 
                onClick={() => setFromAmount(currentFromBalance.toString())}
                className="text-[#fcd535] font-bold text-xs hover:underline ml-1"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- 6. MIDDLE SWAP BUTTON ---------------- */}
        <div className="relative flex justify-center -my-3 z-10">
          <button
            onClick={handleSwapCoins}
            className="w-9 h-9 rounded-full bg-[#1e2026] border border-[#2e313d] flex items-center justify-center text-white hover:bg-[#282a32] hover:border-[#fcd535] transition-all shadow-xl active:scale-90"
            title="Swap From and To"
          >
            <ArrowUpDown className="w-4 h-4 text-[#fcd535]" />
          </button>
        </div>

        {/* ---------------- 7. TO CONTAINER (Matching Image 100%) ---------------- */}
        <div className="bg-[#141518] border border-[#24262b] rounded-2xl p-4 flex flex-col gap-3">
          {/* Header Line */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-semibold">To</span>
          </div>

          {/* Output & Coin Selector Row */}
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => setSelectCoinModalFor('to')}
              className="flex items-center gap-2 bg-[#1e2026] hover:bg-[#282a32] border border-[#2e313d] px-3 py-2 rounded-xl text-white font-bold text-sm transition-colors"
            >
              <CoinLogo key={toCoin} symbol={toCoin} size="w-6 h-6" />
              <span>{toCoin}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-1 flex-1 justify-end font-mono">
              <span className="text-gray-400 text-base">&gt;</span>
              <span className="font-bold text-base text-gray-300">
                {convertedToAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Info Badge */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 pt-1">
          <span>Conversion Fee</span>
          <span className="font-mono text-[#fcd535] font-bold">0.10 USDT ($0.10 USD)</span>
        </div>

        {/* ---------------- 8. MAIN CTA BUTTON (Yellow Preview Button Box) ---------------- */}
        <button
          className="w-full mt-3 bg-[#fcd535] hover:bg-[#ebd02c] active:scale-95 text-black font-extrabold text-sm py-4 rounded-2xl transition-all shadow-lg text-center cursor-pointer block"
          onClick={() => {
            const inputAmt = parseFloat(fromAmount);
            const fromRate = COIN_RATES_IN_USDT[fromCoin] || 1;
            const orderUsdtVal = inputAmt * fromRate;

            if (isNaN(inputAmt) || inputAmt <= 0) {
              showInAppPopup('Please enter a valid amount to convert');
              return;
            }
            if (orderUsdtVal < 1) {
              showInAppPopup('Minimum convert amount is $1 USDT.');
              return;
            }
            setShowPreviewModal(true);
          }}
        >
          Preview
        </button>

      </div>
      )}

      {/* ---------------- 9. SELECT COIN MODAL ---------------- */}
      {selectCoinModalFor && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectCoinModalFor(null)} />

          <div className="relative z-10 w-full max-w-[430px] bg-[#141518] border-t border-[#282b35] rounded-t-3xl p-5 flex flex-col gap-3 text-white max-h-[70vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#24262b]">
              <h3 className="font-extrabold text-base text-white">Select {selectCoinModalFor === 'from' ? 'From' : 'To'} Coin</h3>
              <button onClick={() => setSelectCoinModalFor(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              {Object.keys(COIN_RATES_IN_USDT)
                .sort((a, b) => {
                  const balA = allBalances[a] || 0;
                  const balB = allBalances[b] || 0;
                  const usdA = balA * (COIN_RATES_IN_USDT[a] || 1);
                  const usdB = balB * (COIN_RATES_IN_USDT[b] || 1);
                  return usdB - usdA; // Put highest available balance coins at top
                })
                .map((symbol) => {
                  const bal = allBalances[symbol] || 0;
                  const rate = COIN_RATES_IN_USDT[symbol] || 1;
                  const usdVal = bal * rate;
                  const isPositive = bal > 0;
                  const formattedBal = ['BTC', 'ETH', 'SOL'].includes(symbol)
                    ? bal.toFixed(6)
                    : bal.toFixed(2);

                  return (
                    <button
                      key={symbol}
                      onClick={() => {
                        if (selectCoinModalFor === 'from') setFromCoin(symbol);
                        else setToCoin(symbol);
                        setSelectCoinModalFor(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all text-left border ${
                        isPositive 
                          ? 'bg-[#1a1d24] border-[#2e3340] hover:border-[#fcd535]' 
                          : 'bg-[#141518] border-transparent hover:bg-[#1e2026]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CoinLogo key={symbol} symbol={symbol} size="w-8 h-8" />
                        <div>
                          <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span>{symbol}</span>
                            {isPositive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" title="Has Balance" />
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            1 {symbol} = ${rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)} USDT
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end font-mono">
                        <span className={`font-bold text-xs ${isPositive ? 'text-white' : 'text-gray-500'}`}>
                          {formattedBal} {symbol}
                        </span>
                        {isPositive && (
                          <span className="text-[#fcd535] text-[10px] font-bold">
                            ≈ ${usdVal.toFixed(2)} USD
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

        {/* ---------------- 10. PREVIEW CONFIRMATION MODAL ---------------- */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[380px] bg-[#141518] border border-[#282b35] rounded-3xl p-5 flex flex-col gap-4 text-white shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#24262b] pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#fcd535]" />
                <span>Confirm Conversion</span>
              </h3>
              <button onClick={() => setShowPreviewModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-1 font-mono">
              <div className="flex justify-between items-center bg-[#1a1c22] p-3 rounded-xl border border-[#272a33]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-sans">You Pay</span>
                  <span className="text-base font-bold text-white">{fromAmount || '0'} {fromCoin}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-sans">You Receive</span>
                  <span className="text-base font-bold text-[#22c55e]">{convertedToAmount} {toCoin}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-gray-400 pt-1 font-sans">
                <div className="flex justify-between">
                  <span>Exchange Rate</span>
                  <span className="text-white font-mono font-bold">1 {fromCoin} ≈ {exchangeRate.toFixed(6)} {toCoin}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee</span>
                  <span className="text-[#fcd535] font-mono font-bold">0.10 USDT ($0.10 USD)</span>
                </div>
                <div className="flex justify-between">
                  <span>Source Wallet</span>
                  <span className="text-white">Spot Wallet</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="flex-1 py-3 bg-[#242730] hover:bg-[#2e323e] text-white font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleExecuteConvert}
                className="flex-1 py-3 bg-[#fcd535] hover:bg-[#ebd02c] active:scale-95 text-black font-extrabold text-xs rounded-xl transition-all shadow-lg text-center cursor-pointer"
              >
                {isSubmitting ? 'Converting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 11. CENTER CUSTOM IN-APP POPUP MODAL ---------------- */}
      {customPopup.show && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 pointer-events-auto"
          onClick={() => setCustomPopup({ show: false, message: '' })}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[290px] bg-[#1a1c23] border border-[#2e3240] rounded-2xl p-4 flex flex-col items-center gap-3 text-center text-white shadow-2xl animate-in zoom-in-95 duration-200 border-t-2 border-t-[#fcd535]"
          >
            <div className="w-10 h-10 rounded-full bg-[#fcd535]/15 border border-[#fcd535]/40 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#fcd535]" />
            </div>
            <p className="text-xs font-bold text-gray-200 leading-snug px-1">
              {customPopup.message}
            </p>
            <button
              onClick={() => setCustomPopup({ show: false, message: '' })}
              className="w-full py-2.5 bg-[#fcd535] hover:bg-[#ebd02c] active:scale-95 text-black font-extrabold text-xs rounded-xl transition-all shadow-md mt-1 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav Spacer */}
      <div className="h-16" />

      {/* ---------------- 11. BOTTOM NAVIGATION BAR ---------------- */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0a0c10]/95 backdrop-blur-md border-t border-[#1c2230] px-3 py-2 flex items-center justify-between z-40 text-[10px] text-gray-400 font-medium">
        <button onClick={() => router.push('/home')} className="flex flex-col items-center gap-1 hover:text-white">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button onClick={() => router.push('/markets')} className="flex flex-col items-center gap-1 hover:text-white">
          <TrendingUp className="w-5 h-5" />
          <span>Markets</span>
        </button>

        <button onClick={() => router.push('/convert')} className="flex flex-col items-center gap-1 text-[#fcd535] font-bold">
          <RefreshCw className="w-5 h-5 text-[#fcd535] animate-spin-once" />
          <span>Trade</span>
        </button>

        <button onClick={() => router.push('/futures')} className="flex flex-col items-center gap-1 hover:text-white">
          <Layers className="w-5 h-5" />
          <span>Futures</span>
        </button>

        <button onClick={() => router.push('/assets')} className="flex flex-col items-center gap-1 hover:text-white">
          <Wallet className="w-5 h-5" />
          <span>Assets</span>
        </button>
      </div>

    </div>
  );
}
