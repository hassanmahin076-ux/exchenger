"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Delete, 
  Users, 
  FileText, 
  Megaphone, 
  MessageSquare, 
  User,
  Copy,
  Clock,
  AlertCircle,
  Search,
  X,
  Globe
} from 'lucide-react';

// 10 Crypto Popular Countries with rates (~$10 USD min limit) and country-specific payment methods
const COUNTRIES_DATA = [
  {
    code: 'BDT',
    name: 'Bangladesh',
    flag: '🇧🇩',
    symbol: '৳',
    rate: 126.85,
    minLimit: 1200,
    presets: [1200, 3000, 5000, 10000],
    paymentMethods: [
      { id: 'Rocket', name: 'Rocket', price: '127 BDT', color: 'bg-emerald-500', badge: 'Best Offer', accountNo: '01712345678-7', accountType: 'Rocket Personal' },
      { id: 'Lightning bKash', name: 'Lightning bKash', price: '128 BDT', color: 'bg-blue-500', accountNo: '01898765432', accountType: 'bKash Personal' },
      { id: 'bKash', name: 'bKash', price: '130 BDT', color: 'bg-pink-500', accountNo: '01911223344', accountType: 'bKash Personal' },
      { id: 'Lightning Nagad', name: 'Lightning Nagad', price: '131 BDT', color: 'bg-sky-400', accountNo: '01655443322', accountType: 'Nagad Personal' },
      { id: 'Nagad', name: 'Nagad', price: '132 BDT', color: 'bg-orange-500', accountNo: '01788776655', accountType: 'Nagad Personal' },
      { id: 'Bank Transfer BDT', name: 'Bank Transfer', price: '132 BDT', color: 'bg-amber-400', accountNo: '205011802009876', accountType: 'Islami Bank Bangladesh' }
    ]
  },
  {
    code: 'INR',
    name: 'India',
    flag: '🇮🇳',
    symbol: '₹',
    rate: 88.50,
    minLimit: 880,
    presets: [880, 2000, 5000, 10000],
    paymentMethods: [
      { id: 'UPI', name: 'UPI Direct', price: '88.5 INR', color: 'bg-emerald-500', badge: 'Fastest', accountNo: 'cryptoexp@upi', accountType: 'UPI ID' },
      { id: 'PhonePe', name: 'PhonePe', price: '88.8 INR', color: 'bg-purple-600', accountNo: '9876543210', accountType: 'PhonePe Number' },
      { id: 'Paytm', name: 'Paytm Wallet', price: '89.0 INR', color: 'bg-sky-500', accountNo: '9876543210', accountType: 'Paytm Mobile' },
      { id: 'Google Pay', name: 'Google Pay (GPay)', price: '89.2 INR', color: 'bg-blue-600', accountNo: 'gpay.crypto@okaxis', accountType: 'Google Pay VPA' },
      { id: 'IMPS Bank', name: 'IMPS Bank Transfer', price: '89.5 INR', color: 'bg-amber-500', accountNo: '5010023456789', accountType: 'HDFC Bank IMPS' }
    ]
  },
  {
    code: 'PKR',
    name: 'Pakistan',
    flag: '🇵🇰',
    symbol: 'Rs',
    rate: 278.50,
    minLimit: 2780,
    presets: [2780, 5000, 10000, 25000],
    paymentMethods: [
      { id: 'JazzCash', name: 'JazzCash', price: '278.5 PKR', color: 'bg-red-600', badge: 'Instant', accountNo: '03001234567', accountType: 'JazzCash Account' },
      { id: 'EasyPaisa', name: 'EasyPaisa', price: '279.0 PKR', color: 'bg-emerald-600', accountNo: '03451234567', accountType: 'EasyPaisa Account' },
      { id: 'Raast', name: 'Raast Instant Pay', price: '279.5 PKR', color: 'bg-blue-500', accountNo: '03001234567', accountType: 'Raast ID' },
      { id: 'Meezan Bank', name: 'Meezan Bank Transfer', price: '280.0 PKR', color: 'bg-amber-500', accountNo: '00427900123403', accountType: 'Meezan Bank IBAN' }
    ]
  },
  {
    code: 'AED',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    symbol: 'AED',
    rate: 3.67,
    minLimit: 37,
    presets: [37, 100, 250, 500],
    paymentMethods: [
      { id: 'ADCB Bank', name: 'ENBD / ADCB Direct', price: '3.67 AED', color: 'bg-red-700', badge: 'Local Bank', accountNo: 'AE45033000011223344', accountType: 'IBAN Direct' },
      { id: 'Pyypl', name: 'Pyypl Card / Pay', price: '3.68 AED', color: 'bg-purple-600', accountNo: '+971501234567', accountType: 'Pyypl Number' },
      { id: 'Botim Pay', name: 'Botim Pay', price: '3.69 AED', color: 'bg-emerald-500', accountNo: '+971509876543', accountType: 'Botim Pay ID' }
    ]
  },
  {
    code: 'SAR',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    symbol: 'SAR',
    rate: 3.75,
    minLimit: 38,
    presets: [38, 100, 300, 500],
    paymentMethods: [
      { id: 'STC Pay', name: 'STC Pay', price: '3.75 SAR', color: 'bg-purple-700', badge: 'Popular', accountNo: '0501234567', accountType: 'STC Pay Mobile' },
      { id: 'Urpay', name: 'Urpay Wallet', price: '3.76 SAR', color: 'bg-blue-600', accountNo: '0551234567', accountType: 'Urpay Mobile' },
      { id: 'Al Rajhi', name: 'Al Rajhi Bank', price: '3.77 SAR', color: 'bg-blue-900', accountNo: 'SA6080000123456789', accountType: 'Al Rajhi IBAN' }
    ]
  },
  {
    code: 'TRY',
    name: 'Turkey',
    flag: '🇹🇷',
    symbol: '₺',
    rate: 38.20,
    minLimit: 380,
    presets: [380, 1000, 2500, 5000],
    paymentMethods: [
      { id: 'Ziraat', name: 'Ziraat Bankası', price: '38.2 TRY', color: 'bg-red-600', badge: '24/7 FAST', accountNo: 'TR560001009999888877776666', accountType: 'Ziraat IBAN' },
      { id: 'Papara', name: 'Papara Instant', price: '38.3 TRY', color: 'bg-purple-600', accountNo: '1234567890', accountType: 'Papara Account' },
      { id: 'VakifBank', name: 'VakıfBank', price: '38.4 TRY', color: 'bg-yellow-600', accountNo: 'TR120001500000123456789012', accountType: 'Vakıf IBAN' }
    ]
  },
  {
    code: 'NGN',
    name: 'Nigeria',
    flag: '🇳🇬',
    symbol: '₦',
    rate: 1480.00,
    minLimit: 14800,
    presets: [14800, 30000, 75000, 150000],
    paymentMethods: [
      { id: 'Kuda Bank', name: 'Kuda Bank', price: '1480 NGN', color: 'bg-purple-600', badge: '0 Fee', accountNo: '2012345678', accountType: 'Kuda Account' },
      { id: 'OPay', name: 'OPay Digital Pay', price: '1485 NGN', color: 'bg-emerald-500', accountNo: '8012345678', accountType: 'OPay Mobile' },
      { id: 'PalmPay', name: 'PalmPay Wallet', price: '1490 NGN', color: 'bg-blue-500', accountNo: '9012345678', accountType: 'PalmPay Mobile' },
      { id: 'GTBank', name: 'GTBank / Access', price: '1495 NGN', color: 'bg-orange-600', accountNo: '0123456789', accountType: 'GTBank Account' }
    ]
  },
  {
    code: 'VND',
    name: 'Vietnam',
    flag: '🇻🇳',
    symbol: '₫',
    rate: 25400.00,
    minLimit: 254000,
    presets: [254000, 500000, 1000000, 2500000],
    paymentMethods: [
      { id: 'MoMo', name: 'MoMo Wallet', price: '25400 VND', color: 'bg-pink-600', badge: 'Instant', accountNo: '0901234567', accountType: 'MoMo Number' },
      { id: 'ZaloPay', name: 'ZaloPay', price: '25450 VND', color: 'bg-blue-500', accountNo: '0981234567', accountType: 'ZaloPay Mobile' },
      { id: 'Vietcombank', name: 'Vietcombank', price: '25500 VND', color: 'bg-emerald-600', accountNo: '101234567890', accountType: 'VCB Bank' }
    ]
  },
  {
    code: 'IDR',
    name: 'Indonesia',
    flag: '🇮🇩',
    symbol: 'Rp',
    rate: 16200.00,
    minLimit: 162000,
    presets: [162000, 500000, 1000000, 2500000],
    paymentMethods: [
      { id: 'DANA', name: 'DANA Wallet', price: '16200 IDR', color: 'bg-blue-500', badge: 'Instant', accountNo: '08123456789', accountType: 'DANA Mobile' },
      { id: 'OVO', name: 'OVO Pay', price: '16250 IDR', color: 'bg-purple-600', accountNo: '08523456789', accountType: 'OVO Mobile' },
      { id: 'GoPay', name: 'GoPay / ShopeePay', price: '16300 IDR', color: 'bg-emerald-500', accountNo: '08723456789', accountType: 'GoPay Mobile' },
      { id: 'BCA Bank', name: 'Bank BCA', price: '16350 IDR', color: 'bg-blue-700', accountNo: '8830123456', accountType: 'BCA Account' }
    ]
  },
  {
    code: 'USD',
    name: 'United States',
    flag: '🇺🇸',
    symbol: '$',
    rate: 1.00,
    minLimit: 10,
    presets: [10, 50, 100, 250],
    paymentMethods: [
      { id: 'Zelle', name: 'Zelle Direct', price: '1.00 USD', color: 'bg-purple-600', badge: 'Instant 0 Fee', accountNo: 'pay.zelle@cryptoex.com', accountType: 'Zelle Email' },
      { id: 'Wise', name: 'Wise Transfer', price: '1.01 USD', color: 'bg-emerald-500', accountNo: 'usd.wise@cryptoex.com', accountType: 'Wise Tag' },
      { id: 'Revolut', name: 'Revolut Pay', price: '1.01 USD', color: 'bg-black border border-white/30', accountNo: '@cryptoex', accountType: 'Revolut Tag' },
      { id: 'Bank Wire', name: 'ACH / Wire Transfer', price: '1.02 USD', color: 'bg-amber-600', accountNo: '021000021-987654321', accountType: 'Chase Bank ACH' }
    ]
  }
];

export default function P2PPage() {
  const router = useRouter();

  // Bottom Navigation Active Tab: 'P2P' | 'ORDERS' | 'ADS' | 'CHAT' | 'PROFILE'
  const [activeTab, setActiveTab] = useState('P2P');

  // STAGES (for P2P Express Tab): 'EXPRESS' | 'PAYMENT_METHOD' | 'PROCESSING'
  const [stage, setStage] = useState('EXPRESS');
  const [tradeType, setTradeType] = useState('Buy'); // 'Buy' | 'Sell'
  
  // Country & Currency Selection State
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('BDT');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const selectedCountry = COUNTRIES_DATA.find(c => c.code === selectedCurrencyCode) || COUNTRIES_DATA[0];
  
  // Dynamic minimum limit & exchange rate for selected currency
  const MIN_LIMIT = selectedCountry.minLimit;
  const USDT_RATE = selectedCountry.rate;
  const PAYMENT_METHODS = selectedCountry.paymentMethods;

  // Amount state - initial set to '0' so user enters via keypad calculator
  const [amountStr, setAmountStr] = useState('0');
  const numericAmount = parseFloat(amountStr) || 0;

  const isBelowMin = numericAmount > 0 && numericAmount < MIN_LIMIT;
  const isValidAmount = numericAmount >= MIN_LIMIT;

  // Selected Payment Method state
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  // User's receiving account number for Sell mode
  const [userReceiveAccountNo, setUserReceiveAccountNo] = useState('');

  // When currency changes, update payment method default and reset amount
  useEffect(() => {
    if (selectedCountry?.paymentMethods?.length > 0) {
      setSelectedMethod(selectedCountry.paymentMethods[0].id);
    }
    setAmountStr('0');
  }, [selectedCurrencyCode]);
  
  // Order Processing Timer State (10 Minutes = 600 Seconds)
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [orderStatus, setOrderStatus] = useState('PENDING'); // 'PENDING' | 'ACCEPTED' | 'PAID' | 'CANCELLED'
  const [copiedText, setCopiedText] = useState(false);

  const calculatedUsdt = numericAmount > 0 ? (numericAmount / USDT_RATE).toFixed(2) : '0.00';

  // Keypad handling for Express screen
  const handleKeyPress = (val) => {
    if (val === 'DEL') {
      setAmountStr(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === '.') {
      if (!amountStr.includes('.')) setAmountStr(prev => prev + '.');
    } else {
      if (amountStr === '0') setAmountStr(val);
      else if (amountStr.length < 10) setAmountStr(prev => prev + val);
    }
  };

  const handleSelectPreset = (presetValue) => {
    setAmountStr(presetValue.toString());
  };

  // 10-Minute Countdown effect for Stage 3
  useEffect(() => {
    let interval = null;
    if (stage === 'PROCESSING' && orderStatus === 'ACCEPTED' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, orderStatus, timerSeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyAccount = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const currentMethodObj = PAYMENT_METHODS.find(m => m.id === selectedMethod) || PAYMENT_METHODS[0];

  // Helper render for Shared Fixed Bottom Navigation Bar
  const renderBottomNav = () => (
    <nav className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto z-40 bg-[#000000] border-t border-[#141822] px-2 py-2">
      <div className="flex items-center justify-around">
        <button 
          onClick={() => setActiveTab('P2P')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'P2P' ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
          }`}
        >
          <div className="p-1 rounded-full">
            <Users className={`w-5 h-5 ${activeTab === 'P2P' ? 'text-white' : 'text-[#848e9c]'}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'P2P' ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>P2P</span>
        </button>

        <button 
          onClick={() => setActiveTab('ORDERS')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'ORDERS' ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
          }`}
        >
          <div className="p-1 rounded-full">
            <FileText className={`w-5 h-5 ${activeTab === 'ORDERS' ? 'text-white' : 'text-[#848e9c]'}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'ORDERS' ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>Orders</span>
        </button>

        <button 
          onClick={() => setActiveTab('ADS')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'ADS' ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
          }`}
        >
          <div className="p-1 rounded-full">
            <Megaphone className={`w-5 h-5 ${activeTab === 'ADS' ? 'text-white' : 'text-[#848e9c]'}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'ADS' ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>Ads</span>
        </button>

        <button 
          onClick={() => setActiveTab('CHAT')}
          className={`flex flex-col items-center justify-center transition-all relative ${
            activeTab === 'CHAT' ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
          }`}
        >
          <span className="absolute top-0 right-2 bg-[#fcd535] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
          <div className="p-1 rounded-full">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'CHAT' ? 'text-white' : 'text-[#848e9c]'}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'CHAT' ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>Chat</span>
        </button>

        <button 
          onClick={() => setActiveTab('PROFILE')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'PROFILE' ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
          }`}
        >
          <div className="p-1 rounded-full">
            <User className={`w-5 h-5 ${activeTab === 'PROFILE' ? 'text-white' : 'text-[#848e9c]'}`} />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'PROFILE' ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>Profile</span>
        </button>
      </div>
    </nav>
  );

  // ----------------------------------------------------
  // TAB 2: ORDERS VIEW
  // ----------------------------------------------------
  if (activeTab === 'ORDERS') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-20">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button onClick={() => setActiveTab('P2P')} className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide">P2P Orders</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Orders Sub-Tabs */}
        <div className="flex items-center border-b border-[#1f232a] px-4 gap-6 text-xs font-bold py-3 text-gray-400">
          <span className="text-white border-b-2 border-white pb-1 cursor-pointer">Processing (0)</span>
          <span className="hover:text-white cursor-pointer">Completed (0)</span>
          <span className="hover:text-white cursor-pointer">Cancelled (0)</span>
        </div>

        {/* Empty Orders State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="w-16 h-16 rounded-full bg-[#14161a] border border-[#262930] flex items-center justify-center mb-4 shadow-inner">
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-lg font-extrabold text-white mb-1">No Pending Orders</h2>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            You currently have no pending or active P2P orders. New orders will appear here once created.
          </p>
        </div>

        {renderBottomNav()}
      </div>
    );
  }

  // ----------------------------------------------------
  // TAB 3: ADS / MERCHANT VIEW
  // ----------------------------------------------------
  if (activeTab === 'ADS') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-20">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button onClick={() => setActiveTab('P2P')} className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide">P2P Advertisements</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Ineligible Merchant State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-lg font-extrabold text-white mb-2">
            You are not eligible for Merchant
          </h2>
          <p className="text-xs text-gray-400 max-w-xs mb-6 leading-relaxed">
            You do not meet the minimum requirements to publish P2P advertisements. Complete advanced KYC verification and maintain at least 500 USDT balance to apply for Merchant status.
          </p>
          <button className="px-6 py-3 rounded-xl bg-[#1e222b] text-gray-400 font-bold text-xs border border-[#2b2f38] cursor-not-allowed">
            Ineligible for Posting Ads
          </button>
        </div>

        {renderBottomNav()}
      </div>
    );
  }

  // ----------------------------------------------------
  // TAB 4: CHAT / MESSAGES VIEW
  // ----------------------------------------------------
  if (activeTab === 'CHAT') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-20">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button onClick={() => setActiveTab('P2P')} className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide">P2P Messages</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Empty Chat State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="w-16 h-16 rounded-full bg-[#14161a] border border-[#262930] flex items-center justify-center mb-4 shadow-inner">
            <MessageSquare className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-lg font-extrabold text-white mb-1">No Chat History</h2>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            You have no active chat conversations. Active chats with P2P buyers and sellers will be displayed here when an order is created.
          </p>
        </div>

        {renderBottomNav()}
      </div>
    );
  }

  // ----------------------------------------------------
  // TAB 5: P2P USER PROFILE VIEW
  // ----------------------------------------------------
  if (activeTab === 'PROFILE') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-24">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button onClick={() => setActiveTab('P2P')} className="text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold text-white tracking-wide">P2P User Profile</h1>
          <div className="w-6 h-6" />
        </div>

        <div className="px-5 pt-5 flex flex-col gap-4">
          {/* User Info Card */}
          <div className="bg-[#14161a] border border-[#262930] rounded-2xl p-4 flex items-center gap-4 shadow-md">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fcd535] to-[#e0a800] text-black font-black text-xl flex items-center justify-center shadow-lg">
              U
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">user@exchanger.com</h2>
                <span className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">UID: 88392014</p>
            </div>
          </div>

          {/* Trading Statistics Card */}
          <div className="bg-[#14161a] border border-[#262930] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Trading Statistics
            </h3>
            
            <div className="grid grid-cols-3 gap-3 text-center border-b border-[#232730] pb-4 mb-3">
              <div>
                <p className="text-lg font-black text-white font-mono">0</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Total Orders</p>
              </div>
              <div>
                <p className="text-lg font-black text-[#fcd535] font-mono">৳ 0.00</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Total Buy</p>
              </div>
              <div>
                <p className="text-lg font-black text-emerald-400 font-mono">৳ 0.00</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Total Sell</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">30d Completion</span>
                <span className="font-bold text-white font-mono">100.00%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Release</span>
                <span className="font-bold text-white font-mono">2.50 Min</span>
              </div>
            </div>
          </div>
        </div>

        {renderBottomNav()}
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER STAGE 2: "I Will Pay" or "Receive Payment" (Payment Method Selection)
  // ----------------------------------------------------
  if (stage === 'PAYMENT_METHOD') {
    const isSell = tradeType === 'Sell';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-32">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button 
            onClick={() => setStage('EXPRESS')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">
            {isSell ? 'Receive Payment' : 'I Will Pay'} ({selectedCountry.code})
          </h1>
          <div className="w-6 h-6" />
        </div>

        <div className="px-5 pt-6 pb-4">
          {/* Header Amount */}
          <div className="text-center mb-6">
            {isSell ? (
              <>
                <p className="text-xs text-gray-400 mb-1 font-medium">Selling USDT Amount</p>
                <h2 className="text-3xl font-extrabold text-[#fcd535] tracking-tight">
                  {calculatedUsdt} USDT
                </h2>
                <p className="text-xs text-gray-300 mt-1 font-semibold">
                  You will receive <span className="text-white font-bold">{selectedCountry.symbol}{numericAmount.toLocaleString('en-US')} {selectedCountry.code}</span>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {selectedCountry.symbol}{numericAmount.toLocaleString('en-US')} {selectedCountry.code}
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  I will receive <span className="text-white font-semibold">{calculatedUsdt} USDT</span>
                </p>
              </>
            )}
          </div>

          {/* Payment Method Cards */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1 mb-0.5">
              <span className="font-semibold">
                {isSell ? `Select Receive Method (${selectedCountry.name})` : `Pay with (${selectedCountry.name})`}
              </span>
              <span className="font-semibold">Price per USDT</span>
            </div>

            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#14161a] border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-white bg-[#1a1d24] shadow-md ring-1 ring-white/20' 
                      : 'border-[#262930] hover:border-gray-700'
                  }`}
                >
                  {/* Left Indicator & Name */}
                  <div className="flex items-center gap-3">
                    <span className={`w-1 h-5 rounded-full ${method.color}`} />
                    <span className="text-sm font-bold text-white tracking-tight">
                      {method.name}
                    </span>
                  </div>

                  {/* Right Price & Badge */}
                  <div className="flex items-center gap-2">
                    {method.badge && (
                      <span className="bg-[#fcd535] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        {method.badge}
                      </span>
                    )}
                    <span className="text-sm font-bold text-white font-mono">
                      {method.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sell Mode: Add Receiving Account Number Field */}
          {isSell && (
            <div className="mt-5 bg-[#14161a] border border-[#262930] rounded-2xl p-4">
              <label className="block text-xs font-bold text-white mb-2">
                Enter Your {currentMethodObj.name} Receiving Number / Account:
              </label>
              <input
                type="text"
                placeholder={`e.g. Enter your ${currentMethodObj.name} ${currentMethodObj.accountType}`}
                value={userReceiveAccountNo}
                onChange={(e) => setUserReceiveAccountNo(e.target.value)}
                className="w-full bg-[#1a1d24] border border-[#323846] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#fcd535]"
              />
              <p className="text-[11px] text-gray-400 mt-2 italic">
                * Please double-check your account number. Buyer will send money directly to this number.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-md border-t border-[#1f232a] max-w-md mx-auto">
          <button
            onClick={() => {
              if (isSell && !userReceiveAccountNo.trim()) {
                alert(`Please enter your ${currentMethodObj.name} account number to receive payment.`);
                return;
              }
              setTimerSeconds(600); // Reset 10 minutes
              setOrderStatus('PENDING');
              setStage('PROCESSING');
            }}
            disabled={isSell && !userReceiveAccountNo.trim()}
            className={`w-full py-4 rounded-xl font-extrabold text-base tracking-wide transition-all shadow-lg ${
              isSell && !userReceiveAccountNo.trim()
                ? 'bg-[#232730] text-gray-500 cursor-not-allowed'
                : isSell
                  ? 'bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white'
                  : 'bg-[#fcd535] hover:bg-[#e2be28] active:scale-[0.99] text-black'
            }`}
          >
            {isSell ? 'Submit Sell Order Request' : 'Preview Order (27)'}
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER STAGE 3: ORDER ACCEPTED & 10-MIN PROCESSING TIMER
  // ----------------------------------------------------
  if (stage === 'PROCESSING') {
    const isPending = orderStatus === 'PENDING';
    const isSell = tradeType === 'Sell';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f232a]">
          <button 
            onClick={() => setStage('PAYMENT_METHOD')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-white">
              {isSell 
                ? 'Sell Order Request (Pending)' 
                : isPending 
                  ? 'Order Created (Pending)' 
                  : 'Order Created'}
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">P2P-20260808-88392</p>
          </div>
          <button onClick={() => setStage('EXPRESS')} className="text-xs text-gray-400 hover:text-white font-medium">
            Exit
          </button>
        </div>

        <div className="px-5 pt-4">
          {/* Status Header Banner */}
          <div className="bg-[#14161a] border border-[#2b2f38] rounded-2xl p-4 mb-4 text-center relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
              isPending ? 'bg-amber-500/10' : 'bg-[#aeff00]/5'
            }`} />
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isPending ? 'text-white' : 'text-[#00ff66]'
              }`}>
                {isSell 
                  ? 'Sell Request - Waiting for Buyer' 
                  : isPending 
                    ? 'Processing - Pending Acceptance' 
                    : 'Order Accepted & Processing'}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white mb-1">
              {isSell 
                ? 'Waiting for Buyer Payment' 
                : isPending 
                  ? 'Order Not Accepted Yet' 
                  : 'Pay the Seller'}
            </h2>
            <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
              {isSell
                ? 'Your sell order request has been submitted. Please wait for buyer to transfer money to your receiving account.'
                : isPending 
                  ? 'Merchant has not accepted your order yet. Please wait, payment details will appear once accepted.'
                  : 'Please complete your payment within the remaining time. The seller will verify and release your USDT.'}
            </p>

            {/* Prominent Timer / Status Display */}
            {isPending ? (
              <div className="flex items-center justify-center gap-2 py-2 text-white">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-sm font-extrabold tracking-wide">
                  {isSell ? 'Waiting for Buyer Payment...' : 'Waiting for Merchant Acceptance...'}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-[#1f242d] px-5 py-2.5 rounded-xl border border-[#323846]">
                <Clock className="w-5 h-5 text-[#fcd535] animate-pulse" />
                <span className="text-2xl font-black text-[#fcd535] font-mono tracking-widest">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            )}
            
            {orderStatus === 'PAID' && (
              <div className="mt-3 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 py-1.5 px-3 rounded-lg">
                ✓ Payment reported. Merchant is verifying your transaction...
              </div>
            )}
          </div>

          {/* Payment Account Details Box */}
          <div className="bg-[#14161a] border border-[#262930] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#232730] pb-2.5">
              <span className="text-xs text-gray-400 font-medium">Payment Method</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${currentMethodObj.color}`} />
                {currentMethodObj.name}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3 border-b border-[#232730] pb-2.5">
              <span className="text-xs text-gray-400 font-medium">
                {isSell ? 'Amount You Receive' : 'Amount to Pay'}
              </span>
              <span className="text-base font-extrabold text-[#fcd535] font-mono">
                {selectedCountry.symbol} {numericAmount.toLocaleString('en-US')} {selectedCountry.code}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3 border-b border-[#232730] pb-2.5">
              <span className="text-xs text-gray-400 font-medium">
                {isSell ? 'USDT to Sell' : 'USDT to Receive'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {calculatedUsdt} USDT
              </span>
            </div>

            {/* Account Number Position: Clean white text (No box) */}
            {isPending ? (
              <div className="py-3 px-2 text-center border-t border-[#232730] mt-2">
                {isSell ? (
                  <>
                    <p className="text-xs text-gray-400 mb-1">Your Receiving Account:</p>
                    <p className="text-base font-extrabold text-white font-mono tracking-wider mb-2">
                      {userReceiveAccountNo || currentMethodObj.accountNo} ({currentMethodObj.name})
                    </p>
                    <p className="text-xs text-gray-400">
                      Payment will be sent directly to your account by buyer.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-white tracking-wide">
                      Waiting for merchant to accept order...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Payment details and number will appear here once accepted.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-[#1a1d24] border border-[#2e333e] rounded-xl p-3 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">{currentMethodObj.accountType} Number</p>
                  <p className="text-base font-extrabold text-white font-mono tracking-wider">
                    {currentMethodObj.accountNo}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyAccount(currentMethodObj.accountNo)}
                  className="bg-[#2b303c] hover:bg-[#383f4f] text-gray-200 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-[#aeff00]" />
                  <span>{copiedText ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {isPending ? (
              <div className="py-3 text-center text-white text-sm font-extrabold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span>{isSell ? 'Waiting for Buyer Payment...' : 'Waiting for Order Acceptance...'}</span>
              </div>
            ) : (
              <button
                onClick={() => setOrderStatus('PAID')}
                disabled={orderStatus === 'PAID'}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-md ${
                  orderStatus === 'PAID'
                    ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                    : 'bg-[#aeff00] hover:bg-[#9ef000] text-black active:scale-[0.99]'
                }`}
              >
                {orderStatus === 'PAID' ? '✓ Transferred & Notified' : 'Transferred, Notify Seller'}
              </button>
            )}

            <button
              onClick={() => {
                if (confirm("Are you sure you want to cancel this P2P order?")) {
                  setStage('EXPRESS');
                }
              }}
              className="w-full py-3 rounded-xl bg-[#14161a] hover:bg-[#1f232b] text-gray-400 hover:text-white font-bold text-xs border border-[#262930] transition-colors"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER TAB 1: P2P EXPRESS TAB
  // ----------------------------------------------------
  const isSell = tradeType === 'Sell';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans select-none pb-16">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#14161a]">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Center Title: Express */}
          <div className="text-[#ffffff] font-extrabold text-base tracking-wide">
            <span>Express</span>
          </div>

          {/* Filter / Currency Selection Button */}
          <button 
            onClick={() => setIsCountryModalOpen(true)}
            className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#14161a]"
            title="Change Currency / Country"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Buy / Sell Pill Toggle */}
        <div className="px-4 mt-4">
          <div className="inline-flex bg-[#181a20] p-1 rounded-full border border-[#252830]">
            <button
              onClick={() => setTradeType('Buy')}
              className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                tradeType === 'Buy'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('Sell')}
              className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                tradeType === 'Sell'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Crypto Selection & Exchange Rate Banner */}
        <div className="px-4 mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-200 font-semibold cursor-pointer">
            <span className="w-4 h-4 rounded-full bg-[#00d294] text-black font-extrabold text-[9px] flex items-center justify-center">
              ₮
            </span>
            <span>USDT</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded font-mono font-bold">
              4.66% APR
            </span>
            <span className="text-gray-400 text-[10px]">▼</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-[11px] font-mono">
            <ArrowUpDown className="w-3 h-3 text-gray-400" />
            <span>0 USDT</span>
            <span className="text-gray-300 font-sans ml-1">1 USDT ≈ {USDT_RATE} {selectedCountry.code}</span>
          </div>
        </div>

        {/* Main Big Amount Display Area */}
        <div className="mt-8 mb-4 text-center px-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-white tracking-tight font-mono">
              {numericAmount === 0 ? '0' : numericAmount.toLocaleString('en-US')}
            </span>
            
            {/* Currency Selector Button */}
            <button 
              onClick={() => setIsCountryModalOpen(true)}
              className="flex items-center gap-1.5 text-base font-bold text-white bg-[#14161a] hover:bg-[#1f232a] border border-[#2b2f38] px-3 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.code}</span>
              <span className="text-xs text-gray-400">▼</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2 font-medium">
            ≈ {calculatedUsdt} USDT
          </p>

          {/* Minimum Amount Alert Message */}
          {isBelowMin && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/80 border border-red-800/80 px-3.5 py-1.5 rounded-full animate-bounce">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>Minimum selection is {selectedCountry.symbol}{selectedCountry.minLimit.toLocaleString()} {selectedCountry.code} (~$10)</span>
            </div>
          )}
        </div>

        {/* Quick Amount Preset Chips */}
        <div className="px-4 my-4 grid grid-cols-4 gap-2">
          {selectedCountry.presets.map((presetVal) => (
            <button
              key={presetVal}
              onClick={() => handleSelectPreset(presetVal)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                numericAmount === presetVal
                  ? 'bg-white text-black border-white shadow'
                  : 'bg-[#14161a] text-gray-200 border-[#262930] hover:border-gray-600'
              }`}
            >
              {selectedCountry.symbol}{presetVal >= 1000 ? `${(presetVal / 1000).toFixed(presetVal % 1000 === 0 ? 0 : 1)}K` : presetVal}
            </button>
          ))}
        </div>

        {/* Custom Touch Keypad */}
        <div className="px-6 my-2 grid grid-cols-3 gap-y-3 gap-x-6 text-center max-w-sm mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'].map((keyVal) => (
            <button
              key={keyVal}
              onClick={() => handleKeyPress(keyVal)}
              className="py-2.5 rounded-xl text-2xl font-bold text-white hover:bg-[#1e222a] active:bg-[#2b303c] transition-colors flex items-center justify-center"
            >
              {keyVal === 'DEL' ? <Delete className="w-6 h-6 text-gray-300" /> : keyVal}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button & Bottom Nav Bar */}
      <div>
        {/* Main Action Button */}
        <div className="px-4 mb-3">
          <button
            onClick={() => {
              if (isValidAmount) {
                setStage('PAYMENT_METHOD');
              }
            }}
            disabled={!isValidAmount}
            className={`w-full py-3.5 rounded-full font-extrabold text-sm transition-all shadow-md ${
              isValidAmount 
                ? isSell 
                  ? 'bg-red-500 hover:bg-red-600 text-white active:scale-[0.99]'
                  : 'bg-[#fcd535] hover:bg-[#e2be28] text-black active:scale-[0.99]'
                : 'bg-[#232730] text-gray-500 cursor-not-allowed'
            }`}
          >
            {isBelowMin 
              ? `Minimum Amount ${selectedCountry.symbol}${selectedCountry.minLimit.toLocaleString()} ${selectedCountry.code}` 
              : !isValidAmount 
                ? 'Enter Amount' 
                : isSell 
                  ? 'Sell USDT with 0 Fee' 
                  : 'Buy USDT with 0 Fee'}
          </button>
        </div>

        {renderBottomNav()}
      </div>

      {/* Country / Currency Selection Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#14161a] border border-[#262930] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#232730]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#fcd535]" />
                <h3 className="text-base font-bold text-white">Select Country / Currency</h3>
              </div>
              <button 
                onClick={() => setIsCountryModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#232730] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#232730]">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search currency or country..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full bg-[#1a1d24] border border-[#2b2f38] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#fcd535]"
                />
              </div>
            </div>

            {/* Country List */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {COUNTRIES_DATA
                .filter(c => 
                  c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                  c.code.toLowerCase().includes(countrySearch.toLowerCase())
                )
                .map((c) => {
                  const isSelected = c.code === selectedCurrencyCode;
                  return (
                    <div
                      key={c.code}
                      onClick={() => {
                        setSelectedCurrencyCode(c.code);
                        setIsCountryModalOpen(false);
                        setCountrySearch('');
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#1f242d] border border-[#fcd535]/40 text-white shadow-md' 
                          : 'bg-[#181a20] border border-transparent hover:border-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{c.code}</span>
                            <span className="text-xs text-gray-400 font-normal">({c.symbol})</span>
                          </p>
                          <p className="text-xs text-gray-400">{c.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-[#fcd535]">
                          1 USDT ≈ {c.rate} {c.code}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Min: {c.symbol}{c.minLimit.toLocaleString()} (~$10)
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
