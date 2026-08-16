"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Menu,
  Info,
  DollarSign,
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  RefreshCw,
  History,
  Sparkles,
  ArrowLeft,
  HelpCircle,
  FileText,
  Copy,
  BookOpen,
  QrCode,
  Plus
} from 'lucide-react';

// Helper Component for High-Res QR Code Rendering (Scannable for assigned address)
function DepositQRCode({ coin = 'USDT', address = '' }) {
  const qrUrl = address 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(address)}&color=000000&bgcolor=ffffff`
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=0x0e09828668d149aCE965599573561215C5aa2a44&color=000000&bgcolor=ffffff`;

  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-white p-3.5 rounded-2xl flex items-center justify-center shadow-xl border border-gray-200">
      <img
        src={qrUrl}
        alt={`QR Code for ${address}`}
        className="w-full h-full object-contain rounded-lg"
      />
      {/* Center Tether Badge */}
      <div className="absolute w-10 h-10 rounded-full bg-[#26a17b] border-2 border-white flex items-center justify-center shadow-md">
        <span className="text-white font-extrabold text-sm">₮</span>
      </div>
    </div>
  );
}

// Helper Component for Crypto Logos with Fallbacks
function CoinLogo({ symbol, size = "w-9 h-9" }) {
  const baseSymbol = symbol.toLowerCase();
  const [imgSrc, setImgSrc] = useState(
    `https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(`https://assets.coincap.io/assets/icons/${baseSymbol}@2x.png`);
    setHasError(false);
  }, [baseSymbol]);

  if (hasError) {
    let bg = "bg-[#3b82f6]";
    if (baseSymbol === "eth") bg = "bg-[#627eea]";
    else if (baseSymbol === "bnb") bg = "bg-[#f3ba2f]";
    else if (baseSymbol === "gram") bg = "bg-[#0088cc]";
    else if (baseSymbol === "usdt") bg = "bg-[#26a17b]";
    else if (baseSymbol === "pepe") bg = "bg-[#25c26e]";
    else if (baseSymbol === "og") bg = "bg-[#9c27b0]";
    else if (baseSymbol === "btc") bg = "bg-[#f7931a]";
    else if (baseSymbol === "sol") bg = "bg-[#14f195]";
    else if (baseSymbol === "ton") bg = "bg-[#0088cc]";
    else if (baseSymbol === "trx") bg = "bg-[#eb0029]";

    return (
      <div className={`${size} rounded-full ${bg} flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm flex-shrink-0`}>
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

export default function AssetsVault() {
  const router = useRouter();

  // New User Onboarding Screen State (defaults to checking localStorage)
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Check if onboarding was previously skipped or if direct deposit action is triggered
  useEffect(() => {
    const isSkipped = localStorage.getItem('assetsOnboardingSkipped');
    if (isSkipped === 'true') {
      setShowOnboarding(false);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('action') === 'deposit' || params.get('deposit') === 'true') {
        setShowOnboarding(false);
        setSelectedDepositCoin('USDT');
        setSelectedDepositChain({
          id: 'bsc',
          name: 'BSC (BEP20)',
          badge: 'Recommended',
          confirmations: '15 confirmation(s)',
          minAmount: '0.005 USDT',
          address: '0xf595458791d696829817bcacc1b994d17e25ec72'
        });
        setActiveModal('depositAddress');
      }
    }
  }, []);

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('assetsOnboardingSkipped', 'true');
  };

  // Real-time Countdown Timer State for Bonus Event (03D : 23H : 59M : 59S)
  const [countdown, setCountdown] = useState({
    days: 3,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Top header tab state (Overview, Spot, Futures)
  const [topTab, setTopTab] = useState('Overview');
  
  // Section tab state (Crypto, Account)
  const [sectionTab, setSectionTab] = useState('Crypto');
  
  // Eye balance toggle state
  const [hideBalance, setHideBalance] = useState(false);
  
  // Hide small balances checkbox state (Auto ON by default for new accounts)
  const [hideSmallBalances, setHideSmallBalances] = useState(true);

  // Search input state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'deposit', 'depositSelectCoin', 'depositSelectChain', 'depositAddress', 'withdraw', 'transfer', 'convert', 'currency', 'assetDetail', 'history'
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Deposit Flow States (Matching 4-Step Bybit Screenshots)
  const [selectedDepositCoin, setSelectedDepositCoin] = useState('USDT');
  const [selectedDepositChain, setSelectedDepositChain] = useState({
    id: 'bsc',
    name: 'BSC (BEP20)',
    badge: 'Recently Used',
    iconColor: 'bg-[#f3ba2f] text-black',
    confirmations: '60 confirmations',
    minAmount: '0.005 USDT',
    address: '0x0e09828668d149aCE965599573561215C5aa2a44'
  });
  const [coinSearchQuery, setCoinSearchQuery] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Withdrawal Flow States (Matching 3-Step Screenshots)
  const [selectedWithdrawCoin, setSelectedWithdrawCoin] = useState('USDT');
  const [selectedWithdrawChain, setSelectedWithdrawChain] = useState(null);
  const [withdrawSearchQuery, setWithdrawSearchQuery] = useState('');
  const [withdrawHideZeroBalances, setWithdrawHideZeroBalances] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showAccountOptions, setShowAccountOptions] = useState(true);
  const [withdrawAccounts, setWithdrawAccounts] = useState({
    funding: true,
    unified: false,
    earn: false
  });
  const [showWithdrawChainModal, setShowWithdrawChainModal] = useState(false);

  // Real-time Transaction History State
  const [dbHistoryList, setDbHistoryList] = useState([]);
  const [latestHistoryText, setLatestHistoryText] = useState('you have recive 0.5$');
  const [latestHistoryStatus, setLatestHistoryStatus] = useState('Completed');

  useEffect(() => {
    const fetchUserHistory = () => {
      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');

      if (savedUid || savedEmail) {
        fetch(`/api/user/history?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.history && data.history.length > 0) {
              setDbHistoryList(data.history);
              const top = data.history[0];
              const titleText = top.title || top.type || 'Transaction';
              const amtText = top.amount ? ` (${top.amount})` : '';
              setLatestHistoryText(`${titleText}${amtText}`);
              setLatestHistoryStatus(top.status || 'Completed');
            }
          })
          .catch(err => console.warn('History fetch error:', err));
      }
    };

    fetchUserHistory();
    const interval = setInterval(fetchUserHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const [historyFilter, setHistoryFilter] = useState('All');
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      type: 'Deposit',
      symbol: 'USDT',
      amount: '+50.00 USDT',
      status: 'Completed',
      time: 'Just now',
      txHash: '0x8f2a...39b1'
    },
    {
      id: 'tx-2',
      type: 'Transfer',
      symbol: 'USDC',
      amount: '0.13 USDC',
      status: 'Completed',
      time: '5 mins ago',
      txHash: '0x3c1d...9e44'
    },
    {
      id: 'tx-3',
      type: 'Trade',
      symbol: 'ETH',
      amount: '0.0000375 ETH',
      status: 'Completed',
      time: '12 mins ago',
      txHash: '0x7e4a...11c9'
    },
    {
      id: 'tx-4',
      type: 'Withdraw',
      symbol: 'BTC',
      amount: '-0.0005 BTC',
      status: 'Completed',
      time: '1 hour ago',
      txHash: '0x992b...fa01'
    }
  ]);

  const handleAddTransaction = (type, symbol, amountStr) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      type,
      symbol,
      amount: amountStr,
      status: 'Completed',
      time: 'Just now',
      txHash: '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6)
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Available Display Currency Options
  const CURRENCIES = [
    { code: 'USDT', name: 'TetherUS', symbol: 'USDT', displayVal: '0.00', subVal: '≈ 0.00000000 BTC', type: 'crypto' },
    { code: 'BNB', name: 'BNB', symbol: 'BNB', displayVal: '0.00', subVal: '≈ 0.00000000 BTC', type: 'crypto' },
    { code: 'USDC', name: 'USD Coin', symbol: 'USDC', displayVal: '0.00', subVal: '≈ 0.00000000 BTC', type: 'crypto' },
    { code: 'BTC', name: 'Bitcoin', symbol: 'BTC', displayVal: '0.00000000', subVal: '≈ 0.00 USD', type: 'crypto' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', displayVal: '0.00', subVal: '≈ 0.00000000 BTC', type: 'fiat' },
    { code: 'USD', name: 'US Dollar', symbol: '$', displayVal: '0.00', subVal: '≈ 0.00000000 BTC', type: 'fiat' },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [currencySearch, setCurrencySearch] = useState('');

  // Balances list (Only USDT and BNB with initial balance)
  const [balancesList, setBalancesList] = useState([
    { symbol: "USDT", name: "TetherUS", amount: "0.00", usdValStr: "0.00 USD", usdValNum: 0, color: "#26a17b" },
    { symbol: "BTC", name: "Bitcoin", amount: "0.00000000", usdValStr: "0.00 USD", usdValNum: 0, color: "#f7931a" },
    { symbol: "BNB", name: "BNB", amount: "0.0000", usdValStr: "0.00 USD", usdValNum: 0, color: "#f3ba2f" },
    { symbol: "TON", name: "Toncoin", amount: "0.00", usdValStr: "0.00 USD", usdValNum: 0, color: "#0088cc" },
    { symbol: "TRX", name: "TRON", amount: "0.00", usdValStr: "0.00 USD", usdValNum: 0, color: "#ef0027" },
    { symbol: "ETH", name: "Ethereum", amount: "0.0000", usdValStr: "0.00 USD", usdValNum: 0, color: "#627eea" }
  ]);

  const [userTotalUsdt, setUserTotalUsdt] = useState(0.00);
  const [userSpotUsdt, setUserSpotUsdt] = useState(0.00);
  const [userFuturesUsdt, setUserFuturesUsdt] = useState(0.00);

  // Transfer Modal State
  const [transferFrom, setTransferFrom] = useState('Spot');
  const [transferTo, setTransferTo] = useState('Futures');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [selectedTransferCoin, setSelectedTransferCoin] = useState('USDT');
  const [transferCoinSearchQuery, setTransferCoinSearchQuery] = useState('');

  const ALL_TRANSFER_COINS = [
    { symbol: 'USDT', name: 'TetherUS', fullName: 'Tether USD' },
    { symbol: 'BTC', name: 'Bitcoin', fullName: 'Bitcoin' },
    { symbol: 'BNB', name: 'BNB', fullName: 'BNB Token' },
    { symbol: 'TON', name: 'Toncoin', fullName: 'Toncoin' },
    { symbol: 'TRX', name: 'TRON', fullName: 'TRON' },
    { symbol: 'ETH', name: 'Ethereum', fullName: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana', fullName: 'Solana' }
  ];

  const getCoinAvailableBalance = (coinSymbol) => {
    if (coinSymbol === 'USDT') {
      return transferFrom === 'Spot' ? userSpotUsdt : userFuturesUsdt;
    }
    const found = balancesList.find(b => b.symbol === coinSymbol);
    if (!found) return 0;
    const amt = parseFloat(found.amount);
    return isNaN(amt) ? 0 : amt;
  };

  const handleTransferSubmit = async () => {
    const numAmt = parseFloat(transferAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid transfer amount');
      return;
    }

    const sourceBal = getCoinAvailableBalance(selectedTransferCoin);
    if (numAmt > sourceBal) {
      alert(`Insufficient ${transferFrom} ${selectedTransferCoin} balance! Available: ${sourceBal} ${selectedTransferCoin}`);
      return;
    }

    const savedUid = localStorage.getItem('userUid');
    const savedEmail = localStorage.getItem('userEmail');

    setTransferSubmitting(true);
    try {
      const res = await fetch('/api/user/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: savedUid,
          userEmail: savedEmail,
          fromAccount: transferFrom,
          toAccount: transferTo,
          amount: numAmt,
          coin: selectedTransferCoin
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.spotUsdt !== undefined) {
          const newSpot = parseFloat(data.spotUsdt);
          setUserSpotUsdt(newSpot);
          if (newSpot <= 0) {
            localStorage.removeItem('user_converted_assets');
          }
        }
        if (data.futuresUsdt !== undefined) {
          setUserFuturesUsdt(parseFloat(data.futuresUsdt));
        }

        alert(`✅ Transfer Successful!\n${numAmt} ${selectedTransferCoin} transferred from ${transferFrom} Account to ${transferTo} Account`);
        setActiveModal(null);
        setTransferAmount('');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('balanceUpdated'));
        }
      } else {
        alert(`❌ Transfer Error: ${data.error || 'Failed to complete transfer'}`);
      }
    } catch (err) {
      console.error('Transfer Error:', err);
      alert('❌ Server error processing transfer');
    } finally {
      setTransferSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBalance = () => {
      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');
      const savedConverted = JSON.parse(localStorage.getItem('user_converted_assets') || '{}');

      const COIN_RATES = {
        USDT: 1,
        BTC: 64037.84,
        BNB: 570.00,
        TON: 6.80,
        TRX: 0.13,
        ETH: 3450.00,
        SOL: 145.50
      };

      if (savedUid || savedEmail) {
        fetch(`/api/user/balance?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.balance) {
              const b = data.balance;
              const usdtAmount = b.availableUsdt !== undefined ? parseFloat(b.availableUsdt) : parseFloat(b.totalUsdt || 0);

              const rawSpotUsdt = b.spotUsdt !== undefined ? parseFloat(b.spotUsdt) : usdtAmount;
              const futuresUsdtVal = b.futuresUsdt !== undefined ? Math.max(0, parseFloat(b.futuresUsdt)) : 0.00;
              const maxPossibleSpot = Math.max(0, usdtAmount - futuresUsdtVal);
              const spotUsdtVal = Math.min(rawSpotUsdt, maxPossibleSpot);

              setUserSpotUsdt(spotUsdtVal);
              setUserFuturesUsdt(futuresUsdtVal);

              const totalUsdtCombined = spotUsdtVal + futuresUsdtVal;
              const totalUsdtVal = totalUsdtCombined * COIN_RATES.USDT;

              const btcAmount = b.btc !== undefined ? parseFloat(b.btc) : parseFloat(savedConverted.BTC || 0);
              const bnbAmount = b.bnb !== undefined ? parseFloat(b.bnb) : parseFloat(savedConverted.BNB || 0);
              const tonAmount = b.ton !== undefined ? parseFloat(b.ton) : parseFloat(savedConverted.TON || 0);
              const trxAmount = b.trx !== undefined ? parseFloat(b.trx) : parseFloat(savedConverted.TRX || 0);
              const ethAmount = b.eth !== undefined ? parseFloat(b.eth) : parseFloat(savedConverted.ETH || 0);
              const solAmount = b.sol !== undefined ? parseFloat(b.sol) : parseFloat(savedConverted.SOL || 0);

              const spotUsdtValUsd = spotUsdtVal * COIN_RATES.USDT;
              const btcVal = btcAmount * COIN_RATES.BTC;
              const bnbVal = bnbAmount * COIN_RATES.BNB;
              const tonVal = tonAmount * COIN_RATES.TON;
              const trxVal = trxAmount * COIN_RATES.TRX;
              const ethVal = ethAmount * COIN_RATES.ETH;
              const solVal = solAmount * COIN_RATES.SOL;

              const totalPortfolioUsd = spotUsdtValUsd + btcVal + bnbVal + tonVal + trxVal + ethVal + solVal + futuresUsdtVal;
              setUserTotalUsdt(totalPortfolioUsd);

              setBalancesList([
                {
                  symbol: "USDT",
                  name: "TetherUS",
                  amount: totalUsdtCombined.toFixed(2),
                  usdValStr: `${totalUsdtVal.toFixed(2)} USD`,
                  usdValNum: totalUsdtVal,
                  color: "#26a17b"
                },
                {
                  symbol: "BTC",
                  name: "Bitcoin",
                  amount: btcAmount.toFixed(8),
                  usdValStr: `${btcVal.toFixed(2)} USD`,
                  usdValNum: btcVal,
                  color: "#f7931a"
                },
                {
                  symbol: "BNB",
                  name: "BNB",
                  amount: bnbAmount.toFixed(4),
                  usdValStr: `${bnbVal.toFixed(2)} USD`,
                  usdValNum: bnbVal,
                  color: "#f3ba2f"
                },
                {
                  symbol: "TON",
                  name: "Toncoin",
                  amount: tonAmount.toFixed(2),
                  usdValStr: `${tonVal.toFixed(2)} USD`,
                  usdValNum: tonVal,
                  color: "#0088cc"
                },
                {
                  symbol: "TRX",
                  name: "TRON",
                  amount: trxAmount.toFixed(2),
                  usdValStr: `${trxVal.toFixed(2)} USD`,
                  usdValNum: trxVal,
                  color: "#ef0027"
                },
                {
                  symbol: "ETH",
                  name: "Ethereum",
                  amount: ethAmount.toFixed(4),
                  usdValStr: `${ethVal.toFixed(2)} USD`,
                  usdValNum: ethVal,
                  color: "#627eea"
                },
                {
                  symbol: "SOL",
                  name: "Solana",
                  amount: solAmount.toFixed(4),
                  usdValStr: `${solVal.toFixed(2)} USD`,
                  usdValNum: solVal,
                  color: "#14f195"
                }
              ]);
            }
          })
          .catch(err => console.warn('AssetsVault fetch balance error:', err));
      }
    };

    fetchBalance();
    window.addEventListener('storage', fetchBalance);
    window.addEventListener('authChange', fetchBalance);
    window.addEventListener('balanceUpdated', fetchBalance);
    return () => {
      window.removeEventListener('storage', fetchBalance);
      window.removeEventListener('authChange', fetchBalance);
      window.removeEventListener('balanceUpdated', fetchBalance);
    };
  }, []);

  // Handle direct deposit query parameter from Home Page Deposit Button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action') || params.get('modal') || params.get('flow');
      if (action === 'deposit') {
        setShowOnboarding(false);
        setActiveModal('depositSelectCoin');
      }
    }
  }, []);

  // Filtering balances based on search and hideSmallBalances
  const filteredBalances = balancesList.filter((item) => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const itemUsdVal = (topTab === 'Spot' && item.symbol === 'USDT')
      ? userSpotUsdt
      : (topTab === 'Overview' && item.symbol === 'USDT')
        ? (userSpotUsdt + userFuturesUsdt)
        : item.usdValNum;

    if (hideSmallBalances) {
      return matchesSearch && itemUsdVal >= 0.05;
    }
    return matchesSearch;
  });

  const handleTradeClick = (asset) => {
    router.push(`/trade?symbol=${asset.symbol}USDT`);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#38bdf8] selection:text-black">
      
      {/* ---------------- NEW USER ONBOARDING SCREEN (Matching User Screenshot) ---------------- */}
      {showOnboarding ? (
        <div className="w-full min-h-screen bg-black text-white flex flex-col justify-start px-5 py-4 select-none relative animate-in fade-in duration-200">
          
          {/* Top Bar: Overview (Center) & skip (Right) */}
          <div className="flex items-center justify-between pt-1 pb-2 relative z-10">
            <div className="w-10"></div> {/* Spacer for centering */}
            <span className="font-extrabold text-base text-white tracking-wide">Overview</span>
            <button
              onClick={handleSkipOnboarding}
              className="text-white hover:text-yellow-400 font-semibold text-sm cursor-pointer transition-colors px-2 py-1"
            >
              skip
            </button>
          </div>

          {/* Center Main Hero Section (Shifted Upwards) */}
          <div className="flex flex-col items-center text-center pt-1 pb-4 gap-2">
            
            {/* User Logo Image (Bigger & shifted up) */}
            <div className="relative w-64 h-48 sm:w-72 sm:h-52 flex items-center justify-center -mt-1 mb-0">
              <img 
                src="/wallet-hero.png" 
                alt="Deposit Hero Wallet" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title: Deposit and start growing now (Single Line & Shifted Up) */}
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight whitespace-nowrap -mt-1">
              Deposit and start growing now
            </h2>

            {/* Primary Action Button: Deposit Now (Bright Lime Green) */}
            <button
              onClick={() => {
                handleSkipOnboarding();
                setActiveModal('deposit');
              }}
              className="w-full max-w-[340px] bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-base py-3 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer mt-0.5"
            >
              Deposit Now
            </button>

            {/* Bonus Card Section */}
            <div className="w-full max-w-[340px] mt-3 flex flex-col items-center gap-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Up to <span className="text-[#22c55e] font-extrabold">10,000 USDT</span> Bonus for New Users
              </h3>
              
              <p className="text-xs text-[#8e8e93] font-medium">
                Sign up now for limited-time rewards
              </p>

              {/* Countdown Timer Blocks (06D : 23H : 58M : 23S) */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="bg-[#141822] border border-[#232b38] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-inner">
                  {String(countdown.days).padStart(2, '0')}D
                </div>
                <span className="text-[#8e8e93] font-bold">:</span>
                <div className="bg-[#141822] border border-[#232b38] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-inner">
                  {String(countdown.hours).padStart(2, '0')}H
                </div>
                <span className="text-[#8e8e93] font-bold">:</span>
                <div className="bg-[#141822] border border-[#232b38] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-inner">
                  {String(countdown.minutes).padStart(2, '0')}M
                </div>
                <span className="text-[#8e8e93] font-bold">:</span>
                <div className="bg-[#141822] border border-[#232b38] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-inner">
                  {String(countdown.seconds).padStart(2, '0')}S
                </div>
              </div>

              <span className="text-sm font-semibold text-gray-200 mt-2 tracking-wide">
                event recive
              </span>
            </div>

            {/* How to Deposit Section (Plain Text - No Box Cards) */}
            <div className="w-full max-w-[340px] text-left mt-4 pt-2 border-t border-[#1a202c]/60">
              <h4 className="text-sm font-bold text-white mb-3">
                How to Deposit
              </h4>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">1.</span>
                  <div>
                    <p className="font-semibold text-white">Tap "Deposit Now"</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Click the lime Deposit button above to open deposit options.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">2.</span>
                  <div>
                    <p className="font-semibold text-white">Select Asset & Network</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Choose cryptocurrency (USDT, BTC, ETH) and matching network.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">3.</span>
                  <div>
                    <p className="font-semibold text-white">Copy Address & Send</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Scan QR code or copy deposit address to complete your transfer.</p>
                  </div>
                </div>
              </div>

              {/* Plain Text Video Tutorial Link */}
              <div className="mt-3 pt-1 text-xs text-left">
                <span className="text-[#8e8e93]">Watch tutorial: </span>
                <a
                  href="https://www.youtube.com/results?search_query=how+to+deposit+crypto+exchange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#aeff00] font-extrabold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>video click here</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <>
          {/* ---------------- 1. TOP HEADER NAVIGATION BAR (Image 2) ---------------- */}
          <div className="sticky top-0 z-30 bg-[#000000] px-4 py-3 flex items-center justify-between border-b border-[#141822]">
            
            {/* Navigation Tabs: Overview, Spot, Futures */}
            <div className="flex items-center gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
              {['Overview', 'Spot', 'Futures'].map((tab) => {
                const isActive = topTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setTopTab(tab);
                    }}
                    className={`relative py-1 transition-all whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'text-white font-extrabold text-base border-b-2 border-[#38bdf8] pb-0.5' 
                        : 'text-[#8e8e93] hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Far Right Hamburger Menu Icon ≡ */}
            <button 
              onClick={() => setActiveModal('menu')}
              className="text-white hover:text-gray-300 p-1 transition-colors flex-shrink-0"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

          </div>

      {/* ---------------- 2. TOTAL VALUE & SPARKLINE SECTION (Image 2) ---------------- */}
      <div className="p-4 flex flex-col gap-1">
        
        {/* Total Value header row with Eye icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#8e8e93]">
            <span>
              {topTab === 'Overview' ? 'Total Value' : topTab === 'Spot' ? 'Spot Total Value' : 'Futures Account Value'}
            </span>
            <button 
              onClick={() => setHideBalance(!hideBalance)}
              className="text-[#8e8e93] hover:text-white transition-colors"
            >
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {topTab === 'Spot' && (
            <span className="text-[10px] bg-[#38bdf8]/10 text-[#38bdf8] font-bold px-2.5 py-0.5 rounded-full border border-[#38bdf8]/20">
              Spot Account
            </span>
          )}
          {topTab === 'Futures' && (
            <span className="text-[10px] bg-[#22c55e]/10 text-[#22c55e] font-bold px-2.5 py-0.5 rounded-full border border-[#22c55e]/20">
              Futures 100x
            </span>
          )}
        </div>

        {/* Big Balance Amount & Blue Wave Sparkline Chart Row */}
        <div className="flex items-center justify-between mt-1">
          {/* Main Amount */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              {hideBalance 
                ? "••••" 
                : topTab === 'Overview' 
                  ? (userTotalUsdt > 0 ? userTotalUsdt.toFixed(2) : selectedCurrency.displayVal)
                  : topTab === 'Spot'
                    ? userSpotUsdt.toFixed(2)
                    : userFuturesUsdt.toFixed(2)
              }
            </span>
            
            {/* Clickable Currency Selector Text */}
            <button 
              onClick={() => setActiveModal(activeModal === 'currency' ? null : 'currency')}
              className="flex items-center gap-1 text-sm sm:text-base font-extrabold text-white hover:text-gray-200 cursor-pointer transition-colors"
              title="Click to select currency"
            >
              <span>{selectedCurrency.code}</span>
              <svg className="w-3 h-3 text-white fill-current ml-0.5 inline-block" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4H2z" />
              </svg>
            </button>
          </div>

          {/* Blue/Green Wave Sparkline Chart */}
          <div className="w-24 h-9">
            <svg className="w-full h-full text-[#38bdf8]" viewBox="0 0 100 35" preserveAspectRatio="none">
              <path
                d="M 0,20 Q 20,5 35,15 T 65,22 T 85,8 T 100,12"
                fill="none"
                stroke={topTab === 'Futures' ? '#22c55e' : '#38bdf8'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Sub-balance */}
        <button 
          onClick={() => setActiveModal('currency')}
          className="flex items-center gap-1 text-xs text-[#8e8e93] font-medium hover:text-white transition-colors cursor-pointer w-fit"
          title="Click to select currency"
        >
          <span>
            {hideBalance 
              ? "≈ •••• BTC" 
              : topTab === 'Overview'
                ? selectedCurrency.subVal
                : topTab === 'Spot'
                  ? `≈ ${userSpotUsdt.toFixed(2)} USD`
                  : `Unrealized PnL: 0.00 USDT`
            }
          </span>
          <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
        </button>

      </div>

      {/* ---------------- 3. ACTION CAPSULE BUTTONS ROW (Image 2) ---------------- */}
      <div className="px-4 my-3 grid grid-cols-4 gap-2.5">
        {topTab === 'Futures' ? (
          <>
            <button
              onClick={() => {
                setTransferFrom('Spot');
                setTransferTo('Futures');
                setActiveModal('transfer');
              }}
              className="bg-[#38bdf8] hover:bg-[#0284c7] text-black font-extrabold text-xs py-2.5 rounded-full transition-transform active:scale-95 shadow-sm text-center cursor-pointer"
            >
              Transfer
            </button>

            <button
              onClick={() => setActiveModal('deposit')}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Deposit
            </button>

            <button
              onClick={() => router.push('/futures')}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Trade</span>
              <span className="text-[10px]">↗</span>
            </button>

            <button
              onClick={() => router.push('/convert')}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Convert
            </button>
          </>
        ) : topTab === 'Spot' ? (
          <>
            <button
              onClick={() => setActiveModal('deposit')}
              className="bg-white hover:bg-gray-100 text-black font-extrabold text-xs py-2.5 rounded-full transition-transform active:scale-95 shadow-sm text-center cursor-pointer"
            >
              Deposit
            </button>

            <button
              onClick={() => setActiveModal('withdrawSelectCoin')}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Withdraw
            </button>

            <button
              onClick={() => {
                setTransferFrom('Spot');
                setTransferTo('Futures');
                setActiveModal('transfer');
              }}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Transfer
            </button>

            <button
              onClick={() => router.push('/trade')}
              className="bg-[#38bdf8] hover:bg-[#0284c7] text-black font-extrabold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Trade
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveModal('deposit')}
              className="bg-white hover:bg-gray-100 text-black font-extrabold text-xs py-2.5 rounded-full transition-transform active:scale-95 shadow-sm text-center cursor-pointer"
            >
              Deposit
            </button>

            <button
              onClick={() => setActiveModal('withdrawSelectCoin')}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Withdraw
            </button>

            <button
              onClick={() => {
                setTransferFrom('Spot');
                setTransferTo('Futures');
                setActiveModal('transfer');
              }}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Transfer
            </button>

            <button
              onClick={() => router.push('/convert')}
              className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs py-2.5 rounded-full transition-transform active:scale-95 text-center cursor-pointer"
            >
              Convert
            </button>
          </>
        )}
      </div>

      {/* ---------------- 4. SECTION SPECIFIC CONTENT ---------------- */}
      {topTab === 'Futures' ? (
        /* FUTURES SECTION VIEW */
        <div className="px-4 pb-24 flex flex-col gap-4 mt-2">
          {/* Futures Account Breakdown Card */}
          <div className="bg-[#121620] border border-[#232b38] rounded-2xl p-4 flex flex-col gap-3.5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1e2533] pb-2.5">
              <span className="text-xs font-bold text-[#22c55e] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                USDT-M Futures Account
              </span>
              <span className="text-[11px] text-[#8e8e93]">Max 100x Leverage</span>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div className="flex flex-col">
                <span className="text-[#8e8e93] text-[11px] font-medium block mb-1">Wallet Balance</span>
                <span className="font-extrabold text-white text-base tracking-wide">
                  {hideBalance ? "••••" : `$${userFuturesUsdt.toFixed(2)}`}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#8e8e93] text-[11px] font-medium block mb-1">Available Margin</span>
                <span className="font-extrabold text-white text-base tracking-wide">
                  {hideBalance ? "••••" : `$${userFuturesUsdt.toFixed(2)}`}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#8e8e93] text-[11px] font-medium block mb-1">Position Margin</span>
                <span className="font-extrabold text-white text-base tracking-wide">$0.00</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#8e8e93] text-[11px] font-medium block mb-1">Unrealized P&L</span>
                <span className="font-extrabold text-white text-base tracking-wide">0.00 USDT</span>
              </div>
            </div>
          </div>

          {/* Futures Assets / Contracts list */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#8e8e93] px-1">Futures Assets</span>

            <div className="bg-[#121620]/80 border border-[#1e2533] p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CoinLogo symbol="USDT" size="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-white">USDT Futures Margin</span>
                  <span className="text-[11px] text-[#8e8e93]">Tether Perpetual</span>
                </div>
              </div>

              <div className="flex flex-col items-end font-mono">
                <span className="font-bold text-xs text-white">
                  {hideBalance ? "••••" : `${userFuturesUsdt.toFixed(2)} USDT`}
                </span>
                <span className="text-[11px] text-[#38bdf8]">
                  {hideBalance ? "••••" : `Avail: ${userFuturesUsdt.toFixed(2)} USDT`}
                </span>
              </div>
            </div>

            <div className="bg-[#121620]/80 border border-[#1e2533] p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CoinLogo symbol="BTC" size="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-white">BTCUSDT Perpetual</span>
                  <span className="text-[11px] text-[#8e8e93]">Contract Positions</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">0 Positions</span>
                <button
                  onClick={() => router.push('/futures')}
                  className="text-xs font-bold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full hover:bg-[#22c55e]/20"
                >
                  Trade
                </button>
              </div>
            </div>
          </div>

          {/* How Futures Works Guide */}
          <div className="w-full text-left mt-2 pt-4 pb-8 border-t border-[#141822]">
            <h4 className="text-sm font-bold text-white mb-3">How Futures Trading Works</h4>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-[#22c55e] font-extrabold text-xs mt-0.5">1.</span>
                <div>
                  <p className="font-semibold text-white">Transfer Funds to Futures</p>
                  <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Move USDT from your Spot Account to Futures Account with 0 fees.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#22c55e] font-extrabold text-xs mt-0.5">2.</span>
                <div>
                  <p className="font-semibold text-white">Select Leverage & Direction</p>
                  <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Choose up to 100x leverage and select Long (Buy) or Short (Sell).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#22c55e] font-extrabold text-xs mt-0.5">3.</span>
                <div>
                  <p className="font-semibold text-white">Manage & Close Positions</p>
                  <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Set Take Profit / Stop Loss orders and close position to lock in profit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OVERVIEW & SPOT SECTIONS VIEW */
        <div className="px-4 mt-1 flex flex-col gap-2">
          {/* Filter & Search & History Header Line */}
          <div className="flex items-center justify-between border-b border-[#141822] pb-2 gap-2">
            {/* History Option */}
            <button 
              onClick={() => router.push('/history')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8e8e93] hover:text-white transition-colors cursor-pointer group py-1 shrink-0"
              title="Real-time Transaction History"
            >
              <History className="w-4 h-4 text-[#8e8e93] group-hover:text-[#38bdf8] transition-colors" />
              <span className="group-hover:text-white">History</span>
            </button>

            {/* Real-time History Banner Box */}
            <div 
              onClick={() => router.push('/history')}
              className="flex-1 bg-[#18191d] hover:bg-[#22242a] border border-white/5 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all shadow-md overflow-hidden"
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  latestHistoryStatus === 'Pending' ? 'bg-amber-400 animate-ping' :
                  latestHistoryStatus === 'Rejected' ? 'bg-red-500' : 'bg-[#0ecb81]'
                }`}></span>
                <span className="text-xs sm:text-sm font-medium text-[#8e8e93] truncate">
                  {latestHistoryText || 'you have recive 0.5$'}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-xs sm:text-sm font-medium ${
                  latestHistoryStatus === 'Pending' ? 'text-amber-400' :
                  latestHistoryStatus === 'Rejected' ? 'text-red-400' : 'text-[#0ecb81]'
                }`}>
                  {latestHistoryStatus || 'Completed'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#0ecb81]" />
              </div>
            </div>

            {/* Search Icon */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-[#8e8e93] hover:text-white p-1 transition-colors shrink-0"
              title="Search assets"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Expandable Search Input Bar */}
          {showSearch && (
            <div className="mt-1">
              <input
                type="text"
                placeholder="Search coin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121620] border border-[#1e2533] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>
          )}

          {/* Checkbox Line: [ ] Hide small balances */}
          <div className="flex items-center gap-2 pt-1 pb-2">
            <input
              type="checkbox"
              id="hideSmall"
              checked={hideSmallBalances}
              onChange={(e) => setHideSmallBalances(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#38bdf8] bg-[#121620] border-[#2b3548] rounded cursor-pointer"
            />
            <label htmlFor="hideSmall" className="text-xs text-[#8e8e93] cursor-pointer select-none hover:text-gray-300">
              Hide small balances
            </label>
          </div>

          {/* ASSET ITEMS BALANCES LIST */}
          <div className="pb-24 flex flex-col gap-1">
            {filteredBalances.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8e8e93]">No assets found</div>
            ) : (
              filteredBalances.map((item) => {
                // If in Spot tab, USDT item displays userSpotUsdt
                const isUsdt = item.symbol === 'USDT';
                const displayAmt = topTab === 'Spot' && isUsdt ? userSpotUsdt.toFixed(2) : item.amount;
                const displayUsdStr = topTab === 'Spot' && isUsdt ? `${userSpotUsdt.toFixed(2)} USD` : item.usdValStr;

                return (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between py-3 hover:bg-[#121620]/60 px-1 rounded-xl transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedAsset({
                        ...item,
                        amount: displayAmt,
                        usdValStr: displayUsdStr
                      });
                      setActiveModal('assetDetail');
                    }}
                  >
                    {/* Left: Coin Icon + Symbol */}
                    <div className="flex items-center gap-3">
                      <CoinLogo symbol={item.symbol} size="w-9 h-9" />

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-100 tracking-wide">
                          {item.symbol}
                        </span>
                        {topTab === 'Overview' && isUsdt && userFuturesUsdt > 0 && (
                          <span className="text-[10px] text-[#38bdf8] font-medium leading-none mt-0.5">
                            Spot + Futures
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Balance Info + Dark Pill Trade Button */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-end gap-0.5 text-right font-mono">
                        <span className="font-semibold text-xs text-white leading-none">
                          {hideBalance ? "••••" : displayAmt}
                        </span>
                        <span className="text-[11px] text-[#8e8e93] leading-none">
                          {hideBalance ? "≈ •••• USD" : `≈ ${displayUsdStr}`}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTradeClick(item);
                        }}
                        className="bg-[#1c2029] hover:bg-[#282f3d] text-white font-semibold text-xs px-4 py-1.5 rounded-full transition-colors active:scale-95 border border-transparent hover:border-[#2b3548]"
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* How to Deposit Section */}
            <div className="w-full text-left mt-6 pt-4 pb-8 border-t border-[#141822]">
              <h4 className="text-sm font-bold text-white mb-3">
                How to Deposit
              </h4>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">1.</span>
                  <div>
                    <p className="font-semibold text-white">Tap "Deposit"</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Click the Deposit button above or select a coin to open deposit details.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">2.</span>
                  <div>
                    <p className="font-semibold text-white">Select Asset & Network</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Choose cryptocurrency (USDT, BTC, ETH) and matching network (TRC20, BEP20).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#aeff00] font-extrabold text-xs mt-0.5">3.</span>
                  <div>
                    <p className="font-semibold text-white">Copy Address & Send</p>
                    <p className="text-[11px] text-[#8e8e93] mt-0.5 leading-relaxed">Scan QR code or copy deposit address to complete your transfer.</p>
                  </div>
                </div>
              </div>

              {/* Plain Text Video Tutorial Link */}
              <div className="mt-3 pt-2 text-xs text-left">
                <span className="text-[#8e8e93]">Watch tutorial: </span>
                <a
                  href="https://www.youtube.com/results?search_query=how+to+deposit+crypto+exchange"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#aeff00] font-extrabold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>video click here</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* ---------------- 6. INTERACTIVE ACTION MODALS / BOTTOM SHEETS ---------------- */}

      {/* CURRENCY SELECTOR DROPDOWN MODAL (Matching User Image) */}
      {activeModal === 'currency' && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          {/* Backdrop Click Handler */}
          <div 
            className="absolute inset-0" 
            onClick={() => setActiveModal(null)} 
          />

          {/* Floating Dropdown Card matching image style */}
          <div className="relative z-10 w-full max-w-[240px] bg-[#2d2d2d] border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col gap-0.5">
            {CURRENCIES.map((curr) => {
              const isSelected = selectedCurrency.code === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr);
                    setActiveModal(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                    isSelected 
                      ? 'text-white font-bold bg-[#38383c]/50' 
                      : 'text-[#9c9c9c] font-medium hover:text-white hover:bg-[#38383c]/40'
                  }`}
                >
                  <span className="text-base font-sans tracking-wide">{curr.code}</span>
                  {isSelected && (
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- STEP 1 MODAL (Image 1): Select Payment Method ---------------- */}
      {activeModal === 'deposit' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in duration-200">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
          
          <div className="relative z-10 w-full max-w-[430px] bg-[#121212] border-t border-white/10 rounded-t-3xl p-5 flex flex-col gap-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Top Handle bar */}
            <div className="w-10 h-1 bg-[#333333] rounded-full mx-auto -mt-1 mb-1"></div>

            {/* Header Row */}
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-extrabold text-lg text-white">Select Payment Method</h3>
            </div>

            {/* Options List (No Card Boxes - Exact Matching Image 2) */}
            <div className="flex flex-col gap-3 mt-1">
              {/* Deposit Crypto */}
              <button
                onClick={() => setActiveModal('depositSelectCoin')}
                className="w-full py-3 px-1 flex items-start justify-between group hover:bg-[#1a1a1a] rounded-xl transition-all text-left"
              >
                <div className="flex items-start gap-3.5">
                  {/* Left Icon: Wallet with Arrow */}
                  <div className="w-7 h-7 mt-0.5 text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                      <rect x="2" y="6" width="18" height="13" rx="2.5" />
                      <path d="M16 12.5h.01" strokeWidth="3" />
                      <path d="M12 12.5H7" strokeLinecap="round" />
                      <path d="M9 10l-2.5 2.5L9 15" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">Deposit Crypto</span>
                      <span className="text-[10px] font-semibold text-[#f5a623] bg-[#422e13] px-2 py-0.5 rounded-md">
                        Recently Used
                      </span>
                    </div>
                    <p className="text-xs text-[#808080] mt-1 leading-relaxed pr-2">
                      Transfer crypto from your on-chain wallet or another exchange.
                    </p>
                  </div>
                </div>

                <span className="text-white text-base font-light mt-1 text-[#808080] group-hover:text-white transition-colors">
                  →
                </span>
              </button>

              {/* P2P Trading */}
              <button
                onClick={() => {
                  setActiveModal(null);
                  router.push('/trade');
                }}
                className="w-full py-3 px-1 flex items-start justify-between group hover:bg-[#1a1a1a] rounded-xl transition-all text-left"
              >
                <div className="flex items-start gap-3.5">
                  {/* Left Icon: P2P Circle Logo */}
                  <div className="w-7 h-7 mt-0.5 text-white flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center font-bold text-[8px] tracking-tight">
                      P2P
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-base text-white block">P2P Trading</span>
                    <p className="text-xs text-[#808080] mt-1">More Choices, Better Prices</p>
                  </div>
                </div>

                <span className="text-white text-base font-light mt-1 text-[#808080] group-hover:text-white transition-colors">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STEP 2 MODAL (Image 2): Select Coin ---------------- */}
      {activeModal === 'depositSelectCoin' && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black sm:bg-black/90 animate-in fade-in duration-200">
          {/* Phone Page Container (Pure Black Background) */}
          <div className="w-full max-w-[430px] h-full bg-black text-white flex flex-col relative overflow-hidden">
            {/* Top Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c1c1e]">
              <button 
                onClick={() => setActiveModal('deposit')}
                className="p-1 text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-base text-white">Select Coin</h2>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 no-scrollbar">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search"
                  value={coinSearchQuery}
                  onChange={(e) => setCoinSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#2c2c2e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#38bdf8]"
                />
              </div>

              {/* Info Card */}
              <div className="bg-[#1c1c1e] border border-[#2c2c2e] p-3 rounded-xl flex items-center justify-between text-xs text-[#8e8e93]">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#38bdf8]" />
                  <span>How to Deposit?</span>
                </div>
                <button className="text-white font-semibold flex items-center gap-1 hover:text-[#38bdf8]">
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Recommend Section */}
              <div>
                <h3 className="text-xs font-bold text-[#8e8e93] mb-2.5">Recommend</h3>
                <div className="flex flex-wrap gap-2">
                  {['USDT', 'BNB', 'TON', 'TRX'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => {
                        setSelectedDepositCoin(symbol);
                        setActiveModal('depositSelectChain');
                      }}
                      className="bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-gray-200 font-bold text-xs px-3.5 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span>{symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coins List with Real Logos */}
              <div className="mt-2 flex flex-col gap-4">
                {/* Popular & Available Coins Section */}
                <div>
                  <div className="bg-[#1c1c1e] px-3 py-1.5 text-xs font-bold text-[#25c26e] rounded-lg mb-2 flex items-center justify-between">
                    <span>Popular & Available Coins</span>
                    <span className="text-[10px] bg-[#25c26e]/10 text-[#25c26e] px-2 py-0.5 rounded-full border border-[#25c26e]/20 font-medium">Active</span>
                  </div>

                  <div className="flex flex-col">
                    {[
                      { name: 'USDT', symbol: 'USDT', fullName: 'Tether USD' },
                      { name: 'BNB', symbol: 'BNB', fullName: 'BNB Token' },
                      { name: 'TON', symbol: 'TON', fullName: 'Toncoin' },
                      { name: 'TRX', symbol: 'TRX', fullName: 'TRON' }
                    ]
                      .filter(c => c.name.toLowerCase().includes(coinSearchQuery.toLowerCase()) || c.fullName.toLowerCase().includes(coinSearchQuery.toLowerCase()))
                      .map((coin) => (
                        <button
                          key={coin.name}
                          onClick={() => {
                            setSelectedDepositCoin(coin.name);
                            setActiveModal('depositSelectChain');
                          }}
                          className="flex items-center gap-3 py-3 px-2 border-b border-[#1c1c1e] hover:bg-[#1c1c1e] rounded-xl transition-colors text-left"
                        >
                          {/* Real Crypto Logo */}
                          <CoinLogo symbol={coin.symbol} size="w-7 h-7" />

                          <div className="flex flex-col flex-1">
                            <span className="font-bold text-xs text-white">{coin.name}</span>
                            <span className="text-[11px] text-[#8e8e93]">{coin.fullName}</span>
                          </div>

                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STEP 3 MODAL (Image 3): Choose a Chain Type ---------------- */}
      {activeModal === 'depositSelectChain' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal('depositSelectCoin')} />

          <div className="relative z-10 w-full max-w-[430px] max-h-[85vh] bg-[#121212] border-t border-white/10 rounded-t-3xl p-5 flex flex-col gap-4 text-white shadow-2xl overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1e]">
              <h3 className="font-extrabold text-base text-white">Choose a Chain Type</h3>
              <button onClick={() => setActiveModal('depositSelectCoin')}>
                <X className="w-5 h-5 text-[#8e8e93] hover:text-white" />
              </button>
            </div>

            {/* Warning Box */}
            <div className="bg-[#1a1a1a] border border-[#2c2c2e] p-3 rounded-xl flex items-start gap-2.5 text-xs text-gray-300">
              <Info className="w-4 h-4 text-[#fcd535] flex-shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px] text-[#a0a6b5]">
                Make sure that the chain type you make deposits to is the one you make withdrawals from.
              </p>
            </div>

            {/* Chain Options List (Filtered specifically per coin) */}
            <div className="flex flex-col gap-1">
              {(() => {
                const BEP20_ADDRESS_POOL = [
                  '0x0e09828668d149aCE965599573561215C5aa2a44',
                  '0xfA9555256758E066593F58196a4020576a5ED30e',
                  '0xc4072bc1Cb1C90872Efc7872F632C96B0222E753',
                  '0xbCF51704f62760d981D30EfA28Dca025eE5Af012'
                ];

                const getOrAssignBep20Address = () => {
                  if (typeof window !== 'undefined') {
                    let saved = localStorage.getItem('user_bep20_address');
                    if (saved && BEP20_ADDRESS_POOL.includes(saved)) {
                      return saved;
                    }
                    const randomIndex = Math.floor(Math.random() * BEP20_ADDRESS_POOL.length);
                    const chosen = BEP20_ADDRESS_POOL[randomIndex];
                    localStorage.setItem('user_bep20_address', chosen);
                    return chosen;
                  }
                  return BEP20_ADDRESS_POOL[0];
                };

                const coin = (selectedDepositCoin || 'USDT').toUpperCase();
                const randomBep20Addr = getOrAssignBep20Address();
                let chains = [];

                if (coin === 'USDT') {
                  chains = [
                    {
                      id: 'bsc',
                      name: 'BSC (BEP20)',
                      symbol: 'bnb',
                      badge: 'Recommended',
                      confirmations: '15 confirmation(s)',
                      minAmount: '10 USDT',
                      address: randomBep20Addr
                    }
                  ];
                } else if (coin === 'BNB') {
                  chains = [
                    {
                      id: 'bsc',
                      name: 'BSC (BEP20)',
                      symbol: 'bnb',
                      badge: 'Recommended',
                      confirmations: '15 confirmation(s)',
                      minAmount: '0.0175 BNB (≈$10 USD)',
                      address: '0x0e09828668d149aCE965599573561215C5aa2a44'
                    }
                  ];
                } else if (coin === 'TON') {
                  chains = [
                    {
                      id: 'ton',
                      name: 'TON (The Open Network)',
                      symbol: 'ton',
                      badge: 'Recommended',
                      confirmations: '1 confirmation(s)',
                      minAmount: '1.5 TON (≈$10 USD)',
                      address: 'UQBCDG1F9pjY1Yf4zgp-sW06kgpHqYhChDjFadmdI8RNWNe6'
                    }
                  ];
                } else if (coin === 'TRX') {
                  chains = [
                    {
                      id: 'trc20',
                      name: 'TRON (TRC20)',
                      symbol: 'trx',
                      badge: 'Recommended',
                      confirmations: '20 confirmation(s)',
                      minAmount: '75 TRX (≈$10 USD)',
                      address: 'TTQUrnM97rGt9Ciu3ncVpaRg1iiErVJRoy'
                    }
                  ];
                } else {
                  chains = [
                    {
                      id: 'bsc',
                      name: 'BSC (BEP20)',
                      symbol: 'bnb',
                      badge: 'Recommended',
                      confirmations: '15 confirmation(s)',
                      minAmount: `10 USDT (≈$10 USD)`,
                      address: '0x0e09828668d149aCE965599573561215C5aa2a44'
                    }
                  ];
                }

                return chains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => {
                      setSelectedDepositChain(chain);
                      setActiveModal('depositAddress');
                    }}
                    className="w-full py-3 px-1 border-b border-[#1c1c1e] hover:bg-[#1a1a1a] rounded-xl flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Real Chain Network Logo */}
                      <CoinLogo symbol={chain.symbol} size="w-8 h-8" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{chain.name}</span>
                          {chain.badge && (
                            <span className="text-[9px] font-semibold text-[#f5a623] bg-[#422e13] px-2 py-0.5 rounded-md">
                              {chain.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#808080] mt-0.5">
                          Deposit Completion: {chain.confirmations}
                        </p>
                        <p className="text-[10px] text-[#808080]">
                          Min. Deposit Amount: {chain.minAmount}
                        </p>
                      </div>
                    </div>
                    <span className="text-[#808080] group-hover:text-white transition-colors text-base font-light">
                      →
                    </span>
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- STEP 4 MODAL (Image 4): USDT-Deposit Address Screen ---------------- */}
      {activeModal === 'depositAddress' && (
        <div className="fixed inset-0 z-50 flex justify-center bg-[#0a0c10] sm:bg-black/80 animate-in fade-in duration-200">
          {/* Phone Page Container (Site phone size, no box card border) */}
          <div className="w-full max-w-[430px] h-full bg-[#0a0c10] text-white flex flex-col relative overflow-hidden">
            {/* Top Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c2230] w-full">
              <button 
                onClick={() => setActiveModal('depositSelectChain')}
                className="p-1 text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#26a17b] flex items-center justify-center text-[10px] font-bold">
                  ₮
                </div>
                <h2 className="font-extrabold text-base text-white">
                  {selectedDepositCoin || 'USDT'}-Deposit
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center gap-4 no-scrollbar pb-28 w-full">
              {/* Network Selector Pill */}
              <button
                onClick={() => setActiveModal('depositSelectChain')}
                className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold bg-[#161c28] border border-[#232c3d] px-3.5 py-1.5 rounded-full hover:border-gray-400 transition-colors"
              >
                <span className="text-[#8e8e93]">Network:</span>
                <span className="text-white font-bold">{selectedDepositChain?.name || 'BSC (BEP20)'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* QR Code Container */}
              <DepositQRCode coin={selectedDepositCoin || 'USDT'} address={selectedDepositChain?.address || '0x0e09828668d149aCE965599573561215C5aa2a44'} />

              {/* Wallet Address Card */}
              <div className="w-full bg-[#151a24] border border-[#212938] rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex flex-col gap-1 pr-2 overflow-hidden">
                  <span className="text-xs text-[#8e8e93] font-medium flex items-center gap-1">
                    Wallet Address <ChevronRight className="w-3 h-3 text-[#8e8e93]" />
                  </span>
                  <span className="font-mono text-xs text-white font-bold break-all leading-tight">
                    {selectedDepositChain?.address || '0xf595458791d696829817bcacc1b994d17e25ec72'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDepositChain?.address || '0xf595458791d696829817bcacc1b994d17e25ec72');
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 2000);
                  }}
                  className="p-2.5 rounded-xl bg-[#202738] hover:bg-[#2a344a] text-gray-300 hover:text-white transition-colors flex-shrink-0"
                  title="Copy Address"
                >
                  {copiedToast ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Details Table */}
              <div className="w-full flex flex-col gap-2.5 text-xs pt-1">
                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="flex items-center gap-1">
                    Minimum Deposit Amount <HelpCircle className="w-3 h-3 text-[#8e8e93]" />
                  </span>
                  <span className="font-bold text-white font-mono">{selectedDepositChain?.minAmount || '0.005 USDT'}</span>
                </div>

                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="flex items-center gap-1">
                    Route Deposits To <HelpCircle className="w-3 h-3 text-[#8e8e93]" />
                  </span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    Funding <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="flex items-center gap-1">
                    Deposit Arrival <HelpCircle className="w-3 h-3 text-[#8e8e93]" />
                  </span>
                  <span className="font-bold text-white font-mono">{selectedDepositChain?.confirmations || '60 confirmations'}</span>
                </div>

                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span className="flex items-center gap-1">
                    Withdrawal Unlocked <HelpCircle className="w-3 h-3 text-[#8e8e93]" />
                  </span>
                  <span className="font-bold text-white font-mono">{selectedDepositChain?.confirmations || '60 confirmations'}</span>
                </div>

                <div className="flex justify-between items-center text-[#8e8e93]">
                  <span>Contract Address:</span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    Ending with 3197955 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Disclaimers & Status links */}
              <div className="w-full flex flex-col gap-2 text-xs pt-2 border-t border-[#1c2230] text-[#8e8e93]">
                <p className="flex items-center gap-1">
                  <span>View all deposit and withdrawal statuses?</span>
                  <span className="text-[#fcd535] font-bold cursor-pointer hover:underline">Click here.</span>
                </p>

                <details className="group cursor-pointer">
                  <summary className="flex items-center justify-between text-[11px] py-1 text-gray-400 group-hover:text-white">
                    <span>In upholding the integrity and safety of our platform's tra...</span>
                    <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-[10px] text-gray-500 pt-1">
                    Please ensure you are depositing from a supported address and network.
                  </p>
                </details>

                <details className="group cursor-pointer">
                  <summary className="flex items-center justify-between text-[11px] py-1 text-gray-400 group-hover:text-white">
                    <span>Please make sure that only USDT deposit is made via thi...</span>
                    <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-[10px] text-gray-500 pt-1">
                    Sending any other currency may result in loss of funds.
                  </p>
                </details>

                <details className="group cursor-pointer">
                  <summary className="flex items-center justify-between text-[11px] py-1 text-gray-400 group-hover:text-white">
                    <span>Please make sure that your deposit address is corr...</span>
                    <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-[10px] text-gray-500 pt-1">
                    Double check the wallet address characters before initiating transfer.
                  </p>
                </details>
              </div>
            </div>

            {/* Bottom Fixed Action Buttons inside Phone Container */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#0a0c10]/95 backdrop-blur-md border-t border-[#1c2230] p-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCopiedToast(true);
                  setTimeout(() => setCopiedToast(false), 2000);
                }}
                className="flex-1 bg-[#1a202c] hover:bg-[#252e3f] text-white font-bold text-xs py-3 rounded-xl border border-[#2b3548] transition-all active:scale-95"
              >
                Save Picture
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedDepositChain?.address || '0xf595458791d696829817bcacc1b994d17e25ec72');
                  setCopiedToast(true);
                  setTimeout(() => setCopiedToast(false), 2000);
                }}
                className="flex-1 bg-[#fcd535] hover:bg-[#ebd02c] text-black font-extrabold text-xs py-3 rounded-xl transition-all active:scale-95 shadow-md"
              >
                {copiedToast ? "Copied!" : "Copy Address"}
              </button>
            </div>
          </div>

          {/* Copied Toast Floating Alert */}
          {copiedToast && (
            <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#25c26e] text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-2xl animate-in fade-in zoom-in duration-200">
              Wallet Address Copied!
            </div>
          )}
        </div>
      )}

      {/* ---------------- WITHDRAW FLOW SCREEN 1 (Image 1): Select Coin ---------------- */}
      {(activeModal === 'withdrawSelectCoin' || activeModal === 'withdrawMethod') && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black sm:bg-black/90 animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] h-full bg-black text-white flex flex-col relative overflow-hidden">
            {/* Top Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c1c1e]">
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-base text-white">Select Coin</h2>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 no-scrollbar relative">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search"
                  value={withdrawSearchQuery}
                  onChange={(e) => setWithdrawSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#2c2c2e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#38bdf8]"
                />
              </div>

              {/* Hide zero balances checkbox */}
              <label className="flex items-center gap-2 text-xs text-[#8e8e93] cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={withdrawHideZeroBalances}
                  onChange={(e) => setWithdrawHideZeroBalances(e.target.checked)}
                  className="rounded bg-[#1c1c1e] border-[#2c2c2e] text-[#38bdf8] focus:ring-0 w-3.5 h-3.5"
                />
                <span>Hide zero balances</span>
              </label>

              {/* Alphabetical Sidebar Index */}
              <div className="absolute right-1 top-28 bottom-4 flex flex-col justify-between text-[9px] font-bold text-gray-500 select-none z-10">
                {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'].map((letter) => (
                  <span key={letter} className="hover:text-white cursor-pointer px-1">{letter}</span>
                ))}
              </div>

              {/* Coin Groups List */}
              <div className="flex flex-col gap-3 pr-4 mt-1">
                {/* Popular Coins Group Header */}
                <div className="bg-[#121316] px-3 py-1 text-[11px] font-bold text-[#8e8e93] rounded-md flex items-center justify-between">
                  <span>Popular Coins</span>
                  <span className="text-[10px] bg-[#38bdf8]/10 text-[#38bdf8] px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>

                <div className="flex flex-col">
                  {[...balancesList]
                    .sort((a, b) => (b.usdValNum || 0) - (a.usdValNum || 0))
                    .filter(c => {
                      const matches = c.symbol.toLowerCase().includes(withdrawSearchQuery.toLowerCase()) ||
                                      c.name.toLowerCase().includes(withdrawSearchQuery.toLowerCase());
                      if (withdrawHideZeroBalances) {
                        return matches && (c.usdValNum || 0) > 0;
                      }
                      return matches;
                    })
                    .map((coin) => {
                      const isPositive = (coin.usdValNum || 0) > 0;
                      return (
                        <button
                          key={coin.symbol}
                          onClick={() => {
                            setSelectedWithdrawCoin(coin.symbol);
                            setActiveModal('withdrawMethod');
                          }}
                          className={`flex items-center justify-between py-3 px-2 border-b border-[#1c1c1e] hover:bg-[#16171a] rounded-xl transition-colors text-left ${
                            isPositive ? 'bg-[#181a20]/60' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CoinLogo key={coin.symbol} symbol={coin.symbol} size="w-7 h-7" />
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span>{coin.symbol}</span>
                                {isPositive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" title="Has Balance" />
                                )}
                              </span>
                              <span className="text-[11px] text-[#8e8e93]">{coin.name}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end font-mono">
                            <span className={`font-bold text-xs ${isPositive ? 'text-white' : 'text-gray-400'}`}>
                              {coin.amount} {coin.symbol}
                            </span>
                            <span className={`text-[11px] ${isPositive ? 'text-[#fcd535] font-semibold' : 'text-[#8e8e93]'}`}>
                              ≈ ${coin.usdValNum ? coin.usdValNum.toFixed(2) : '0.00'} USD
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* ---------------- WITHDRAW FLOW SCREEN 2 (Image 2): Withdraw Method Bottom Sheet ---------------- */}
            {activeModal === 'withdrawMethod' && (
              <div className="absolute inset-0 z-40 bg-black/70 flex items-end justify-center animate-in fade-in duration-200">
                <div 
                  className="absolute inset-0" 
                  onClick={() => setActiveModal('withdrawSelectCoin')} 
                />
                
                <div className="relative z-10 w-full bg-[#141518] border-t border-[#24262b] rounded-t-3xl p-5 flex flex-col gap-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-1">
                    <h3 className="font-extrabold text-lg text-white">Withdraw</h3>
                    <button onClick={() => setActiveModal('withdrawSelectCoin')}>
                      <X className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 pb-2">
                    {/* On-Chain Option */}
                    <button
                      onClick={() => setActiveModal('withdrawOnChain')}
                      className="w-full bg-[#1e2026] hover:bg-[#282a32] border border-[#2b2d38] p-4 rounded-2xl flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-white">On-Chain</span>
                        <span className="text-xs text-gray-400">Withdrawal to an on-chain address</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>

                    {/* Internal Transfer Option */}
                    <button
                      onClick={() => setActiveModal('transfer')}
                      className="w-full bg-[#1e2026] hover:bg-[#282a32] border border-[#2b2d38] p-4 rounded-2xl flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-white">Internal Transfer</span>
                        <span className="text-xs text-gray-400">Withdraw via Bybit UID/email/mobile — 0 fee</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- WITHDRAW FLOW SCREEN 3 (Image 3): {COIN}-On-Chain Form ---------------- */}
      {activeModal === 'withdrawOnChain' && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black sm:bg-black/90 animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] h-full bg-black text-white flex flex-col relative overflow-hidden">
            {/* Top Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c1c1e]">
              <button 
                onClick={() => setActiveModal('withdrawMethod')}
                className="p-1 text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-base text-white">
                {selectedWithdrawCoin || 'USDT'}-On-Chain
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5 no-scrollbar pb-28">
              {/* Field 1: Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Address</label>
                <div className="relative bg-[#141518] border border-[#24262b] rounded-xl flex items-center px-3.5 py-3">
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Input or press and hold to paste the withdrawal address"
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none pr-14"
                  />
                  <div className="absolute right-3 flex items-center gap-2 text-gray-400">
                    <button title="Address Book" className="hover:text-white">
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button title="Scan QR Code" className="hover:text-white">
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Field 2: Network */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Network</label>
                <button
                  onClick={() => setShowWithdrawChainModal(true)}
                  className="w-full bg-[#141518] border border-[#24262b] rounded-xl px-3.5 py-3 flex items-center justify-between text-xs transition-colors hover:border-gray-500"
                >
                  <span className={selectedWithdrawChain ? "text-white font-bold" : "text-gray-500"}>
                    {selectedWithdrawChain?.name || "Please choose a chain type"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Field 3: Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Amount</label>
                <div className="bg-[#141518] border border-[#24262b] rounded-xl px-3.5 py-3 flex items-center justify-between text-xs">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={selectedWithdrawChain ? `Min. Withdrawal: ${selectedWithdrawChain.minAmount}` : "Min. Withdrawal Amount:"}
                    className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <span className="font-bold text-xs text-white ml-2">
                    {selectedWithdrawCoin || 'USDT'}
                  </span>
                </div>

                {/* Account selection collapsible line */}
                <div className="mt-2.5 flex flex-col gap-2 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setShowAccountOptions(!showAccountOptions)}
                      className="flex items-center gap-1 font-medium hover:text-white"
                    >
                      <span>Select account ({(withdrawAccounts.funding ? 1 : 0) + (withdrawAccounts.unified ? 1 : 0) + (withdrawAccounts.earn ? 1 : 0)})</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAccountOptions ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="font-mono text-white font-bold flex items-center gap-1">
                      {balancesList.find(b => b.symbol === selectedWithdrawCoin)?.amount || '0'} <Plus className="w-3 h-3 text-gray-400 cursor-pointer hover:text-white" />
                    </span>
                  </div>

                  {/* Checkbox Account list */}
                  {showAccountOptions && (
                    <div className="flex flex-col gap-2 pl-1 pt-1">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={withdrawAccounts.funding} 
                            onChange={(e) => setWithdrawAccounts({...withdrawAccounts, funding: e.target.checked})}
                            className="rounded bg-[#24262b] border-gray-600 text-[#f5a623] focus:ring-0" 
                          />
                          <span className="text-white text-xs">Funding</span>
                        </div>
                        <span className="font-mono text-xs text-white font-bold">{balancesList.find(b => b.symbol === selectedWithdrawCoin)?.amount || '0'}</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={withdrawAccounts.unified} 
                            onChange={(e) => setWithdrawAccounts({...withdrawAccounts, unified: e.target.checked})}
                            className="rounded bg-[#24262b] border-gray-600 text-[#f5a623] focus:ring-0" 
                          />
                          <span className="text-white text-xs">Unified Trading</span>
                        </div>
                        <span className="font-mono text-xs text-gray-400">0</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={withdrawAccounts.earn} 
                            onChange={(e) => setWithdrawAccounts({...withdrawAccounts, earn: e.target.checked})}
                            className="rounded bg-[#24262b] border-gray-600 text-[#f5a623] focus:ring-0" 
                          />
                          <span className="text-white text-xs">Flexible Easy Earn</span>
                        </div>
                        <span className="font-mono text-xs text-gray-400">0</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Note / Limits section */}
              <div className="mt-1 flex flex-col gap-1.5 text-xs border-t border-[#1c1c1e] pt-3">
                <span className="text-gray-400 font-semibold">Note:</span>
                <div className="flex items-center justify-between text-[#808080]">
                  <span>Daily Remaining Limit</span>
                  <span className="font-mono font-bold text-white">1,000,000/1,000,000 {selectedWithdrawCoin || 'USDT'}</span>
                </div>
                <button className="text-right text-[#f5a623] font-semibold text-[11px] hover:underline">
                  Manage Limit →
                </button>
                <button className="text-left text-[#f5a623] font-medium text-[11px] hover:underline mt-1">
                  Need help? Please visit our Help Center.
                </button>
              </div>
            </div>

            {/* Bottom Fixed Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#0d0e10] border-t border-[#1e2026] px-4 py-3 flex items-center justify-between z-20">
              <div className="flex flex-col text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Withdrawal Fees</span>
                  <span className="font-mono font-bold text-white">
                    {selectedWithdrawChain ? selectedWithdrawChain.fee : `0 ${selectedWithdrawCoin || 'USDT'}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-gray-400">Amount Received</span>
                  <button className="text-[#f5a623] text-[11px] font-semibold">Setting</button>
                  <span className="font-mono font-bold text-white ml-2 text-sm">
                    {(() => {
                      const inputAmt = parseFloat(withdrawAmount) || 0;
                      const feeVal = selectedWithdrawChain?.feeVal || 0;
                      const finalReceived = Math.max(0, inputAmt - feeVal);
                      return `${finalReceived > 0 ? finalReceived : 0} ${selectedWithdrawCoin || 'USDT'}`;
                    })()}
                  </span>
                </div>
              </div>

              <button 
                onClick={async () => {
                  const inputAmt = parseFloat(withdrawAmount) || 0;
                  const minAmt = selectedWithdrawChain?.minAmountVal || 0;
                  if (selectedWithdrawChain && inputAmt < minAmt) {
                    alert(`Minimum withdrawal amount for ${selectedWithdrawChain.name} is ${selectedWithdrawChain.minAmount}`);
                    return;
                  }
                  if (!withdrawAddress || withdrawAddress.trim().length === 0) {
                    alert('Please enter a valid destination address');
                    return;
                  }
                  if (inputAmt <= 0) {
                    alert('Please enter a valid withdrawal amount');
                    return;
                  }

                  const savedUid = localStorage.getItem('userUid');
                  const savedEmail = localStorage.getItem('userEmail');

                  try {
                    const res = await fetch('/api/withdrawal/submit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userUid: savedUid,
                        userEmail: savedEmail,
                        coin: selectedWithdrawCoin || 'USDT',
                        chain: selectedWithdrawChain?.name || 'BEP20',
                        amount: inputAmt,
                        destinationAddress: withdrawAddress
                      })
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert(`⏳ Withdrawal Request Pending!\n$${inputAmt.toFixed(2)} ${selectedWithdrawCoin || 'USDT'} deducted from your main balance and submitted for review.`);
                      setActiveModal(null);
                      setWithdrawAmount('');
                      setWithdrawAddress('');
                      // Dispatch balance update event to instantly refresh UI balance
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('balanceUpdated'));
                        window.dispatchEvent(new Event('notificationUpdated'));
                      }
                    } else {
                      alert(`❌ Withdrawal Error: ${data.error || 'Failed to submit withdrawal'}`);
                    }
                  } catch (err) {
                    console.error('Withdrawal Submit Error:', err);
                    alert('❌ Server error submitting withdrawal request');
                  }
                }}
                className="bg-[#c2841b] hover:bg-[#d9941e] text-black font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Withdraw
              </button>
            </div>

            {/* Chain Selector Modal for Withdrawal */}
            {showWithdrawChainModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={() => setShowWithdrawChainModal(false)} />

                <div className="relative z-10 w-full max-w-[430px] max-h-[85vh] bg-[#121212] border-t border-white/10 rounded-t-3xl p-5 flex flex-col gap-4 text-white shadow-2xl overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1e]">
                    <h3 className="font-extrabold text-base text-white">Choose a Chain Type</h3>
                    <button onClick={() => setShowWithdrawChainModal(false)}>
                      <X className="w-5 h-5 text-[#8e8e93] hover:text-white" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    {(() => {
                      const coin = (selectedWithdrawCoin || 'USDT').toUpperCase();
                      let chains = [];
                      if (coin === 'USDT') {
                        chains = [
                          {
                            id: 'bsc',
                            name: 'BSC (BEP20)',
                            symbol: 'bnb',
                            minAmountVal: 17,
                            minAmount: '17 USDT',
                            feeVal: 0.1,
                            fee: '0.1 USDT'
                          },
                          {
                            id: 'trc20',
                            name: 'TRON (TRC20)',
                            symbol: 'trx',
                            minAmountVal: 17,
                            minAmount: '17 USDT',
                            feeVal: 0.1,
                            fee: '0.1 USDT'
                          }
                        ];
                      } else if (coin === 'BNB') {
                        chains = [
                          {
                            id: 'bsc',
                            name: 'BSC (BEP20)',
                            symbol: 'bnb',
                            minAmountVal: 0.03,
                            minAmount: '0.03 BNB (≈$17 USD)',
                            feeVal: 0.00018,
                            fee: '0.00018 BNB (≈$0.10 USD)'
                          }
                        ];
                      } else if (coin === 'BTC') {
                        chains = [
                          {
                            id: 'btc',
                            name: 'Bitcoin (BTC)',
                            symbol: 'btc',
                            minAmountVal: 0.00027,
                            minAmount: '0.00027 BTC (≈$17 USD)',
                            feeVal: 0.0000016,
                            fee: '0.0000016 BTC (≈$0.10 USD)'
                          }
                        ];
                      } else if (coin === 'TON') {
                        chains = [
                          {
                            id: 'ton',
                            name: 'TON (The Open Network)',
                            symbol: 'ton',
                            minAmountVal: 2.5,
                            minAmount: '2.5 TON (≈$17 USD)',
                            feeVal: 0.015,
                            fee: '0.015 TON (≈$0.10 USD)'
                          }
                        ];
                      } else if (coin === 'TRX') {
                        chains = [
                          {
                            id: 'trc20',
                            name: 'TRON (TRC20)',
                            symbol: 'trx',
                            minAmountVal: 130,
                            minAmount: '130 TRX (≈$17 USD)',
                            feeVal: 0.8,
                            fee: '0.8 TRX (≈$0.10 USD)'
                          }
                        ];
                      } else {
                        chains = [
                          {
                            id: 'bsc',
                            name: 'BSC (BEP20)',
                            symbol: 'bnb',
                            minAmountVal: 17,
                            minAmount: `17 ${coin}`,
                            feeVal: 0.1,
                            fee: `0.1 ${coin}`
                          }
                        ];
                      }

                      return chains.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => {
                            setSelectedWithdrawChain(chain);
                            setShowWithdrawChainModal(false);
                          }}
                          className="w-full py-3 px-2 border-b border-[#1c1c1e] hover:bg-[#1a1a1a] rounded-xl flex items-center justify-between text-left transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <CoinLogo symbol={chain.symbol} size="w-7 h-7" />
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-white">{chain.name}</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                Min. Withdrawal: {chain.minAmount} {chain.feeVal > 0 ? `| Fee: ${chain.fee}` : '| Fee: 0'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 1:1 EXACT MATCH TRANSFER SCREEN (Matching User Screenshot) ---------------- */}
      {activeModal === 'transfer' && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] h-full bg-black text-white flex flex-col relative overflow-hidden select-none">
            
            {/* Top Header Bar */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c1c1e] bg-black">
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <h2 className="font-extrabold text-base text-white tracking-wide">Transfer</h2>

              <button 
                onClick={() => router.push('/history')}
                className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Transfer History"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 no-scrollbar pb-24">
              
              {/* From / To Account Selection Box */}
              <div className="bg-[#1c1c1e] border border-[#2c2c2e] rounded-2xl p-4 flex items-center justify-between relative shadow-lg">
                <div className="flex flex-col gap-3 flex-1 pr-2">
                  
                  {/* From Row */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#8e8e93] w-10">From</span>
                    <button 
                      onClick={() => {
                        setTransferFrom(prev => prev === 'Spot' ? 'Futures' : 'Spot');
                        setTransferTo(prev => prev === 'Futures' ? 'Spot' : 'Futures');
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#38bdf8] transition-colors cursor-pointer"
                    >
                      <span>{transferFrom === 'Spot' ? 'Spot' : 'USDⓈ-M Futures'}</span>
                      <ChevronRight className="w-4 h-4 text-[#8e8e93]" />
                    </button>
                  </div>

                  {/* To Row */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#8e8e93] w-10">To</span>
                    <button 
                      onClick={() => {
                        setTransferFrom(prev => prev === 'Spot' ? 'Futures' : 'Spot');
                        setTransferTo(prev => prev === 'Futures' ? 'Spot' : 'Futures');
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#38bdf8] transition-colors cursor-pointer"
                    >
                      <span>{transferTo === 'Futures' ? 'USDⓈ-M Futures' : 'Spot'}</span>
                      <ChevronRight className="w-4 h-4 text-[#8e8e93]" />
                    </button>
                  </div>

                </div>

                {/* Right Side Vertical Swap Button */}
                <button
                  onClick={() => {
                    setTransferFrom(prev => prev === 'Spot' ? 'Futures' : 'Spot');
                    setTransferTo(prev => prev === 'Futures' ? 'Spot' : 'Futures');
                  }}
                  className="p-2.5 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2c2c2e] transition-all active:scale-90 cursor-pointer"
                  title="Swap From / To"
                >
                  <ArrowRightLeft className="w-5 h-5 rotate-90" />
                </button>
              </div>

              {/* Coin Section */}
              <div>
                <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5">Coin</label>
                
                <div 
                  onClick={() => setActiveModal('transferSelectCoin')}
                  className="bg-[#1c1c1e] border border-[#2c2c2e] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={selectedTransferCoin} size="w-7 h-7" />
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-white">{selectedTransferCoin}</span>
                      <span className="text-xs text-[#8e8e93]">
                        {ALL_TRANSFER_COINS.find(c => c.symbol === selectedTransferCoin)?.name || 'TetherUS'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8e8e93]" />
                </div>

                {/* Red warning message if available balance is 0 */}
                {(() => {
                  const availBal = getCoinAvailableBalance(selectedTransferCoin);
                  if (availBal <= 0) {
                    return (
                      <p className="text-xs text-red-500 font-medium mt-2 leading-tight">
                        No amount available to transfer, please select another coin.
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Amount Section */}
              <div>
                <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5">Amount</label>
                
                <div className="bg-[#1c1c1e] border border-[#2c2c2e] focus-within:border-[#38bdf8] rounded-2xl px-3.5 py-3 flex items-center justify-between transition-colors">
                  <input
                    type="number"
                    placeholder="Minimum 0.00000001"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder-gray-500 outline-none pr-3"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-white">{selectedTransferCoin}</span>
                    <button
                      onClick={() => {
                        const maxVal = getCoinAvailableBalance(selectedTransferCoin);
                        setTransferAmount(maxVal.toString());
                      }}
                      className="text-xs font-extrabold text-[#fcd535] hover:text-[#ebd02c] cursor-pointer transition-colors"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Available Balance Subtitle */}
                <p className="text-xs text-[#8e8e93] font-medium mt-1.5">
                  Available {getCoinAvailableBalance(selectedTransferCoin)} {selectedTransferCoin}
                </p>
              </div>

            </div>

            {/* Bottom Fixed Action Button */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-[#1c1c1e] p-4 z-20">
              <button 
                onClick={handleTransferSubmit}
                disabled={transferSubmitting}
                className="w-full bg-[#fcd535] hover:bg-[#ebd02c] disabled:opacity-50 text-black font-extrabold text-sm py-3.5 rounded-2xl active:scale-95 transition-all shadow-lg cursor-pointer text-center"
              >
                {transferSubmitting ? "Processing..." : "Confirm Transfer"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- TRANSFER COIN SELECTOR MODAL ---------------- */}
      {activeModal === 'transferSelectCoin' && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black sm:bg-black/90 animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] h-full bg-black text-white flex flex-col relative overflow-hidden select-none">
            {/* Top Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#1c1c1e]">
              <button 
                onClick={() => setActiveModal('transfer')}
                className="p-1 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-extrabold text-base text-white">Select Coin</h2>
              <div className="w-5" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 no-scrollbar">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search coin..."
                  value={transferCoinSearchQuery}
                  onChange={(e) => setTransferCoinSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1c1e] border border-[#2c2c2e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#38bdf8]"
                />
              </div>

              {/* Coin List */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#8e8e93] px-1 mb-0.5">Crypto Assets & Balances</span>

                {ALL_TRANSFER_COINS
                  .filter(c => c.symbol.toLowerCase().includes(transferCoinSearchQuery.toLowerCase()) || c.name.toLowerCase().includes(transferCoinSearchQuery.toLowerCase()))
                  .map((coin) => {
                    const avail = getCoinAvailableBalance(coin.symbol);
                    const isSelected = selectedTransferCoin === coin.symbol;
                    return (
                      <button
                        key={coin.symbol}
                        onClick={() => {
                          setSelectedTransferCoin(coin.symbol);
                          setActiveModal('transfer');
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1c2c38] border-[#38bdf8]' 
                            : 'bg-[#1c1c1e] hover:bg-[#2c2c2e] border-[#2c2c2e]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CoinLogo symbol={coin.symbol} size="w-8 h-8" />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-sm text-white">{coin.symbol}</span>
                            <span className="text-xs text-[#8e8e93]">{coin.name}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end font-mono">
                          <span className="text-xs font-bold text-white">
                            {avail} {coin.symbol}
                          </span>
                          <span className="text-[11px] text-[#8e8e93]">
                            Available
                          </span>
                        </div>
                      </button>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {activeModal === 'convert' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-[#121620] border-t border-[#232b38] rounded-t-3xl p-5 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#232b38] pb-3">
              <span className="font-extrabold text-base">Zero-Fee Convert</span>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-[#8e8e93]" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-[#0a0d14] p-3 rounded-xl border border-[#1e2533]">
                <span className="text-xs text-[#8e8e93]">Convert From:</span>
                <span className="text-xs font-bold text-white">{selectedCurrency.code}</span>
              </div>
              <div className="flex justify-center">
                <RefreshCw className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="flex items-center justify-between bg-[#0a0d14] p-3 rounded-xl border border-[#1e2533]">
                <span className="text-xs text-[#8e8e93]">Convert To:</span>
                <span className="text-xs font-bold text-white">USDT</span>
              </div>

              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-white text-black font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-transform mt-1"
              >
                Convert {selectedCurrency.displayVal} {selectedCurrency.code}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Asset Modal */}
      {selectedAsset && activeModal === 'assetDetail' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-[#121620] border-t border-[#232b38] rounded-t-3xl p-5 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#232b38] pb-3">
              <div className="flex items-center gap-2">
                <CoinLogo symbol={selectedAsset.symbol} size="w-7 h-7" />
                <span className="font-extrabold text-base">{selectedAsset.symbol}</span>
              </div>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-[#8e8e93]" />
              </button>
            </div>

            <div className="bg-[#0a0d14] p-4 rounded-2xl border border-[#1e2533] flex justify-between items-center font-mono">
              <div>
                <span className="text-xs text-[#8e8e93] block">Balance</span>
                <span className="text-base font-extrabold text-white">{selectedAsset.amount}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8e8e93] block">Est. Value</span>
                <span className="text-sm font-bold text-[#38bdf8]">≈ {selectedAsset.usdValStr}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button 
                onClick={() => {
                  handleAddTransaction('Trade', selectedAsset.symbol, `${selectedAsset.amount} ${selectedAsset.symbol}`);
                  setActiveModal(null);
                  handleTradeClick(selectedAsset);
                }}
                className="bg-white text-black font-extrabold py-3 rounded-xl text-xs active:scale-95"
              >
                Trade {selectedAsset.symbol}
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-[#1c2029] text-white font-semibold py-3 rounded-xl text-xs border border-[#2b3548] active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
