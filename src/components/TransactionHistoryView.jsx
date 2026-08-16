"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown, 
  Check, 
  X,
  RefreshCw
} from 'lucide-react';
import BottomDock from '@/components/BottomDock';

export default function TransactionHistoryView() {
  const router = useRouter();

  const [historyList, setHistoryList] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('All'); // 'All' | 'Received' | 'Deposit' | 'Withdraw' | 'Referral' | 'Red Packet'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserHistory = async () => {
    try {
      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');

      if (savedUid || savedEmail) {
        const res = await fetch(`/api/user/history?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.history)) {
          setHistoryList(data.history);
        }
      }
    } catch (err) {
      console.warn('History page fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
    const interval = setInterval(fetchUserHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format date as YYYY-MM-DD HH:mm:ss matching the screenshot
  const formatDateTime = (dateStr) => {
    try {
      const d = new Date(dateStr || Date.now());
      if (isNaN(d.getTime())) return dateStr || '2026-08-16 00:00:00';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return '2026-08-16 00:00:00';
    }
  };

  const FILTER_OPTIONS = [
    { id: 'All', label: 'All Transactions' },
    { id: 'Received', label: 'Received' },
    { id: 'Deposit', label: 'Deposit' },
    { id: 'Withdraw', label: 'Withdraw' },
    { id: 'Referral', label: 'Referral Rewards' },
    { id: 'Red Packet', label: 'Claim Red Packet' },
  ];

  const filteredHistory = historyList.filter(item => {
    if (historyFilter === 'All') return true;
    const typeLower = (item.type || '').toLowerCase();
    const titleLower = (item.title || '').toLowerCase();
    const filterLower = historyFilter.toLowerCase();

    if (filterLower === 'received') {
      return typeLower.includes('deposit') || typeLower.includes('referral') || titleLower.includes('receive') || titleLower.includes('0.5$');
    }
    if (filterLower === 'red packet') {
      return titleLower.includes('red packet') || titleLower.includes('cryptobox') || titleLower.includes('claim');
    }
    if (filterLower === 'referral') {
      return typeLower.includes('referral') || titleLower.includes('0.5$');
    }

    return typeLower.includes(filterLower) || titleLower.includes(filterLower);
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-24 relative">
      
      {/* ================= TOP HEADER (Screenshot Match) ================= */}
      <header className="sticky top-0 z-40 bg-black border-b border-[#161618] px-4 py-4 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <button 
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors p-1 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center Title */}
        <h1 className="text-base font-bold text-white tracking-wide">
          History
        </h1>

        {/* Right: Refresh/Calendar Icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUserHistory}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors cursor-pointer">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= SUB-HEADER / FILTER DROPDOWN BAR (Screenshot Match) ================= */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#141416] relative" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 hover:text-white transition-colors cursor-pointer"
          >
            <span>{historyFilter === 'All' ? 'Received' : historyFilter}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown */}
          {isFilterDropdownOpen && (
            <div className="absolute left-0 top-9 w-48 bg-[#121214] border border-[#222226] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setHistoryFilter(opt.id);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    historyFilter === opt.id ? 'text-amber-400 bg-white/5 font-bold' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{opt.label}</span>
                  {historyFilter === opt.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[11px] text-gray-500 font-mono">
          {filteredHistory.length} Record{filteredHistory.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ================= HISTORY TEXT LIST (100% Screenshot Minimal Text Match) ================= */}
      <main className="flex-1 px-5 py-2">
        {loading ? (
          <div className="text-center py-20 text-xs text-gray-500">
            Loading history records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20 text-xs text-gray-500">
            No history records found.
          </div>
        ) : (
          <div className="divide-y divide-[#121215]">
            {filteredHistory.map((item, idx) => {
              const isNegative = (item.amount || '').startsWith('-') || item.type === 'Withdraw';
              const statusRaw = (item.status || 'Completed').toLowerCase();

              let statusLabel = 'Completed';
              let dotColor = 'bg-[#0ecb81]'; // Green
              let textColor = 'text-[#0ecb81]';

              if (statusRaw === 'successful' || statusRaw === 'completed') {
                statusLabel = statusRaw === 'successful' ? 'Successful' : 'Completed';
                dotColor = 'bg-[#0ecb81]';
                textColor = 'text-[#0ecb81]';
              } else if (statusRaw === 'pending') {
                statusLabel = 'Pending';
                dotColor = 'bg-amber-400';
                textColor = 'text-amber-400';
              } else if (statusRaw === 'rejected' || statusRaw === 'failed') {
                statusLabel = 'Failed';
                dotColor = 'bg-red-500';
                textColor = 'text-red-400';
              }

              // Display Title
              let displayTitle = item.title || item.type || 'Transaction';

              return (
                <div key={item.id || idx} className="py-4 flex items-start justify-between gap-3">
                  
                  {/* Left Column: Title + Timestamp */}
                  <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug break-words">
                      {displayTitle}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono tracking-tight">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>

                  {/* Right Column: Amount + Status with Green Dot */}
                  <div className="text-right shrink-0 space-y-1.5">
                    <span className="text-sm font-bold text-white font-mono tracking-tight block">
                      {item.amount}
                    </span>

                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`}></span>
                      <span className={`text-[11px] font-medium ${textColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomDock />
    </div>
  );
}
