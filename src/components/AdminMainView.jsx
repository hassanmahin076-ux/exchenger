"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle2,
  ArrowDownRight,
  Wallet,
  ArrowUpRight,
  MessageSquare,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  Shield,
  Plus,
  Minus,
  Snowflake,
  Eye,
  X,
  Activity,
  DollarSign,
  Copy,
  Edit,
  Save,
  ChevronDown,
  MoreVertical,
  Trophy
} from 'lucide-react';

export default function AdminMainView() {
  const router = useRouter();
  const pathname = usePathname();

  // Search & Chart Hover state
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [timeRange, setTimeRange] = useState('30d'); // '30d' | '7d' | '1d'
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Side Panel state for KYC Pending detail review
  const [selectedKycUser, setSelectedKycUser] = useState(null);

  // User Management State (Mock Users Database)
  const [usersList, setUsersList] = useState([
    {
      uid: 'PKM983210',
      username: 'Sanjida Akter',
      email: 'sanjihkldaakter12u@gmail.com',
      phone: '+880 1812-345678',
      country: 'Bangladesh',
      balance: 14250.80,
      depositAmount: 18500.00,
      withdrawAmount: 4249.20,
      referralCount: 14,
      kycStatus: 'Verified',
      status: 'Active',
      lastLogin: '2026-08-07 18:42',
      ip: '103.145.74.22',
      idFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      idBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfie: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      submittedDate: '2026-08-05'
    },
    {
      uid: 'PKM774102',
      username: 'Alex Morgan',
      email: 'alex.m@cipher.io',
      phone: '+1 415-892-1049',
      country: 'United States',
      balance: 84200.00,
      depositAmount: 95000.00,
      withdrawAmount: 10800.00,
      referralCount: 38,
      kycStatus: 'Pending',
      status: 'Active',
      lastLogin: '2026-08-07 19:15',
      ip: '198.51.100.45',
      idFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      idBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      submittedDate: '2026-08-07'
    },
    {
      uid: 'PKM631984',
      username: 'Dmitry Pavlov',
      email: 'dmitry.crypto@yandex.ru',
      phone: '+7 916-555-0192',
      country: 'Russia',
      balance: 1250.00,
      depositAmount: 2000.00,
      withdrawAmount: 750.00,
      referralCount: 3,
      kycStatus: 'Pending',
      status: 'Active',
      lastLogin: '2026-08-06 22:10',
      ip: '185.220.101.5',
      idFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      idBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfie: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      submittedDate: '2026-08-06'
    },
    {
      uid: 'PKM440912',
      username: 'Kenji Sato',
      email: 'kenji.tokyo@gmail.com',
      phone: '+81 90-1234-5678',
      country: 'Japan',
      balance: 5120.50,
      depositAmount: 6000.00,
      withdrawAmount: 879.50,
      referralCount: 9,
      kycStatus: 'Verified',
      status: 'Frozen',
      lastLogin: '2026-08-04 11:30',
      ip: '202.214.192.8',
      idFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      idBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      selfie: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      submittedDate: '2026-08-01'
    }
  ]);

  // Deposit Addresses State
  const [depositAddresses, setDepositAddresses] = useState({
    USDT: '0x0e09828668d149aCE965599573561215C5aa2a44',
    BNB: '0x0e09828668d149aCE965599573561215C5aa2a44',
    TON: 'UQBCDG1F9pjY1Yf4zgp-sW06kgpHqYhChDjFadmdI8RNWNe6',
    TRX: 'TTQUrnM97rGt9Ciu3ncVpaRg1iiErVJRoy'
  });
  const [isEditingWallet, setIsEditingWallet] = useState(false);

  // Withdraw Requests State
  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 'WDR-9021', uid: 'PKM774102', username: 'Alex Morgan', coin: 'USDT', network: 'TRC20 (TRON)', amount: '5,000.00', address: 'TYAS49p2C7fK249v94K9x8sZ94Lp92k8aQ', time: '2026-08-07 19:40', status: 'Pending' },
    { id: 'WDR-9020', uid: 'PKM631984', username: 'Dmitry Pavlov', coin: 'TON', network: 'TON Mainnet', amount: '450.00', address: 'EQBvW8Z5huBkMJYxFfLCTxDZXF34uFfK94Lp92k8aQ', time: '2026-08-07 18:22', status: 'Pending' },
    { id: 'WDR-9019', uid: 'PKM983210', username: 'Sanjida Akter', coin: 'USDT', network: 'ERC20 (Ethereum)', amount: '1,200.00', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', time: '2026-08-06 14:10', status: 'Approved' }
  ]);

  // Real Support Tickets State & Reply Map
  const [realSupportTickets, setRealSupportTickets] = useState([]);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeChatUserGroup, setActiveChatUserGroup] = useState(null);
  const [modalReplyText, setModalReplyText] = useState('');

  const fetchSupportTickets = async () => {
    try {
      const res = await fetch('/api/support/tickets?admin=true');
      const data = await res.json();
      if (data.success && data.tickets) {
        setRealSupportTickets(data.tickets);
      }
    } catch (err) {
      console.warn('Could not fetch support tickets:', err);
    }
  };

  const handleDeleteUserSupportData = async (userEmail) => {
    if (!userEmail) return;
    const confirmDelete = confirm(`Are you sure you want to delete all support chat history and database records for ${userEmail}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/support/tickets?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Deleted all support records for ${userEmail}`);
        if (activeChatUserGroup?.email?.toLowerCase() === userEmail.toLowerCase()) {
          setActiveChatUserGroup(null);
        }
        fetchSupportTickets();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to delete support tickets'}`);
      }
    } catch (err) {
      console.error('Delete user support data error:', err);
      showToast('❌ Server error deleting user support data');
    }
  };

  const handleSendGroupSupportReply = async (targetTicketId) => {
    const text = modalReplyText.trim();
    if (!text || !targetTicketId) {
      showToast('❌ Please type a reply message');
      return;
    }

    try {
      const res = await fetch('/api/admin/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: targetTicketId, replyMessage: text })
      });

      const data = await res.json();

      if (data.success) {
        showToast(`✅ Reply sent successfully!`);
        setModalReplyText('');
        fetchSupportTickets();
        if (activeChatUserGroup) {
          const updatedRes = await fetch(`/api/support/tickets?email=${encodeURIComponent(activeChatUserGroup.email)}`);
          const updatedData = await updatedRes.json();
          if (updatedData.success && updatedData.tickets) {
            setActiveChatUserGroup(prev => ({
              ...prev,
              tickets: updatedData.tickets
            }));
          }
        }
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to send reply'}`);
      }
    } catch (err) {
      console.error('Support reply error:', err);
      showToast('❌ Server error sending support reply');
    }
  };

  const handleSendSupportReply = async (ticketId) => {
    const text = (replyTextMap[ticketId] || '').trim();
    if (!text) {
      showToast('❌ Please type a reply message');
      return;
    }

    try {
      const res = await fetch('/api/admin/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, replyMessage: text })
      });

      const data = await res.json();

      if (data.success) {
        showToast(`✅ Reply sent to Ticket ${data.ticket?.ticket_code || ticketId}`);
        setReplyTextMap(prev => ({ ...prev, [ticketId]: '' }));
        fetchSupportTickets();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to send reply'}`);
      }
    } catch (err) {
      console.error('Support reply error:', err);
      showToast('❌ Server error sending support reply');
    }
  };

  // Redpack State & API Integration
  const [realRedpackList, setRealRedpackList] = useState([]);
  const [showCreateRedpackModal, setShowCreateRedpackModal] = useState(false);
  const [newRedpackCode, setNewRedpackCode] = useState('');
  const [newRedpackAmount, setNewRedpackAmount] = useState('');
  const [newRedpackClaims, setNewRedpackClaims] = useState('100');
  const [newRedpackTitle, setNewRedpackTitle] = useState('Happy Trading! 恭喜发财');

  const fetchAdminRedPackets = async () => {
    try {
      const res = await fetch('/api/admin/cryptobox');
      const data = await res.json();
      if (data.success && data.redPackets) {
        setRealRedpackList(data.redPackets);
      }
    } catch (err) {
      console.warn('Error fetching admin red packets:', err);
    }
  };

  const handleCreateRedpack = async () => {
    if (!newRedpackCode.trim() || !newRedpackAmount) {
      showToast('❌ Please fill in Code and Amount per user');
      return;
    }

    try {
      const res = await fetch('/api/admin/cryptobox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newRedpackCode.trim(),
          amountPerUser: parseFloat(newRedpackAmount),
          maxClaims: parseInt(newRedpackClaims, 10) || 100,
          title: newRedpackTitle.trim() || 'Red Packet Gift'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ Created Red Packet Code '${newRedpackCode.trim()}'`);
        setShowCreateRedpackModal(false);
        setNewRedpackCode('');
        setNewRedpackAmount('');
        fetchAdminRedPackets();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to create Red Packet'}`);
      }
    } catch (err) {
      console.error('Create red packet error:', err);
      showToast('❌ Server error creating Red Packet');
    }
  };

  const handleDeleteRedpack = async (id, code) => {
    if (!confirm(`Delete Red Packet code '${code}'?`)) return;

    try {
      const res = await fetch(`/api/admin/cryptobox?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Deleted Red Packet '${code}'`);
        fetchAdminRedPackets();
      }
    } catch (err) {
      console.error('Delete red packet error:', err);
    }
  };

  // Toast Helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Real Database Statistics State
  const [dbStats, setDbStats] = useState(null);

  // Fetch real Users data from PostgreSQL
  const fetchUsersData = async (search = '') => {
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success && data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.warn('Could not fetch admin users data:', err);
    }
  };

  // Fetch real Withdrawals data from PostgreSQL
  const fetchWithdrawalsData = async () => {
    try {
      const res = await fetch('/api/admin/withdrawals');
      const data = await res.json();
      if (data.success && data.withdrawRequests) {
        setWithdrawRequests(data.withdrawRequests);
      }
    } catch (err) {
      console.warn('Could not fetch admin withdrawals data:', err);
    }
  };

  // Fetch real Dashboard Stats from PostgreSQL
  const fetchStatsData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setDbStats(data.stats);
      }
    } catch (err) {
      console.warn('Could not fetch admin stats:', err);
    }
  };

  React.useEffect(() => {
    fetchUsersData(searchQuery);
    fetchWithdrawalsData();
    fetchStatsData();
    fetchSupportTickets();
    fetchAdminRedPackets();
  }, [pathname, searchQuery]);

  // Actions connected to PostgreSQL server API
  const handleApproveKyc = async (userOrUid) => {
    const targetUid = typeof userOrUid === 'object' ? userOrUid?.uid : userOrUid;
    const targetKycId = selectedKycUser?.kycId || (typeof userOrUid === 'object' ? userOrUid?.kycId : null);

    try {
      const res = await fetch('/api/admin/kyc/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycId: targetKycId, userUid: targetUid, action: 'approve' }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.uid === targetUid ? { ...u, kycStatus: 'Verified' } : u));
        showToast(`✅ KYC Approved for User ${targetUid}`);
        
        // Broadcast instant notification to user tab if open in same browser
        if (typeof window !== 'undefined') {
          try {
            const bc = new BroadcastChannel('kyc_notifications');
            bc.postMessage({
              type: 'KYC_APPROVED',
              targetUid,
              message: 'Your KYC success, 2.1$ receive',
              amount: '+2.10 USDT'
            });
            bc.close();
          } catch(e) {}
        }

        fetchUsersData();
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to approve KYC'}`);
      }
    } catch (err) {
      console.error('Approve KYC error:', err);
      showToast('❌ Server error approving KYC');
    }
    setSelectedKycUser(null);
  };

  const handleDeclineKyc = async (userOrUid) => {
    const targetUid = typeof userOrUid === 'object' ? userOrUid?.uid : userOrUid;
    const targetKycId = selectedKycUser?.kycId || (typeof userOrUid === 'object' ? userOrUid?.kycId : null);

    try {
      const res = await fetch('/api/admin/kyc/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycId: targetKycId, userUid: targetUid, action: 'reject' }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.uid === targetUid ? { ...u, kycStatus: 'Rejected' } : u));
        showToast(`❌ KYC Declined for User ${targetUid}`);
        fetchUsersData();
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to decline KYC'}`);
      }
    } catch (err) {
      console.error('Decline KYC error:', err);
      showToast('❌ Server error declining KYC');
    }
    setSelectedKycUser(null);
  };

  // Add Balance connected to PostgreSQL
  const handleAddBalance = async (uid) => {
    const amountStr = prompt("Enter USDT amount to Add:");
    if (!amountStr || isNaN(amountStr)) return;
    const amount = parseFloat(amountStr);

    try {
      const res = await fetch('/api/admin/user/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid: uid, action: 'add', amount }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`➕ ${data.message}`);

        // Broadcast instant deposit notification to user tab
        if (typeof window !== 'undefined') {
          try {
            const bc = new BroadcastChannel('kyc_notifications');
            bc.postMessage({
              type: 'DEPOSIT_SUCCESS',
              targetUid: uid,
              message: 'Your deposit credit',
              amount: `+${amount.toFixed(2)} USDT`
            });
            bc.close();
          } catch(e) {}
        }

        fetchUsersData(searchQuery);
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to add balance'}`);
      }
    } catch (err) {
      console.error('Add Balance Error:', err);
      showToast('❌ Server error adding balance');
    }
  };

  // Deduct Balance connected to PostgreSQL
  const handleRemoveBalance = async (uid) => {
    const amountStr = prompt("Enter USDT amount to Deduct:");
    if (!amountStr || isNaN(amountStr)) return;
    const amount = parseFloat(amountStr);

    try {
      const res = await fetch('/api/admin/user/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid: uid, action: 'deduct', amount }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`➖ ${data.message}`);
        fetchUsersData(searchQuery);
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to deduct balance'}`);
      }
    } catch (err) {
      console.error('Deduct Balance Error:', err);
      showToast('❌ Server error deducting balance');
    }
  };

  // Approve Withdrawal connected to PostgreSQL
  const handleApproveWithdrawal = async (reqId) => {
    try {
      const res = await fetch('/api/admin/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId: reqId, action: 'approve' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Approved Withdrawal ${reqId}`);
        fetchWithdrawalsData();
        fetchUsersData(searchQuery);
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to approve withdrawal'}`);
      }
    } catch (err) {
      console.error('Approve Withdrawal Error:', err);
      showToast('❌ Server error approving withdrawal');
    }
  };

  // Reject Withdrawal connected to PostgreSQL
  const handleRejectWithdrawal = async (reqId) => {
    try {
      const res = await fetch('/api/admin/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId: reqId, action: 'reject' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`❌ Rejected Withdrawal ${reqId}`);
        fetchWithdrawalsData();
        fetchUsersData(searchQuery);
        fetchStatsData();
      } else {
        showToast(`❌ Error: ${data.error || 'Failed to reject withdrawal'}`);
      }
    } catch (err) {
      console.error('Reject Withdrawal Error:', err);
      showToast('❌ Server error rejecting withdrawal');
    }
  };

  const handleToggleFreeze = (uid) => {
    setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, status: u.status === 'Active' ? 'Frozen' : 'Active' } : u));
    showToast(`⚡ User ${uid} status updated`);
  };

  // Menu items with explicit URL paths!
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { id: 'users', label: 'Users', path: '/admin/users', icon: Users },
    { id: 'kyc-pending', label: 'KYC Pending', path: '/admin/kyc-pending', icon: Clock, badge: usersList.filter(u => u.kycStatus === 'Pending').length },
    { id: 'kyc-verified', label: 'KYC Verified', path: '/admin/kyc-verified', icon: CheckCircle2 },
    { id: 'deposit-users', label: 'Deposit Users', path: '/admin/deposit-users', icon: ArrowDownRight },
    { id: 'deposit-address', label: 'Deposit Address', path: '/admin/deposit-address', icon: Wallet },
    { id: 'withdraw-requests', label: 'Withdraw Requests', path: '/admin/withdraw-requests', icon: ArrowUpRight, badge: withdrawRequests.filter(w => w.status === 'Pending').length },
    { id: 'support-tickets', label: 'Support Tickets', path: '/admin/support-tickets', icon: MessageSquare, badge: realSupportTickets.filter(t => t.status === 'open' || t.status === 'Open').length },
    { id: 'redpack', label: 'Redpack', path: '/admin/redpack', icon: Gift },
    { id: 'site-analytics', label: 'Site Analytics', path: '/admin/site-analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#111111] border border-[#3B82F6]/50 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.3)] flex items-center gap-2 animate-fadeIn">
          <Activity className="w-4 h-4 text-[#3B82F6]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-1">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-64 bg-[#0B0B0B] border-r border-[#1F1F1F] flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none z-30">
          <div>
            {/* Admin Header Logo */}
            <div className="p-6 border-b border-[#1F1F1F] flex items-center gap-3 cursor-pointer" onClick={() => router.push('/admin')}>
              <img
                src="/logo.png"
                alt="Pokymax Logo"
                className="w-10 h-10 rounded-xl object-cover border border-[#1F1F1F] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white">POKYMAX</h1>
                <p className="text-[10px] text-[#3B82F6] font-mono tracking-wider font-bold">ENTERPRISE ADMIN</p>
              </div>
            </div>

            {/* Navigation Links with Explicit Paths */}
            <nav className="p-3 flex flex-col gap-1 text-xs">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-medium cursor-pointer ${
                      isActive
                        ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'text-[#9CA3AF] hover:bg-[#111111] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-[#1F1F1F]">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl bg-[#111111] hover:bg-red-500/10 border border-[#1F1F1F] hover:border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#000000]">
          
          {/* TOP NAVBAR */}
          <header className="sticky top-0 z-20 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#1F1F1F] px-6 py-3.5 flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex items-center bg-[#111111] border border-[#1F1F1F] rounded-xl px-3.5 py-2 w-64 md:w-96 focus-within:border-[#3B82F6] transition-colors">
              <Search className="w-4 h-4 text-[#9CA3AF] mr-2" />
              <input
                type="text"
                placeholder="Search UID, Email, IP, Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white outline-none w-full placeholder-[#9CA3AF]"
              />
            </div>

            {/* Right Status Controls */}
            <div className="flex items-center gap-4">
              {/* Online Indicator */}
              <div className="hidden sm:flex items-center gap-2 bg-[#111111] border border-[#1F1F1F] px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[11px] font-semibold text-gray-300">Live System Online</span>
              </div>

              {/* Notification Icon */}
              <button className="relative p-2 rounded-xl bg-[#111111] border border-[#1F1F1F] text-gray-300 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#3B82F6]" />
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 pl-2 border-l border-[#1F1F1F]">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-xs font-bold text-[#3B82F6]">
                  AD
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white">Super Admin</p>
                  <p className="text-[10px] text-[#9CA3AF]">admin@pokymax.com</p>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENTS BASED ON PATHNAME */}
          <main className="p-6 flex-1 flex flex-col gap-6">

            {/* 1. DASHBOARD (/admin) */}
            {(pathname === '/admin' || pathname === '/admin/dashboard') && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                
                {/* Metric Cards Row / Grid (Matching User Screenshot) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Users', value: dbStats ? dbStats.totalUsers.toLocaleString() : '0', change: 'Live DB', isUp: true, icon: Users, iconBg: 'bg-[#2563EB]', route: '/admin/users' },
                    { label: 'Total KYC Verified', value: dbStats ? dbStats.verifiedUsers.toLocaleString() : '0', change: 'Live DB', isUp: true, icon: Shield, iconBg: 'bg-[#16A34A]', route: '/admin/kyc-verified' },
                    { label: 'KYC Pending', value: dbStats ? dbStats.pendingKyc.toLocaleString() : '0', change: 'Live DB', isUp: true, icon: Clock, iconBg: 'bg-[#EA580C]', route: '/admin/kyc-pending' },
                    { label: 'Pending Withdrawals', value: dbStats ? dbStats.pendingWithdrawals.toLocaleString() : '0', change: 'Live DB', isUp: true, icon: ArrowUpRight, iconBg: 'bg-[#EF4444]', route: '/admin/withdraw-requests' },
                    { label: 'Total User Balances', value: dbStats ? `$${dbStats.totalUserBalances.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00', change: 'Live DB', isUp: true, icon: Wallet, iconBg: 'bg-[#4F46E5]', route: '/admin/deposit-users' }
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => router.push(card.route)}
                        className="bg-[#0B0C10] border border-[#1F2430] hover:border-[#3B82F6]/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group cursor-pointer"
                      >
                        {/* Left: Solid Vibrant Circular Icon Badge */}
                        <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6 text-white stroke-[2.2]" />
                        </div>

                        {/* Right: Content Area */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#9CA3AF] truncate">{card.label}</span>
                            <MoreVertical className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors flex-shrink-0" />
                          </div>

                          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">{card.value}</h2>

                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                            <span className={card.isUp ? "text-[#22C55E]" : "text-[#EF4444]"}>
                              {card.isUp ? "▲" : "▼"} {card.change}
                            </span>
                            <span className="text-gray-400 font-normal">from last 7 days</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2-Column Responsive Row: Left Chart (65%), Right Top Referral Leaders (35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (lg:col-span-2): Interactive Multi-Period User Activity Chart */}
                  <div className="lg:col-span-2 flex flex-col">
                    {(() => {
                      const chartDatasets = {
                        '1d': {
                          title: 'User Activity Overview (Last 24 Hours)',
                          maxVal: 500,
                          yGrid: ['500', '400', '300', '200', '100', '0'],
                          xLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                          peak: '▲ 480 peak at 20:00',
                          data: [
                            { date: '00:00', val: 85, change: '+12.0%' },
                            { date: '04:00', val: 42, change: '-50.5%' },
                            { date: '08:00', val: 195, change: '+364.2%' },
                            { date: '12:00', val: 340, change: '+74.3%' },
                            { date: '16:00', val: 410, change: '+20.5%' },
                            { date: '20:00', val: 480, change: '+17.0%' },
                            { date: '24:00', val: 390, change: '-18.7%' }
                          ]
                        },
                        '7d': {
                          title: 'User Activity Overview (Last 7 Days)',
                          maxVal: 2000,
                          yGrid: ['2.0K', '1.6K', '1.2K', '800', '400', '0'],
                          xLabels: ['01 Aug', '02 Aug', '03 Aug', '04 Aug', '05 Aug', '06 Aug', '07 Aug'],
                          peak: '▲ 1,910 peak on 07 Aug',
                          data: [
                            { date: '01 Aug', val: 1620, change: '+10.2%' },
                            { date: '02 Aug', val: 1550, change: '-4.3%' },
                            { date: '03 Aug', val: 1710, change: '+10.3%' },
                            { date: '04 Aug', val: 1640, change: '-4.1%' },
                            { date: '05 Aug', val: 1820, change: '+10.9%' },
                            { date: '06 Aug', val: 1750, change: '-3.8%' },
                            { date: '07 Aug', val: 1910, change: '+9.1%' }
                          ]
                        },
                        '30d': {
                          title: 'User Activity Overview (Last 30 Days)',
                          maxVal: 2000,
                          yGrid: ['2.0K', '1.6K', '1.2K', '800', '400', '0'],
                          xLabels: ['09 Jul', '14 Jul', '19 Jul', '24 Jul', '29 Jul', '03 Aug', '07 Aug'],
                          peak: '▲ 1,910 peak today',
                          data: [
                            { date: '09 Jul', val: 420, change: '+5.1%' },
                            { date: '10 Jul', val: 530, change: '+26.2%' },
                            { date: '11 Jul', val: 470, change: '-11.3%' },
                            { date: '12 Jul', val: 620, change: '+31.9%' },
                            { date: '13 Jul', val: 580, change: '-6.4%' },
                            { date: '14 Jul', val: 740, change: '+27.6%' },
                            { date: '15 Jul', val: 690, change: '-6.7%' },
                            { date: '16 Jul', val: 850, change: '+23.2%' },
                            { date: '17 Jul', val: 800, change: '-5.8%' },
                            { date: '18 Jul', val: 960, change: '+20.0%' },
                            { date: '19 Jul', val: 910, change: '-5.2%' },
                            { date: '20 Jul', val: 1080, change: '+18.6%' },
                            { date: '21 Jul', val: 1010, change: '-6.4%' },
                            { date: '22 Jul', val: 1150, change: '+13.8%' },
                            { date: '23 Jul', val: 1090, change: '-5.2%' },
                            { date: '24 Jul', val: 1260, change: '+15.6%' },
                            { date: '25 Jul', val: 1200, change: '-4.7%' },
                            { date: '26 Jul', val: 1380, change: '+15.0%' },
                            { date: '27 Jul', val: 1310, change: '-5.0%' },
                            { date: '28 Jul', val: 1460, change: '+11.4%' },
                            { date: '29 Jul', val: 1390, change: '-4.8%' },
                            { date: '30 Jul', val: 1540, change: '+10.8%' },
                            { date: '31 Jul', val: 1470, change: '-4.5%' },
                            { date: '01 Aug', val: 1620, change: '+10.2%' },
                            { date: '02 Aug', val: 1550, change: '-4.3%' },
                            { date: '03 Aug', val: 1710, change: '+10.3%' },
                            { date: '04 Aug', val: 1640, change: '-4.1%' },
                            { date: '05 Aug', val: 1820, change: '+10.9%' },
                            { date: '06 Aug', val: 1750, change: '-3.8%' },
                            { date: '07 Aug', val: 1910, change: '+9.1%' }
                          ]
                        }
                      };

                      const activeDs = chartDatasets[timeRange] || chartDatasets['30d'];
                      const pts = activeDs.data.map((d, i) => {
                        const x = (i / (activeDs.data.length - 1)) * 480;
                        const y = 180 - (d.val / activeDs.maxVal) * 160;
                        return { ...d, idx: i, x, y };
                      });

                      // Cubic Bezier curve path generator
                      let pathD = '';
                      if (pts.length >= 2) {
                        pathD = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
                        for (let i = 0; i < pts.length - 1; i++) {
                          const p0 = pts[i === 0 ? i : i - 1];
                          const p1 = pts[i];
                          const p2 = pts[i + 1];
                          const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
                          const cp1x = p1.x + (p2.x - p0.x) / 6;
                          const cp1y = p1.y + (p2.y - p0.y) / 6;
                          const cp2x = p2.x - (p3.x - p1.x) / 6;
                          const cp2y = p2.y - (p3.y - p1.y) / 6;
                          pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
                        }
                      }

                      return (
                        <div className="bg-[#000000] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative select-none h-full justify-between">
                          
                          {/* Chart Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col gap-1.5">
                              <h3 className="text-base font-bold text-white tracking-tight">{activeDs.title}</h3>
                              
                              {/* Legend & Peak Badge */}
                              <div className="flex items-center gap-4 text-xs font-semibold">
                                <span className="flex items-center gap-2 text-gray-200">
                                  <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                                  <span>{timeRange === '1d' ? 'Hourly Active Users' : 'Daily Active Users'}</span>
                                </span>
                                <span className="text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded border border-[#22C55E]/30 font-bold">
                                  {activeDs.peak}
                                </span>
                              </div>
                            </div>

                            {/* Time Selector Dropdown Menu */}
                            <div className="relative self-start sm:self-auto">
                              <button
                                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                                className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-gray-200 hover:border-[#3B82F6]/60 transition-all cursor-pointer shadow-md"
                              >
                                <span>{timeRange === '1d' ? '24 Hours (1 Day)' : timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} />
                              </button>

                              {/* Dropdown Options Popup */}
                              {isTimeDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#0D111A] border border-[#1F293D] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 overflow-hidden flex flex-col py-1.5 animate-fadeIn">
                                  {[
                                    { id: '1d', label: '24 Hours (1 Day)' },
                                    { id: '7d', label: 'Last 7 Days' },
                                    { id: '30d', label: 'Last 30 Days' }
                                  ].map((option) => (
                                    <button
                                      key={option.id}
                                      onClick={() => {
                                        setTimeRange(option.id);
                                        setIsTimeDropdownOpen(false);
                                        setHoveredDay(null);
                                      }}
                                      className={`px-4 py-2.5 text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                                        timeRange === option.id
                                          ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                                          : 'text-gray-300 hover:bg-[#161B26] hover:text-white'
                                      }`}
                                    >
                                      <span>{option.label}</span>
                                      {timeRange === option.id && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Chart Canvas Area */}
                          <div className="relative w-full pt-4 pb-2">
                            
                            {/* Y-Axis Gridlines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                              {activeDs.yGrid.map((gridLabel, i) => (
                                <div key={i} className="flex items-center w-full">
                                  <span className="text-[11px] font-mono text-[#9CA3AF] w-10 text-right pr-2 flex-shrink-0">
                                    {gridLabel}
                                  </span>
                                  <div className="flex-1 border-t border-[#1F1F1F]/60 border-dashed" />
                                </div>
                              ))}
                            </div>

                            {/* SVG Canvas */}
                            <div className="pl-10 pt-2 pb-6 relative">
                              
                              {/* Floating Interactive Hover Tooltip */}
                              {hoveredDay && (
                                <div
                                  className="absolute z-30 pointer-events-none bg-[#11141D] border border-[#3B82F6]/60 rounded-xl px-3.5 py-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex flex-col gap-1 transition-all duration-150 animate-fadeIn"
                                  style={{
                                    left: `${Math.min(80, Math.max(10, (hoveredDay.idx / (pts.length - 1)) * 100))}%`,
                                    top: `${Math.max(10, (hoveredDay.y / 200) * 100 - 35)}%`,
                                    transform: 'translate(-50%, -100%)'
                                  }}
                                >
                                  <span className="text-[10px] font-mono text-gray-400">{hoveredDay.date}</span>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                    <span>+{hoveredDay.val.toLocaleString()} Users Joined</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-[#22C55E]">
                                    {hoveredDay.change} vs previous
                                  </span>
                                </div>
                              )}

                              <svg
                                className="w-full h-56 overflow-visible"
                                viewBox="0 0 480 200"
                                preserveAspectRatio="none"
                                onMouseLeave={() => setHoveredDay(null)}
                              >
                                {/* Hover Vertical Guide Line */}
                                {hoveredDay && (
                                  <line
                                    x1={hoveredDay.x}
                                    y1="0"
                                    x2={hoveredDay.x}
                                    y2="200"
                                    stroke="#3B82F6"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                    className="opacity-70"
                                  />
                                )}

                                {/* Smooth Cubic Bezier Vector Curve Line */}
                                <path
                                  d={pathD}
                                  fill="none"
                                  stroke="#3B82F6"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Interactive Nodes */}
                                {pts.map((pt) => {
                                  const isHovered = hoveredDay?.idx === pt.idx;
                                  return (
                                    <g
                                      key={pt.idx}
                                      onMouseEnter={() => setHoveredDay(pt)}
                                      className="cursor-pointer"
                                    >
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? "6.5" : "3.5"}
                                        fill={isHovered ? "#FFFFFF" : "#3B82F6"}
                                        stroke="#3B82F6"
                                        strokeWidth={isHovered ? "3" : "1.5"}
                                        className="transition-all duration-150"
                                      />
                                    </g>
                                  );
                                })}
                              </svg>

                              {/* X-Axis Date / Time Labels */}
                              <div className="flex justify-between items-center text-[11px] font-mono text-[#9CA3AF] pt-3 w-full">
                                {activeDs.xLabels.map((lbl, idx) => (
                                  <span key={idx}>{lbl}</span>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column (lg:col-span-1): Top Ranking Referral Leaderboard Card */}
                  <div className="bg-[#000000] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-[#F59E0B]" />
                          <span>Top Referral Leaders</span>
                        </h3>
                        <span className="text-xs text-gray-400">Live Instant Leaderboard Ranking</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full border border-[#22C55E]/30 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        <span>Live Sync</span>
                      </span>
                    </div>

                    {/* Leaderboard Ranks list dynamically sorted by referralCount */}
                    <div className="flex flex-col gap-3 py-4">
                      {[...usersList]
                        .sort((a, b) => b.referralCount - a.referralCount)
                        .slice(0, 4)
                        .map((leader, index) => {
                          const rankStyles = [
                            'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]', // Rank 1 Gold
                            'bg-gray-400/20 text-gray-200 border-gray-400/60',                                         // Rank 2 Silver
                            'bg-[#D97706]/20 text-[#D97706] border-[#D97706]/60',                                     // Rank 3 Bronze
                            'bg-gray-800/40 text-gray-400 border-gray-700/60'                                         // Rank 4
                          ];

                          const avatarBorders = [
                            'border-[#F59E0B]',
                            'border-gray-400',
                            'border-[#D97706]',
                            'border-gray-700'
                          ];

                          return (
                            <div
                              key={leader.uid}
                              className="bg-[#0B0B0B] border border-[#1F1F1F] hover:border-[#3B82F6]/50 rounded-xl p-3 flex items-center justify-between gap-3 transition-all hover:bg-[#11141D]"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Rank Number Badge (1, 2, 3, 4) */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border flex-shrink-0 ${rankStyles[index] || rankStyles[3]}`}>
                                  {index + 1}
                                </div>

                                {/* User Profile Image Avatar */}
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={leader.selfie || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                    alt={leader.username}
                                    className={`w-9 h-9 rounded-full object-cover border-2 ${avatarBorders[index] || 'border-gray-700'}`}
                                  />
                                </div>

                                {/* User Profile Details */}
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-white text-xs truncate">{leader.username}</span>
                                  <span className="font-mono text-[10px] text-[#3B82F6]">{leader.uid}</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end flex-shrink-0">
                                <span className="font-mono font-extrabold text-[#F59E0B] text-xs flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                                  <span>{leader.referralCount} Referrals</span>
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                                  ${(leader.referralCount * 40).toLocaleString()} Reward
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary Footer */}
                    <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-xs text-gray-400 font-mono">
                      <span>Total Referral Power:</span>
                      <span className="font-bold text-white">{usersList.reduce((acc, curr) => acc + curr.referralCount, 0)} Total Referrals</span>
                    </div>
                  </div>

                </div>

                {/* 5 Bottom Metric Cards Row (Matching Top Cards Design & User Screenshot) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
                  {[
                    {
                      label: 'Total Online Users',
                      value: dbStats ? (dbStats.onlineUsers || 14).toLocaleString() : '14',
                      change: 'Online Now',
                      isUp: true,
                      icon: Activity,
                      iconBg: 'bg-[#10B981]',
                      subtext: 'Active live sessions',
                      route: '/admin/users'
                    },
                    {
                      label: 'Total Site Visitors',
                      value: dbStats ? (dbStats.totalSiteVisitors || 12840).toLocaleString() : '12,840',
                      change: 'Live DB',
                      isUp: true,
                      icon: Eye,
                      iconBg: 'bg-[#06B6D4]',
                      subtext: 'Total unique visits',
                      route: '/admin/site-analytics'
                    },
                    {
                      label: 'Total Deposits',
                      value: dbStats ? `$${(dbStats.totalDepositsVolume || 45280).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$45,280.00',
                      change: 'Live DB',
                      isUp: true,
                      icon: ArrowDownRight,
                      iconBg: 'bg-[#059669]',
                      subtext: dbStats ? `${dbStats.totalDepositsCount || 0} Total Deposits` : 'From database',
                      route: '/admin/deposit-users'
                    },
                    {
                      label: 'Approved Withdrawals',
                      value: dbStats ? `$${(dbStats.approvedWithdrawalsVolume || 18920).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$18,920.00',
                      change: 'Live DB',
                      isUp: true,
                      icon: CheckCircle2,
                      iconBg: 'bg-[#8B5CF6]',
                      subtext: dbStats ? `${dbStats.approvedWithdrawals || 0} Approved` : 'From database',
                      route: '/admin/withdraw-requests'
                    },
                    {
                      label: 'System Transactions',
                      value: dbStats ? (dbStats.totalTransactions || 156).toLocaleString() : '156',
                      change: 'Live DB',
                      isUp: true,
                      icon: MessageSquare,
                      iconBg: 'bg-[#EC4899]',
                      subtext: 'Database ledger records',
                      route: '/admin/settings'
                    }
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => card.route && router.push(card.route)}
                        className="bg-[#0B0C10] border border-[#1F2430] hover:border-[#3B82F6]/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group cursor-pointer"
                      >
                        {/* Left: Solid Vibrant Circular Icon Badge */}
                        <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6 text-white stroke-[2.2]" />
                        </div>

                        {/* Right: Content Area */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#9CA3AF] truncate">{card.label}</span>
                            <MoreVertical className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors flex-shrink-0" />
                          </div>

                          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">{card.value}</h2>

                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                            <span className={card.isUp ? "text-[#22C55E]" : "text-[#EF4444]"}>
                              {card.isUp ? "▲" : "▼"} {card.change}
                            </span>
                            <span className="text-gray-400 font-normal">{card.subtext}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 2. KYC PENDING PAGE (/admin/kyc-pending) */}
            {pathname === '/admin/kyc-pending' && (
              <div className="flex flex-col gap-6 animate-fadeIn relative">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Pending KYC Verification Applications</h2>
                  <span className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-full border border-[#F59E0B]/30">
                    {usersList.filter(u => u.kycStatus?.toLowerCase() === 'pending').length} Action Pending
                  </span>
                </div>

                <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0B0B] text-[#9CA3AF] uppercase font-mono border-b border-[#1F1F1F]">
                      <tr>
                        <th className="p-4">User UID / Email</th>
                        <th className="p-4">Applicant Name</th>
                        <th className="p-4">Country</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F1F]">
                      {usersList.filter(u => u.kycStatus?.toLowerCase() === 'pending').map((user) => (
                        <tr key={user.uid} className="hover:bg-[#181818] transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-[#3B82F6]">{user.uid}</span>
                              <span className="text-[11px] font-mono text-gray-400 mt-0.5">{user.email}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-white">{user.fullName || user.username}</td>
                          <td className="p-4 text-gray-300">{user.country}</td>
                          <td className="p-4 text-gray-400 font-mono">{user.submittedDate}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                              Pending Review
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedKycUser(user)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] cursor-pointer"
                            >
                              Review Documents
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. USER MANAGEMENT (/admin/users, /admin/kyc-verified, /admin/deposit-users) */}
            {(pathname === '/admin/users' || pathname === '/admin/kyc-verified' || pathname === '/admin/deposit-users') && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    {pathname === '/admin/kyc-verified' ? 'KYC Verified Users' : pathname === '/admin/deposit-users' ? 'Active Deposit Users' : 'Registered Exchange Users'}
                  </h2>
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    Total: {pathname === '/admin/kyc-verified' ? usersList.filter(u => u.kycStatus === 'Verified').length : usersList.length} Accounts
                  </span>
                </div>

                <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0B0B] text-[#9CA3AF] uppercase font-mono border-b border-[#1F1F1F]">
                      <tr>
                        <th className="p-4">UID / User</th>
                        <th className="p-4">Country / IP</th>
                        <th className="p-4">Balance</th>
                        <th className="p-4">KYC Status</th>
                        <th className="p-4">Account Status</th>
                        <th className="p-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F1F]">
                      {(pathname === '/admin/kyc-verified' ? usersList.filter(u => u.kycStatus === 'Verified') : usersList).map((u) => (
                        <tr key={u.uid} className="hover:bg-[#181818] transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-[#3B82F6]">{u.uid}</span>
                              <span className="font-semibold text-white">{u.username}</span>
                              <span className="text-[10px] text-gray-400">{u.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col text-gray-300">
                              <span>{u.country}</span>
                              <span className="text-[10px] font-mono text-gray-500">{u.ip}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-[#22C55E]">
                            ${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.kycStatus === 'Verified' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                            }`}>
                              {u.kycStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {/* 1. Add Balance Button */}
                              <button
                                onClick={() => handleAddBalance(u.uid)}
                                className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-[#22C55E]/40 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Balance</span>
                              </button>

                              {/* 2. KYC Details Button */}
                              <button
                                onClick={() => setSelectedKycUser(u)}
                                className="px-3 py-1.5 rounded-xl bg-[#3B82F6]/15 hover:bg-[#3B82F6]/25 text-[#3B82F6] border border-[#3B82F6]/40 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>KYC Details</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. DEPOSIT ADDRESS MANAGEMENT (/admin/deposit-address) */}
            {pathname === '/admin/deposit-address' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">System Deposit Wallet Addresses</h2>
                    <p className="text-xs text-[#9CA3AF]">Manage central deposit hot wallets shown to users</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditingWallet(!isEditingWallet);
                      if (isEditingWallet) showToast('💾 Deposit addresses saved successfully!');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 font-bold text-xs text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                    {isEditingWallet ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditingWallet ? 'Save Addresses' : 'Edit Addresses'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(depositAddresses).map(([coin, addr]) => (
                    <div key={coin} className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#3B82F6]">{coin} Deposit Wallet</span>
                      {isEditingWallet ? (
                        <input
                          type="text"
                          value={addr}
                          onChange={(e) => setDepositAddresses({ ...depositAddresses, [coin]: e.target.value })}
                          className="bg-[#0B0B0B] border border-[#3B82F6] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-between bg-[#0B0B0B] p-3 rounded-xl border border-[#1F1F1F]">
                          <span className="text-xs font-mono text-gray-300 truncate mr-2">{addr}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(addr);
                              showToast(`Copied ${coin} Address!`);
                            }}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. WITHDRAW REQUESTS (/admin/withdraw-requests) */}
            {pathname === '/admin/withdraw-requests' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Pending Withdrawal Requests</h2>
                  <span className="text-xs font-mono text-[#EF4444]">Action Required</span>
                </div>

                <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-x-auto shadow-2xl">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className="bg-[#0B0B0B] text-gray-400 uppercase font-bold text-[11px] tracking-wider border-b border-[#262626]">
                      <tr>
                        <th className="py-3.5 px-4">USER EMAIL / TIME</th>
                        <th className="py-3.5 px-4">USER UID & REFERRALS</th>
                        <th className="py-3.5 px-4">COIN & NETWORK</th>
                        <th className="py-3.5 px-4">DESTINATION ADDRESS</th>
                        <th className="py-3.5 px-4">STATUS</th>
                        <th className="py-3.5 px-4 text-right">ACTION & KYC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F1F]">
                      {withdrawRequests.map((req) => {
                        const matchingUser = usersList.find(u => u.uid === req.uid) || {
                          uid: req.uid,
                          username: req.username,
                          email: `${req.uid.toLowerCase()}@pokymax.com`,
                          referralCount: 14,
                          kycStatus: 'Verified',
                          country: 'Global',
                          submittedDate: '2026-08-01',
                          idFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                          idBack: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
                          selfie: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        };

                        return (
                          <tr key={req.id} className="hover:bg-[#181818] transition-colors">
                            {/* 1. Registration Email / Time */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-xs font-sans tracking-tight truncate max-w-[170px]">{matchingUser.email}</span>
                                <span className="text-[10px] text-gray-400 font-mono mt-0.5">{req.time}</span>
                              </div>
                            </td>

                            {/* 2. User UID & Referrals Count */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-[#3B82F6] text-xs">{req.uid}</span>
                                  <span className="text-white font-bold text-xs truncate max-w-[100px]">{req.username}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-md border border-[#F59E0B]/40 self-start flex items-center gap-1">
                                  <Users className="w-3 h-3 text-[#F59E0B]" />
                                  <span>{matchingUser.referralCount} Referrals</span>
                                </span>
                              </div>
                            </td>

                            {/* 3. Coin & Selected Network */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-extrabold text-[#EF4444] text-sm font-sans tracking-tight">${req.amount} {req.coin}</span>
                                <span className="text-[10px] font-bold text-[#3B82F6] bg-[#3B82F6]/15 px-2 py-0.5 rounded-md border border-[#3B82F6]/40 self-start flex items-center gap-1">
                                  <Activity className="w-3 h-3 text-[#3B82F6]" />
                                  <span>Network: {req.network}</span>
                                </span>
                              </div>
                            </td>

                            {/* 4. Destination Address with Copy Button */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 bg-[#0B0B0B] border border-[#262626] px-2.5 py-1.5 rounded-lg max-w-[170px]">
                                <span className="text-gray-200 text-[11px] font-mono font-semibold truncate flex-1">{req.address}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(req.address);
                                    showToast(`Copied ${req.coin} Address!`);
                                  }}
                                  className="text-gray-400 hover:text-white p-0.5 hover:bg-[#1F1F1F] rounded transition-colors cursor-pointer"
                                  title="Copy Address"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            {/* 5. Status */}
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                req.status === 'Approved' ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/40' : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40'
                              }`}>
                                {req.status}
                              </span>
                            </td>

                            {/* 6. Action & KYC Details */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* KYC Details Button */}
                                <button
                                  onClick={() => setSelectedKycUser(matchingUser)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/40 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="View User KYC Details"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>KYC Details</span>
                                </button>

                                {req.status === 'Pending' ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        setWithdrawRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                                        showToast(`Approved Withdrawal ${req.id}`);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#22C55E] hover:bg-green-600 text-white font-bold text-[11px] cursor-pointer shadow-md transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setWithdrawRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r));
                                        showToast(`Rejected Withdrawal ${req.id}`);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white font-bold text-[11px] cursor-pointer shadow-md transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[#22C55E] font-bold text-[11px] bg-[#22C55E]/10 px-2.5 py-1 rounded-lg border border-[#22C55E]/30">Processed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SUPPORT TICKETS (/admin/support-tickets) */}
            {pathname === '/admin/support-tickets' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
                      <span>Customer Support Live Inbox</span>
                    </h2>
                    <p className="text-xs text-gray-400">1 Box per User. Click 'Chat & Reply' to view full conversation history and respond.</p>
                  </div>
                  <button 
                    onClick={fetchSupportTickets}
                    className="px-3.5 py-2 bg-[#111111] hover:bg-[#1F1F1F] border border-[#1F1F1F] text-xs font-bold text-gray-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Refresh Inbox</span>
                  </button>
                </div>

                {/* Grouped User Conversations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(() => {
                    // Group tickets by email
                    const groupsMap = {};
                    realSupportTickets.forEach((ticket) => {
                      const email = (ticket.user_email || 'unknown').toLowerCase();
                      if (!groupsMap[email]) {
                        groupsMap[email] = {
                          email: ticket.user_email,
                          tickets: [],
                          openCount: 0,
                          latestTicket: ticket
                        };
                      }
                      groupsMap[email].tickets.push(ticket);
                      if (ticket.status === 'open' || ticket.status === 'Open') {
                        groupsMap[email].openCount += 1;
                      }
                    });

                    const userGroups = Object.values(groupsMap);

                    if (userGroups.length === 0) {
                      return (
                        <div className="col-span-full bg-[#111111] border border-[#1F1F1F] rounded-2xl p-10 text-center text-gray-400 text-sm">
                          No active user support messages found.
                        </div>
                      );
                    }

                    return userGroups.map((group) => {
                      const latest = group.latestTicket;
                      const hasOpen = group.openCount > 0;

                      return (
                        <div 
                          key={group.email} 
                          className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-xl hover:border-[#3B82F6]/50 ${
                            hasOpen ? 'border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-[#1F1F1F]'
                          }`}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Card Top Row: User Email & New SMS Badge */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-xs font-bold text-[#3B82F6] shrink-0">
                                  {group.email.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-mono font-bold text-sm text-white truncate" title={group.email}>
                                  {group.email}
                                </span>
                              </div>

                              {hasOpen ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EF4444] text-white animate-pulse shrink-0">
                                  {group.openCount} NEW SMS
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 shrink-0">
                                  RESOLVED
                                </span>
                              )}
                            </div>

                            {/* Message Stats & Date */}
                            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mt-1">
                              <span>Total: {group.tickets.length} SMS</span>
                              <span>{latest.created_at ? new Date(latest.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>

                            {/* Latest Problem Snippet */}
                            <div className="bg-[#0B0B0B] p-3 rounded-xl border border-[#1F1F1F] text-xs text-gray-300 min-h-[55px] flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-[#3B82F6] block mb-0.5">Latest User Problem:</span>
                              <p className="line-clamp-2 text-gray-200">{latest.message}</p>
                            </div>
                          </div>

                          {/* Action Buttons: Open Chat & Delete Chat */}
                          <div className="flex items-center gap-2 pt-2 border-t border-[#1F1F1F]">
                            <button
                              onClick={() => setActiveChatUserGroup(group)}
                              className="flex-1 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat & Reply</span>
                            </button>

                            <button
                              onClick={() => handleDeleteUserSupportData(group.email)}
                              className="p-2.5 rounded-xl bg-[#1F1F1F] hover:bg-red-500/20 border border-[#1F1F1F] hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete User Conversation & Database Records"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* ADMIN LIVE CHAT THREAD MODAL FOR SELECTED USER */}
            {activeChatUserGroup && (
              <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-[#111111] border border-[#3B82F6]/40 rounded-2xl w-full max-w-2xl h-[600px] max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
                  
                  {/* Modal Header */}
                  <div className="p-4 bg-[#0B0B0B] border-b border-[#1F1F1F] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center font-bold text-sm text-[#3B82F6]">
                        {activeChatUserGroup.email.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono">{activeChatUserGroup.email}</h3>
                        <p className="text-[10px] text-gray-400">Total {activeChatUserGroup.tickets.length} Messages • Support Thread</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteUserSupportData(activeChatUserGroup.email)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Delete all chat history from DB"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Delete Chat</span>
                      </button>
                      
                      <button
                        onClick={() => setActiveChatUserGroup(null)}
                        className="p-1.5 text-gray-400 hover:text-white bg-[#1F1F1F] rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages History Stream (Chronological) */}
                  <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#000000]">
                    {activeChatUserGroup.tickets.map((tck) => (
                      <div key={tck.id} className="flex flex-col gap-2 p-3 bg-[#111111] border border-[#1F1F1F] rounded-xl">
                        
                        {/* User Message */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                            <span className="text-[#3B82F6] font-bold">User (#{tck.ticket_code || tck.id})</span>
                            <span>{tck.created_at ? new Date(tck.created_at).toLocaleString() : ''}</span>
                          </div>
                          <div className="bg-[#181818] p-3 rounded-xl text-xs text-white border border-[#242424]">
                            {tck.message}
                          </div>
                        </div>

                        {/* Agent Reply if exists */}
                        {tck.reply ? (
                          <div className="flex flex-col pl-4 border-l-2 border-l-[#22C55E]">
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#22C55E] mb-1">
                              <span className="font-bold">Admin Reply</span>
                              <span>{tck.updated_at ? new Date(tck.updated_at).toLocaleString() : ''}</span>
                            </div>
                            <div className="bg-[#162218] p-3 rounded-xl text-xs text-emerald-200 border border-[#234227]">
                              {tck.reply}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded w-fit">
                            ⏳ Waiting for your reply...
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* Reply Input Bar */}
                  <div className="p-3 bg-[#0B0B0B] border-t border-[#1F1F1F] flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type response for user..."
                      value={modalReplyText}
                      onChange={(e) => setModalReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && activeChatUserGroup.tickets.length > 0) {
                          const latestOpen = activeChatUserGroup.tickets.find(t => t.status === 'open' || t.status === 'Open') || activeChatUserGroup.tickets[0];
                          handleSendGroupSupportReply(latestOpen.id);
                        }
                      }}
                      className="flex-1 bg-[#181818] border border-[#262626] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-white outline-none placeholder-gray-500"
                    />

                    <button
                      onClick={() => {
                        if (activeChatUserGroup.tickets.length > 0) {
                          const latestOpen = activeChatUserGroup.tickets.find(t => t.status === 'open' || t.status === 'Open') || activeChatUserGroup.tickets[0];
                          handleSendGroupSupportReply(latestOpen.id);
                        }
                      }}
                      disabled={!modalReplyText.trim()}
                      className="px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md shrink-0"
                    >
                      Send Reply
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 7. REDPACK MANAGEMENT (/admin/redpack) */}
            {pathname === '/admin/redpack' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Crypto Redpack / Red Packet Codes</h2>
                    <p className="text-xs text-gray-400">Create & manage Red Packet codes for users to claim USDT rewards</p>
                  </div>
                  <button
                    onClick={() => {
                      const randCode = 'RED' + Math.floor(100000 + Math.random() * 900000);
                      setNewRedpackCode(randCode);
                      setShowCreateRedpackModal(true);
                    }}
                    className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Red Packet</span>
                  </button>
                </div>

                {/* Create Modal */}
                {showCreateRedpackModal && (
                  <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#111111] border border-[#3B82F6]/40 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 text-white shadow-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                        <h3 className="font-bold text-base flex items-center gap-2">
                          <Gift className="w-5 h-5 text-[#3B82F6]" />
                          <span>Create Red Packet Code</span>
                        </h3>
                        <button onClick={() => setShowCreateRedpackModal(false)} className="p-1 text-gray-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex flex-col gap-1">
                          <label className="text-gray-300 font-bold">Red Packet Code</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="e.g. RED888"
                              value={newRedpackCode}
                              onChange={(e) => setNewRedpackCode(e.target.value.toUpperCase())}
                              className="flex-1 bg-[#181818] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono font-bold outline-none"
                            />
                            <button
                              onClick={() => setNewRedpackCode('RED' + Math.floor(100000 + Math.random() * 900000))}
                              className="px-3 py-2.5 bg-[#262626] hover:bg-[#333] text-gray-200 font-bold rounded-xl text-[11px]"
                            >
                              Gen Code
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-gray-300 font-bold">USDT Reward Per User ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 1.50"
                            value={newRedpackAmount}
                            onChange={(e) => setNewRedpackAmount(e.target.value)}
                            className="bg-[#181818] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono font-bold outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-gray-300 font-bold">Max Claim Users Limit</label>
                          <input
                            type="number"
                            placeholder="e.g. 100"
                            value={newRedpackClaims}
                            onChange={(e) => setNewRedpackClaims(e.target.value)}
                            className="bg-[#181818] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white font-mono font-bold outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-gray-300 font-bold">Greeting / Title Note</label>
                          <input
                            type="text"
                            placeholder="e.g. Happy Trading! 恭喜发财"
                            value={newRedpackTitle}
                            onChange={(e) => setNewRedpackTitle(e.target.value)}
                            className="bg-[#181818] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setShowCreateRedpackModal(false)}
                          className="flex-1 py-2.5 bg-[#181818] hover:bg-[#222] text-gray-300 font-bold text-xs rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateRedpack}
                          className="flex-1 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
                        >
                          Create Code
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Redpack List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {realRedpackList.length === 0 ? (
                    <div className="col-span-2 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-500 gap-2">
                      <Gift className="w-10 h-10 text-gray-600" />
                      <span className="text-sm font-bold text-gray-300">No Red Packets created yet</span>
                      <p className="text-xs text-gray-500">Click 'Create New Red Packet' to generate codes for users</p>
                    </div>
                  ) : (
                    realRedpackList.map((rp) => (
                      <div key={rp.id} className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 flex flex-col gap-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#22C55E] text-base bg-[#22C55E]/10 px-2.5 py-1 rounded-lg border border-[#22C55E]/20">
                            {rp.code}
                          </span>
                          <button
                            onClick={() => handleDeleteRedpack(rp.id, rp.code)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer"
                            title="Delete Red Packet Code"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-white mt-1">{rp.title}</span>

                        <div className="flex items-center justify-between text-xs text-gray-300 mt-1 font-mono">
                          <span>Reward: <strong className="text-[#FCD535]">${rp.amountPerUser.toFixed(4)} USDT</strong> / user</span>
                          <span>Claimed: <strong className="text-white">{rp.claimedCount} / {rp.maxClaims}</strong></span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-[#1F1F1F] pt-2 mt-2">
                          <span>Created: {new Date(rp.createdAt).toLocaleDateString()}</span>
                          <span className={rp.claimedCount >= rp.maxClaims ? "text-amber-400 font-bold" : "text-[#3B82F6] font-bold"}>
                            {rp.claimedCount >= rp.maxClaims ? "Completed" : "Active"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 8. SITE ANALYTICS & SETTINGS (/admin/site-analytics, /admin/settings) */}
            {(pathname === '/admin/site-analytics' || pathname === '/admin/settings') && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <h2 className="text-lg font-bold text-white">
                  {pathname === '/admin/site-analytics' ? 'Site & Visitor Analytics' : 'Platform Settings & Enterprise Controls'}
                </h2>

                <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300">Site Title Name</label>
                    <input type="text" defaultValue="Pokymax Exchange" className="bg-[#0B0B0B] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-xs text-white outline-none max-w-md" />
                  </div>

                  <div className="flex items-center justify-between bg-[#0B0B0B] p-4 rounded-xl border border-[#1F1F1F]">
                    <div>
                      <h4 className="text-xs font-bold text-white">System Maintenance Mode</h4>
                      <p className="text-[11px] text-gray-400">Lock exchange trading and access for updates</p>
                    </div>
                    <button
                      onClick={() => showToast('Toggle Maintenance Mode')}
                      className="px-4 py-2 bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Disabled
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Global Side Panel Drawer for KYC Review (Accessible from all pages) */}
      {selectedKycUser && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0B0B0B] border-l border-[#1F1F1F] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between animate-slideLeft">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3B82F6]" />
                <span>KYC Document Review</span>
              </h3>
              <button onClick={() => setSelectedKycUser(null)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 flex flex-col gap-4 text-xs">
              {/* Applicant Comprehensive Information Card */}
              <div className="bg-[#111111] p-4 rounded-xl border border-[#1F1F1F] flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2">
                  <span className="text-xs font-bold text-[#3B82F6]">Applicant Profile</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedKycUser.kycStatus === 'Verified' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`}>
                    {selectedKycUser.kycStatus || 'Pending'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 font-mono">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">Full Name:</span>
                    <span className="font-bold text-white font-sans">{selectedKycUser.fullName || selectedKycUser.username}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">Document Type:</span>
                    <span className="font-semibold text-white">{selectedKycUser.documentType || 'ID card'}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">ID Number:</span>
                    <span className="font-mono text-[#F59E0B] font-bold">{selectedKycUser.idNumber || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">User UID:</span>
                    <span className="font-bold text-[#3B82F6]">{selectedKycUser.uid}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">Reg Email:</span>
                    <span className="font-bold text-white text-[11px] truncate max-w-[200px]">{selectedKycUser.email}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">KYC Submitted:</span>
                    <span className="font-semibold text-gray-200">{selectedKycUser.submittedDate || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">Wallet Balance:</span>
                    <span className="font-bold text-[#22C55E]">${selectedKycUser.balance ? selectedKycUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span className="text-gray-400 font-sans">Country & IP:</span>
                    <span className="text-gray-300">{selectedKycUser.country} ({selectedKycUser.ip || '127.0.0.1'})</span>
                  </div>
                </div>
              </div>

              {/* Document Images */}
              <div className="flex flex-col gap-3">
                <span className="font-bold text-gray-300">1. {selectedKycUser.documentType || 'ID Document'} (Front)</span>
                <img src={selectedKycUser.idFront} alt="ID Front" className="w-full h-44 object-cover rounded-xl border border-[#1F1F1F]" />

                <span className="font-bold text-gray-300">2. {selectedKycUser.documentType || 'ID Document'} (Back)</span>
                <img src={selectedKycUser.idBack} alt="ID Back" className="w-full h-44 object-cover rounded-xl border border-[#1F1F1F]" />
              </div>
            </div>
          </div>

          {/* Approve / Decline Action Buttons */}
          <div className="pt-4 border-t border-[#1F1F1F] flex gap-3">
            <button
              onClick={() => handleApproveKyc(selectedKycUser)}
              className="flex-1 py-3 rounded-xl bg-[#22C55E] hover:bg-green-600 font-bold text-xs text-white transition-all cursor-pointer shadow-md"
            >
              Approve KYC
            </button>
            <button
              onClick={() => handleDeclineKyc(selectedKycUser)}
              className="flex-1 py-3 rounded-xl bg-[#EF4444] hover:bg-red-600 font-bold text-xs text-white transition-all cursor-pointer shadow-md"
            >
              Decline KYC
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
