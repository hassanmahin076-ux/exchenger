"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare, 
  MoreVertical, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  X, 
  Send, 
  AlertCircle,
  Globe,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  User,
  Check,
  TrendingUp,
  FileText,
  Lock,
  Mail,
  KeyRound
} from 'lucide-react';

export default function AdminMobileView() {
  const router = useRouter();
  const pathname = usePathname();

  // Mobile Admin Authorization Guard (tesnetoffer1678@gmail.com or mdkhairul23122@gmail.com)
  const ALLOWED_MOBILE_ADMIN_EMAILS = [
    'tesnetoffer1678@gmail.com',
    'mdkhairul23122@gmail.com'
  ];

  const [isMounted, setIsMounted] = useState(false);
  const [authorizedMobileEmail, setAuthorizedMobileEmail] = useState('');
  const [inputMobileEmail, setInputMobileEmail] = useState('');
  const [mobileAuthError, setMobileAuthError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setAuthorizedMobileEmail(localStorage.getItem('adminMobileAuthorizedEmail') || '');
    }
  }, []);

  const isMobileAuthorized = ALLOWED_MOBILE_ADMIN_EMAILS.some(
    e => e.toLowerCase() === (authorizedMobileEmail || '').trim().toLowerCase()
  );

  const handleMobileAdminAuthSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = (inputMobileEmail || '').trim().toLowerCase();

    if (ALLOWED_MOBILE_ADMIN_EMAILS.some(e => e.toLowerCase() === cleanEmail)) {
      localStorage.setItem('adminMobileAuthorizedEmail', cleanEmail);
      setAuthorizedMobileEmail(cleanEmail);
      setMobileAuthError('');
    } else {
      setMobileAuthError('Access Denied! The entered Gmail is not authorized for Mobile Admin Access.');
    }
  };

  // Active Tab: 'users' | 'kyc' | 'withdrawals' | 'support'
  const [activeTab, setActiveTab] = useState('users');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingKyc: 0,
    totalUserBalances: 0,
    onlineUsers: 18,
  });

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [kycFilter, setKycFilter] = useState('pending'); // 'pending' | 'all'
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [withdrawFilter, setWithdrawFilter] = useState('pending'); // 'pending' | 'all'
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Modal States
  const [balanceModal, setBalanceModal] = useState({ open: false, user: null, action: 'add', amount: '', note: '' });
  const [kycModal, setKycModal] = useState({ open: false, submission: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Main Data Fetcher
  const fetchAllData = async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      }

      // 2. Users
      const usersRes = await fetch(`/api/admin/users${userSearch ? `?search=${encodeURIComponent(userSearch)}` : ''}`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success && Array.isArray(usersData.users)) {
          setUsers(usersData.users);
        }
      }

      // 3. KYC Submissions
      const kycRes = await fetch('/api/admin/kyc');
      if (kycRes.ok) {
        const kycData = await kycRes.json();
        if (kycData.success && Array.isArray(kycData.kycSubmissions)) {
          setKycSubmissions(kycData.kycSubmissions);
        }
      }

      // 4. Withdrawals
      const wdrRes = await fetch('/api/admin/withdrawals');
      if (wdrRes.ok) {
        const wdrData = await wdrRes.json();
        if (wdrData.success && Array.isArray(wdrData.withdrawRequests)) {
          setWithdrawRequests(wdrData.withdrawRequests);
        }
      }

      // 5. Support Tickets
      const supRes = await fetch('/api/support/tickets?admin=true');
      if (supRes.ok) {
        const supData = await supRes.json();
        if (supData.success && Array.isArray(supData.tickets)) {
          setSupportTickets(supData.tickets);
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and 5-second polling interval
  useEffect(() => {
    fetchAllData(false);

    const interval = setInterval(() => {
      fetchAllData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/admin/users${userSearch ? `?search=${encodeURIComponent(userSearch)}` : ''}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.users)) setUsers(data.users);
        })
        .catch(err => console.error(err));
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Balance Action Handler
  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    if (!balanceModal.user || !balanceModal.amount || parseFloat(balanceModal.amount) <= 0) {
      showToast('Please enter a valid positive amount', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/user/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUid: balanceModal.user.uid,
          action: balanceModal.action,
          amount: parseFloat(balanceModal.amount),
          note: balanceModal.note || `Admin ${balanceModal.action} balance`
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Balance ${balanceModal.action}ed successfully!`);
        setBalanceModal({ open: false, user: null, action: 'add', amount: '', note: '' });
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to update balance', 'error');
      }
    } catch (err) {
      showToast('Server error executing balance update', 'error');
    }
  };

  // KYC Action Handler
  const handleKycAction = async (kycId, userUid, action) => {
    try {
      const res = await fetch('/api/admin/kyc/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycId, userUid, action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`KYC ${action === 'approve' ? 'Approved' : 'Declined'} successfully!`);
        if (kycModal.open) setKycModal({ open: false, submission: null });
        fetchAllData(true);
      } else {
        showToast(data.error || 'KYC action failed', 'error');
      }
    } catch (err) {
      showToast('Server error processing KYC action', 'error');
    }
  };

  // Withdrawal Action Handler
  const handleWithdrawAction = async (withdrawalId, action) => {
    try {
      const res = await fetch('/api/admin/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Withdrawal ${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
        fetchAllData(true);
      } else {
        showToast(data.error || 'Withdrawal action failed', 'error');
      }
    } catch (err) {
      showToast('Server error processing withdrawal action', 'error');
    }
  };

  // Support Reply Handler
  const handleSupportReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const res = await fetch('/api/admin/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          replyMessage: replyMessage.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Reply sent and ticket resolved!');
        setReplyMessage('');
        setSelectedTicket(data.ticket);
        fetchAllData(true);
      } else {
        showToast(data.error || 'Failed to send reply', 'error');
      }
    } catch (err) {
      showToast('Server error sending support reply', 'error');
    }
  };

  // Compute pending badges
  const pendingKycCount = kycSubmissions.filter(k => k.kycStatus === 'Pending').length;
  const pendingWdrCount = withdrawRequests.filter(w => w.status === 'Pending').length;
  const openTicketCount = supportTickets.filter(t => t.status === 'open' || t.status === 'Open').length;

  const NAV_ITEMS = [
    { id: 'users', label: 'Users', icon: Users, badge: stats.totalUsers || users.length, color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
    { id: 'kyc', label: 'KYC Approve', icon: ShieldCheck, badge: pendingKycCount, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
    { id: 'withdrawals', label: 'Withdraw Requests', icon: ArrowUpRight, badge: pendingWdrCount, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
    { id: 'support', label: 'Support', icon: MessageSquare, badge: openTicketCount, color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
  ];

  const filteredKyc = kycFilter === 'pending'
    ? kycSubmissions.filter(k => k.kycStatus === 'Pending')
    : kycSubmissions;

  const filteredWithdrawals = withdrawFilter === 'pending'
    ? withdrawRequests.filter(w => w.status === 'Pending')
    : withdrawRequests;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isMobileAuthorized) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        <div className="fixed top-1/4 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-sm bg-[#10121D]/95 border border-white/15 rounded-3xl p-6 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="text-base font-black tracking-tight text-white">POKYMAX MOBILE ADMIN</h1>
            <p className="text-[11px] text-gray-400">Mobile Admin Access Verification</p>
          </div>

          <div className="bg-[#090A12] border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-300 space-y-1.5">
            <p className="font-extrabold flex items-center gap-1.5 text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Mobile Admin Gmail Required</span>
            </p>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Please enter your authorized Mobile Admin Gmail address to unlock control panel.
            </p>
          </div>

          {mobileAuthError && (
            <div className="bg-red-950/80 border border-red-500/40 rounded-2xl p-3 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-[11px]">{mobileAuthError}</span>
            </div>
          )}

          <form onSubmit={handleMobileAdminAuthSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-extrabold text-gray-300 block mb-1">Mobile Admin Gmail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter authorized Gmail"
                  value={inputMobileEmail}
                  onChange={(e) => setInputMobileEmail(e.target.value)}
                  className="w-full bg-[#06070B] border border-white/15 rounded-2xl pl-9 pr-3 py-3 text-xs text-white placeholder-gray-600 outline-none focus:border-amber-400 transition-colors shadow-inner font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify & Unlock Mobile Admin</span>
            </button>
          </form>

          <div className="text-center text-[10px] text-gray-500 pt-1 border-t border-white/5">
            Mobile Administrator Verification • Pokymax
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-gray-100 flex flex-col font-sans select-none pb-24 relative overflow-x-hidden">
      
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] border text-xs font-semibold flex items-center gap-2.5 max-w-[90vw] animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-xl ${
          toast.type === 'error'
            ? 'bg-red-950/90 border-red-500/50 text-red-200'
            : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-[#0B0C12]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Left: Logo & Online Indicator */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/admin/home')}>
          <div className="relative">
            <img
              src="/logo.png"
              alt="Pokymax Logo"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0B0C12] animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                POKYMAX
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-mono">
                MOBILE
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-emerald-300">{stats.onlineUsers || 18} Online</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Refresh + 3-Dot Menu */}
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <button
            onClick={() => fetchAllData(false)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-[#131522]/80 border border-white/10 text-gray-400 hover:text-white active:scale-95 transition-all shadow-md"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* 3-Dot Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 shadow-md ${
              isMenuOpen 
                ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'bg-[#131522]/80 border-white/10 text-gray-200 hover:text-white'
            }`}
            aria-label="Admin Navigation Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* ================= 3-DOT POPUP MENU ================= */}
          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-64 bg-[#10121C]/95 border border-white/15 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
              <div className="px-4 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
                <p className="text-[10px] uppercase font-black text-amber-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Admin Menu</span>
                </p>
                <span className="text-[9px] text-gray-500 font-mono">Select Tab</span>
              </div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-300 font-bold border-l-4 border-amber-400' 
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${item.bg}`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-400/20' 
                          : 'bg-[#1C1F2E] text-gray-300 border border-white/10'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Logout Option */}
              <button
                onClick={() => {
                  localStorage.removeItem('adminMobileAuthorizedEmail');
                  setAuthorizedMobileEmail('');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-red-400 font-bold hover:bg-white/5 flex items-center justify-between cursor-pointer border-t border-white/10 mt-1"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Logout Admin</span>
                </div>
                <span className="text-[9px] text-gray-500 font-mono">Lock</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= METRICS GRID (Ultra Colorful 2x2 Box Design) ================= */}
      <section className="p-4 bg-[#090A0F] border-b border-white/5">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Card 1: Total Users */}
          <div className="bg-gradient-to-br from-[#12162B] via-[#0E1224] to-[#0B0D18] border border-blue-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_8px_20px_rgba(59,130,246,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white font-mono tracking-tight">{stats.totalUsers || 0}</span>
              <span className="text-[10px] text-blue-400 font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                Registered
              </span>
            </div>
          </div>

          {/* Card 2: KYC Verified */}
          <div className="bg-gradient-to-br from-[#0F221B] via-[#0B1A14] to-[#0B0D18] border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_8px_20px_rgba(16,185,129,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">KYC Verified</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">{stats.verifiedUsers || 0}</span>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Approved
              </span>
            </div>
          </div>

          {/* Card 3: KYC Pending */}
          <div className="bg-gradient-to-br from-[#241A0F] via-[#1A130B] to-[#0B0D18] border border-amber-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_8px_20px_rgba(245,158,11,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">KYC Pending</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">{stats.pendingKyc || 0}</span>
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Review
              </span>
            </div>
          </div>

          {/* Card 4: User Balances */}
          <div className="bg-gradient-to-br from-[#22122B] via-[#170C1E] to-[#0B0D18] border border-purple-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-[0_8px_20px_rgba(168,85,247,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">User Balances</span>
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-lg font-black bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent font-mono tracking-tight">
                ${(stats.totalUserBalances || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] text-purple-300 font-bold px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                USDT
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TAB SWAPPER PILL BAR ================= */}
      <nav className="flex items-center gap-2 px-4 py-3 overflow-x-auto bg-[#0A0B11]/90 backdrop-blur-md border-b border-white/5 no-scrollbar sticky top-[61px] z-30 shadow-md">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.02]' 
                  : 'bg-[#141624] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : item.color}`} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-black ${
                  isActive ? 'bg-black text-amber-400' : 'bg-[#202436] text-gray-200 border border-white/10'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ================= MAIN TAB CONTENT AREA ================= */}
      <main className="flex-1 p-4 space-y-4">

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: USERS TAB                                              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <section className="space-y-3.5">
            {/* Search Input Box */}
            <div className="relative bg-[#111320] border border-white/10 rounded-2xl p-0.5 focus-within:border-amber-400/60 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-amber-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Search by UID, Username, or Email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-transparent pl-10 pr-9 py-2.5 text-xs text-white placeholder-gray-500 outline-none font-medium"
                />
                {userSearch && (
                  <button 
                    onClick={() => setUserSearch('')}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Users List Box Cards */}
            {users.length === 0 ? (
              <div className="text-center py-14 bg-gradient-to-b from-[#111320] to-[#0D0E17] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-white">No Users Found</h4>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => {
                  const isVerified = u.kycStatus === 'Verified';
                  const isPending = u.kycStatus === 'Pending';
                  const isFrozen = u.status === 'Frozen';

                  return (
                    <div 
                      key={u.id || u.uid} 
                      className="bg-gradient-to-b from-[#131626] to-[#0E101D] border border-[#23273D] hover:border-amber-500/40 rounded-2xl p-4 space-y-3.5 shadow-xl transition-all relative overflow-hidden"
                    >
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

                      {/* Header row */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-amber-300 font-mono bg-[#1C2036] px-2.5 py-0.5 rounded-lg border border-amber-500/30 shadow-inner">
                              {u.uid}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                              isVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                              isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                              'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                            }`}>
                              {u.kycStatus}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              isFrozen ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}>
                              {u.status}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-gray-100 mt-1">
                            {u.username} <span className="text-gray-400 font-normal">({u.email})</span>
                          </p>
                        </div>
                        
                        {/* Balance Badge */}
                        <div className="bg-[#090B12] border border-emerald-500/30 rounded-xl px-3 py-1.5 text-right shadow-inner">
                          <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block">Balance</span>
                          <p className="text-sm font-black text-emerald-400 font-mono tracking-tight">${(u.balance || 0).toFixed(2)} USDT</p>
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-gray-300 bg-[#090A10] p-2.5 rounded-xl border border-white/5 text-center">
                        <div>Country: <strong className="text-white block font-semibold">{u.country || 'Global'}</strong></div>
                        <div>VIP Level: <strong className="text-amber-400 block font-semibold">{u.vipLevel || 'VIP 1'}</strong></div>
                        <div>Joined: <strong className="text-gray-300 block font-mono">{u.createdAt || 'N/A'}</strong></div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-0.5">
                        <button
                          onClick={() => setBalanceModal({ open: true, user: u, action: 'add', amount: '', note: '' })}
                          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)] active:scale-95 transition-all cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>+ Add</span>
                        </button>

                        <button
                          onClick={() => setBalanceModal({ open: true, user: u, action: 'deduct', amount: '', note: '' })}
                          className="bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 text-red-300 border border-red-500/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.15)] active:scale-95 transition-all cursor-pointer"
                        >
                          <MinusCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>- Deduct</span>
                        </button>

                        <button
                          onClick={() => {
                            const kycSub = kycSubmissions.find(k => k.uid === u.uid) || {
                              kycId: u.kycId || u.id,
                              uid: u.uid,
                              username: u.username,
                              email: u.email,
                              country: u.country,
                              idNumber: u.idNumber,
                              documentType: u.documentType,
                              kycStatus: u.kycStatus,
                              idFront: u.idFront,
                              idBack: u.idBack,
                              submittedDate: u.submittedDate
                            };
                            setKycModal({ open: true, submission: kycSub });
                          }}
                          className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border border-amber-500/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.15)] active:scale-95 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>KYC Info</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: KYC APPROVE TAB                                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'kyc' && (
          <section className="space-y-3.5">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between bg-[#111320] border border-white/10 p-1.5 rounded-2xl shadow-inner">
              <button
                onClick={() => setKycFilter('pending')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  kycFilter === 'pending' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pending Review ({pendingKycCount})
              </button>
              <button
                onClick={() => setKycFilter('all')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  kycFilter === 'all' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Applications ({kycSubmissions.length})
              </button>
            </div>

            {/* KYC Applications List */}
            {filteredKyc.length === 0 ? (
              <div className="text-center py-14 bg-gradient-to-b from-[#111320] to-[#0D0E17] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">No KYC Submissions</h4>
                <p className="text-xs text-gray-400 mt-1">There are no {kycFilter} applications to display.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredKyc.map((k) => (
                  <div key={k.kycId || k.uid} className="bg-gradient-to-b from-[#131626] to-[#0E101D] border border-[#23273D] rounded-2xl p-4 space-y-3.5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>

                    {/* Applicant Header */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-300 font-mono bg-[#1C2036] px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                            {k.uid}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            k.kycStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            k.kycStatus === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}>
                            {k.kycStatus}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-100 mt-1.5">{k.username}</p>
                        <p className="text-[10px] text-gray-400">{k.email}</p>
                      </div>

                      <div className="text-right text-[10px] text-gray-400">
                        <span>Submitted</span>
                        <p className="font-mono text-gray-200 font-bold">{k.submittedDate}</p>
                      </div>
                    </div>

                    {/* Document Metadata Strip */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300 bg-[#090A10] p-2.5 rounded-xl border border-white/5">
                      <div>Country: <strong className="text-white">{k.country || 'N/A'}</strong></div>
                      <div>Doc Type: <strong className="text-white">{k.documentType || 'ID Card'}</strong></div>
                      <div className="col-span-2">ID Number: <strong className="text-amber-300 font-mono font-bold">{k.idNumber || 'N/A'}</strong></div>
                    </div>

                    {/* Document Thumbnails */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <span className="text-[9px] text-amber-400 uppercase font-black flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>ID Front</span>
                        </span>
                        <div 
                          onClick={() => setKycModal({ open: true, submission: k })}
                          className="h-24 bg-[#0A0C14] border border-[#23273D] hover:border-amber-400/50 rounded-xl overflow-hidden cursor-pointer relative group transition-all"
                        >
                          <img src={k.idFront} alt="ID Front" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-6 h-6 text-amber-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-amber-400 uppercase font-black flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>ID Back</span>
                        </span>
                        <div 
                          onClick={() => setKycModal({ open: true, submission: k })}
                          className="h-24 bg-[#0A0C14] border border-[#23273D] hover:border-amber-400/50 rounded-xl overflow-hidden cursor-pointer relative group transition-all"
                        >
                          <img src={k.idBack} alt="ID Back" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-6 h-6 text-amber-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {k.kycStatus === 'Pending' ? (
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => handleKycAction(k.kycId, k.uid, 'approve')}
                          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve KYC</span>
                        </button>

                        <button
                          onClick={() => handleKycAction(k.kycId, k.uid, 'decline')}
                          className="w-full bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 text-red-300 border border-red-500/40 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-gray-400 bg-[#090A10] rounded-xl border border-white/5">
                        Status: <span className={k.kycStatus === 'Verified' ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>{k.kycStatus}</span>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: WITHDRAW REQUESTS TAB                                 */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'withdrawals' && (
          <section className="space-y-3.5">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between bg-[#111320] border border-white/10 p-1.5 rounded-2xl shadow-inner">
              <button
                onClick={() => setWithdrawFilter('pending')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  withdrawFilter === 'pending' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pending ({pendingWdrCount})
              </button>
              <button
                onClick={() => setWithdrawFilter('all')}
                className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                  withdrawFilter === 'all' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Requests ({withdrawRequests.length})
              </button>
            </div>

            {/* Requests List */}
            {filteredWithdrawals.length === 0 ? (
              <div className="text-center py-14 bg-gradient-to-b from-[#111320] to-[#0D0E17] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <ArrowUpRight className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">No Withdrawal Requests</h4>
                <p className="text-xs text-gray-400 mt-1">There are no {withdrawFilter} requests to process.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredWithdrawals.map((w) => (
                  <div key={w.id || w.withdrawalId} className="bg-gradient-to-b from-[#131626] to-[#0E101D] border border-[#23273D] rounded-2xl p-4 space-y-3.5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

                    {/* Top Row */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-300 font-mono bg-[#1C2036] px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                            {w.uid}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            w.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            w.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-100 mt-1.5">{w.username || w.email}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-amber-300 font-mono">${w.amount} {w.coin}</span>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{w.time}</p>
                      </div>
                    </div>

                    {/* Destination details strip */}
                    <div className="space-y-1.5 text-[10px] bg-[#090A10] p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-gray-400">
                        <span>Network:</span>
                        <span className="text-white font-bold">{w.network}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>User KYC:</span>
                        <span className={`font-extrabold ${w.kycStatus === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{w.kycStatus}</span>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-gray-400 block mb-1">Destination Address:</span>
                        <p className="font-mono text-gray-200 break-all bg-[#05060A] p-2 rounded-lg border border-white/10 select-all shadow-inner">
                          {w.address}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {w.status === 'Pending' ? (
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => handleWithdrawAction(w.withdrawalId || w.id, 'approve')}
                          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => handleWithdrawAction(w.withdrawalId || w.id, 'reject')}
                          className="w-full bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 text-red-300 border border-red-500/40 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject & Refund</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-gray-400 bg-[#090A10] rounded-xl border border-white/5">
                        Processed Status: <span className={w.status === 'Approved' ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>{w.status}</span>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SUPPORT TAB                                            */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'support' && (
          <section className="space-y-3.5">
            {selectedTicket ? (
              /* Active Ticket Chat View */
              <div className="bg-gradient-to-b from-[#131626] to-[#0E101D] border border-[#23273D] rounded-2xl p-4 space-y-4 shadow-xl">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-xs text-amber-300 hover:text-amber-200 font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Support Tickets
                </button>

                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-amber-300 bg-[#1C2036] px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {selectedTicket.ticket_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      selectedTicket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2">{selectedTicket.subject}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">User Email: <strong className="text-gray-200">{selectedTicket.user_email}</strong></p>
                </div>

                {/* User Message Bubble */}
                <div className="bg-[#090A10] border border-amber-500/30 rounded-2xl p-3.5 space-y-1.5 shadow-inner">
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">User Query:</span>
                  <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Admin Reply Bubble if resolved */}
                {selectedTicket.reply && (
                  <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-3.5 space-y-1.5 shadow-inner">
                    <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">Admin Response Sent:</span>
                    <p className="text-xs text-purple-200 leading-relaxed whitespace-pre-wrap">{selectedTicket.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSupportReply} className="space-y-3 pt-2 border-t border-white/10">
                  <label className="text-xs font-extrabold text-gray-200 block">Send Response to User</label>
                  <textarea
                    rows={3}
                    placeholder="Type your official support reply here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-[#07080D] border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400 transition-colors resize-none shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!replyMessage.trim()}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply & Resolve Ticket</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Tickets List View */
              <div className="space-y-3">
                {supportTickets.length === 0 ? (
                  <div className="text-center py-14 bg-gradient-to-b from-[#111320] to-[#0D0E17] border border-white/10 rounded-3xl p-6 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-7 h-7 text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">No Support Tickets</h4>
                    <p className="text-xs text-gray-400 mt-1">No customer support queries submitted yet.</p>
                  </div>
                ) : (
                  supportTickets.map((t) => {
                    const isOpen = t.status === 'open' || t.status === 'Open';
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="bg-gradient-to-b from-[#131626] to-[#0E101D] hover:border-purple-500/40 border border-[#23273D] rounded-2xl p-4 space-y-2.5 cursor-pointer transition-all shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-amber-300 bg-[#1C2036] px-2 py-0.5 rounded-lg border border-amber-500/30">
                            {t.ticket_code}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                            isOpen ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{t.user_email}</p>
                        </div>

                        <p className="text-xs text-gray-300 line-clamp-2 bg-[#090A10] p-2.5 rounded-xl border border-white/5">
                          {t.message}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                          <span>{new Date(t.created_at || Date.now()).toLocaleDateString()}</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            Reply Ticket <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        )}

      </main>

      {/* ================= MODAL 1: BALANCE ADD / DEDUCT ================= */}
      {balanceModal.open && balanceModal.user && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#141728] to-[#0E101D] border border-white/15 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-[0_25px_50px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                {balanceModal.action === 'add' ? (
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                    <MinusCircle className="w-4 h-4 text-red-400" />
                  </div>
                )}
                <span>{balanceModal.action === 'add' ? 'Add USDT Balance' : 'Deduct USDT Balance'}</span>
              </h3>
              <button
                onClick={() => setBalanceModal({ open: false, user: null, action: 'add', amount: '', note: '' })}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs bg-[#090A10] p-3 rounded-2xl border border-white/5">
              <p className="text-gray-300">Target User: <strong className="text-white font-bold">{balanceModal.user.username}</strong> ({balanceModal.user.uid})</p>
              <p className="text-gray-300">Current Balance: <strong className="text-emerald-400 font-mono font-black">${(balanceModal.user.balance || 0).toFixed(2)} USDT</strong></p>
            </div>

            <form onSubmit={handleBalanceSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-extrabold text-gray-300 block mb-1">Amount (USDT)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={balanceModal.amount}
                  onChange={(e) => setBalanceModal({ ...balanceModal, amount: e.target.value })}
                  className="w-full bg-[#07080D] border border-white/15 rounded-2xl p-3.5 text-sm text-white font-mono placeholder-gray-600 outline-none focus:border-amber-400 transition-colors shadow-inner font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-gray-300 block mb-1">Admin Note / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Deposit credit or adjustment"
                  value={balanceModal.note}
                  onChange={(e) => setBalanceModal({ ...balanceModal, note: e.target.value })}
                  className="w-full bg-[#07080D] border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-gray-600 outline-none focus:border-amber-400 transition-colors shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setBalanceModal({ open: false, user: null, action: 'add', amount: '', note: '' })}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-2xl text-xs transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`font-black py-3 rounded-2xl text-xs text-black shadow-lg transition-all active:scale-95 cursor-pointer ${
                    balanceModal.action === 'add' 
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 shadow-emerald-500/20' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white shadow-red-500/20'
                  }`}
                >
                  Confirm {balanceModal.action === 'add' ? 'Addition' : 'Deduction'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: KYC DETAILS ================= */}
      {kycModal.open && kycModal.submission && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#141728] to-[#0E101D] border border-white/15 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-[0_25px_50px_rgba(0,0,0,0.9)] my-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>KYC Application Details</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">UID: {kycModal.submission.uid}</p>
              </div>

              <button
                onClick={() => setKycModal({ open: false, submission: null })}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#090A10] p-3 rounded-2xl border border-white/5">
              <div>Name: <strong className="text-white font-bold">{kycModal.submission.username}</strong></div>
              <div>Country: <strong className="text-white font-bold">{kycModal.submission.country || 'N/A'}</strong></div>
              <div>Doc Type: <strong className="text-white font-bold">{kycModal.submission.documentType || 'ID Card'}</strong></div>
              <div>ID Number: <strong className="text-amber-300 font-mono font-extrabold">{kycModal.submission.idNumber || 'N/A'}</strong></div>
              <div className="col-span-2 text-[10px] text-gray-400 pt-1.5 border-t border-white/5">
                Submitted Date: <span className="text-gray-200 font-mono font-bold">{kycModal.submission.submittedDate || 'N/A'}</span>
              </div>
            </div>

            {/* Document Images */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-amber-400 uppercase">ID Front Document</span>
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#06070B] shadow-inner">
                  <img src={kycModal.submission.idFront} alt="ID Front" className="w-full max-h-56 object-contain" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-amber-400 uppercase">ID Back Document</span>
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#06070B] shadow-inner">
                  <img src={kycModal.submission.idBack} alt="ID Back" className="w-full max-h-56 object-contain" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {kycModal.submission.kycStatus === 'Pending' ? (
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleKycAction(kycModal.submission.kycId, kycModal.submission.uid, 'approve')}
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 text-black font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve KYC</span>
                </button>

                <button
                  onClick={() => handleKycAction(kycModal.submission.kycId, kycModal.submission.uid, 'decline')}
                  className="bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 text-red-300 border border-red-500/40 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2.5 text-xs font-extrabold bg-[#090A10] rounded-2xl border border-white/5 text-gray-400">
                KYC Status: <span className={kycModal.submission.kycStatus === 'Verified' ? 'text-emerald-400' : 'text-red-400'}>{kycModal.submission.kycStatus}</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
