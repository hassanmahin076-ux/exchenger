"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Hexagon, 
  Flame, 
  Gift, 
  User, 
  Headphones, 
  ChevronRight, 
  Briefcase, 
  Settings,
  X,
  CheckCircle2,
  Bell,
  ExternalLink,
  Clock
} from 'lucide-react';

function NotificationsPageContent() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userUid, setUserUid] = useState('');

  const [dbNotifications, setDbNotifications] = useState([]);
  const [supportNotifText, setSupportNotifText] = useState('No new support messages');
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  const [supportTickets, setSupportTickets] = useState([]);

  // Active Category Details Modal State
  const [activeModal, setActiveModal] = useState(null); // 'system' | 'events' | 'rewards' | 'account' | 'support'

  // Fetch real notifications & support replies for logged in user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail') || '';
      const uid = localStorage.getItem('userUid') || '';
      setUserEmail(email);
      setUserUid(uid);

      if (email || uid) {
        // Fetch server user notifications
        fetch(`/api/user/notifications?uid=${encodeURIComponent(uid)}&email=${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.notifications) {
              setDbNotifications(data.notifications);
            }
          })
          .catch(err => console.warn('Fetch notifications error:', err));

        // Fetch support ticket updates for user
        fetch(`/api/support/tickets?email=${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.tickets) {
              setSupportTickets(data.tickets);
              const repliedTicket = data.tickets.find(t => t.reply);
              if (repliedTicket) {
                setSupportNotifText(`Agent Reply (${repliedTicket.ticket_code}): "${repliedTicket.reply.slice(0, 35)}..."`);
                setSupportUnreadCount(1);
              }
            }
          })
          .catch(err => console.warn('Fetch support tickets error:', err));
      }
    }
  }, []);

  // Latest system notification text preview
  const latestSystemNotif = dbNotifications.length > 0 
    ? `${dbNotifications[0].title}: ${dbNotifications[0].message}`
    : 'Withdrawal Successful';

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto relative shadow-2xl">
      
      {/* 1. Header */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-[#181a20] bg-[#000000] sticky top-0 z-30 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-white tracking-tight">
            All notifications
          </h1>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <button 
            onClick={() => router.push('/cuponcenter')}
            className="p-1 hover:text-white transition-colors cursor-pointer" 
            title="Rewards Hub"
          >
            <Briefcase className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push('/satting')}
            className="p-1 hover:text-white transition-colors cursor-pointer" 
            title="Notification Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Main List of Notification Boxes */}
      <main className="flex-1 p-4 flex flex-col gap-3.5 overflow-y-auto no-scrollbar">

        {/* 1. System Notification */}
        <div 
          onClick={() => setActiveModal('system')}
          className="flex items-center justify-between p-4 bg-[#12141a] hover:bg-[#181b24] border border-[#232730] hover:border-[#3B82F6]/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1c202a] border border-[#2f3544] flex items-center justify-center shrink-0 group-hover:border-[#3B82F6] transition-colors">
              <Hexagon className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight">System Notification</h3>
              <p className="text-xs text-gray-400 truncate max-w-[210px]">{latestSystemNotif}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#ff4d4d] text-white text-[10px] font-black flex items-center justify-center">
              {dbNotifications.length > 0 ? dbNotifications.length : 6}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* 2. Latest Events */}
        <div 
          onClick={() => setActiveModal('events')}
          className="flex items-center justify-between p-4 bg-[#12141a] hover:bg-[#181b24] border border-[#232730] hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1c202a] border border-[#2f3544] flex items-center justify-center shrink-0 group-hover:border-amber-500 transition-colors">
              <Flame className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight">Latest Events</h3>
              <p className="text-xs text-gray-400 truncate max-w-[210px]">
                DCA BTC, ETH, or XAUT to share 55,000 USDT...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#ff4d4d] text-white text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* 3. Rewards */}
        <div 
          onClick={() => setActiveModal('rewards')}
          className="flex items-center justify-between p-4 bg-[#12141a] hover:bg-[#181b24] border border-[#232730] hover:border-[#aeff00]/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1c202a] border border-[#2f3544] flex items-center justify-center shrink-0 group-hover:border-[#aeff00] transition-colors">
              <Gift className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Rewards</span>
                <span className="text-[10px] text-[#aeff00] bg-[#aeff00]/10 px-1.5 py-0.2 rounded border border-[#aeff00]/30 font-mono">COUPON</span>
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-[210px]">
                You have received a coupon! New task received...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#ff4d4d] text-white text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* 4. Changes to Account Info */}
        <div 
          onClick={() => setActiveModal('account')}
          className="flex items-center justify-between p-4 bg-[#12141a] hover:bg-[#181b24] border border-[#232730] hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1c202a] border border-[#2f3544] flex items-center justify-center shrink-0 group-hover:border-purple-500 transition-colors">
              <User className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight">Changes to Account Info</h3>
              <p className="text-xs text-gray-400 truncate max-w-[210px]">
                Login Attempt From New IP (185.220.101.5)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* 5. Customer Support */}
        <div 
          onClick={() => setActiveModal('support')}
          className="flex items-center justify-between p-4 bg-[#12141a] hover:bg-[#181b24] border border-[#232730] hover:border-[#aeff00]/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-lg"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#1c202a] border border-[#2f3544] flex items-center justify-center shrink-0 group-hover:border-[#aeff00] transition-colors">
              <Headphones className="w-5 h-5 text-gray-200" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Customer Support</span>
                {supportUnreadCount > 0 && (
                  <span className="text-[9px] text-[#0ecb81] bg-[#0ecb81]/15 px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">NEW REPLY</span>
                )}
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-[210px]">{supportNotifText}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {supportUnreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#ff4d4d] text-white text-[10px] font-black flex items-center justify-center">
                {supportUnreadCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>

      </main>

      {/* 3. DETAILS NOTIFICATION MODAL WHEN BOX IS CLICKED */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-[390px] bg-[#12141a] border border-[#292e3b] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#181a22] border-b border-[#232834] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeModal === 'system' && <Hexagon className="w-5 h-5 text-[#3B82F6]" />}
                {activeModal === 'events' && <Flame className="w-5 h-5 text-amber-500" />}
                {activeModal === 'rewards' && <Gift className="w-5 h-5 text-[#aeff00]" />}
                {activeModal === 'account' && <User className="w-5 h-5 text-purple-400" />}
                {activeModal === 'support' && <Headphones className="w-5 h-5 text-[#aeff00]" />}
                
                <h3 className="text-sm font-bold text-white capitalize">
                  {activeModal === 'system' && 'System Notifications'}
                  {activeModal === 'events' && 'Latest Events & Promos'}
                  {activeModal === 'rewards' && 'Rewards & Coupon Center'}
                  {activeModal === 'account' && 'Security & Account Activity'}
                  {activeModal === 'support' && 'Customer Support Replies'}
                </h3>
              </div>

              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 text-gray-400 hover:text-white bg-[#222733] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Message List */}
            <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[50vh]">
              
              {/* Category 1: System */}
              {activeModal === 'system' && (
                <>
                  {dbNotifications.length > 0 ? (
                    dbNotifications.map(n => (
                      <div key={n.id} className="bg-[#1a1d26] p-3.5 rounded-xl border border-[#2b3140] flex flex-col gap-1">
                        <span className="text-xs font-bold text-[#3B82F6]">{n.title}</span>
                        <p className="text-xs text-gray-200">{n.message}</p>
                        <span className="text-[10px] text-gray-500 mt-1 font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recently'}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-[#1a1d26] p-3.5 rounded-xl border border-[#2b3140] flex flex-col gap-1">
                        <span className="text-xs font-bold text-emerald-400">Withdrawal Successful</span>
                        <p className="text-xs text-gray-200">Your withdrawal of 500.00 USDT (TRC20) has been processed and sent to your wallet.</p>
                        <span className="text-[10px] text-gray-500 mt-1 font-mono">Today, 02:45 PM</span>
                      </div>
                      <div className="bg-[#1a1d26] p-3.5 rounded-xl border border-[#2b3140] flex flex-col gap-1">
                        <span className="text-xs font-bold text-[#3B82F6]">Deposit Credit Confirmed</span>
                        <p className="text-xs text-gray-200">Your wallet balance has been credited with +1,200.00 USDT.</p>
                        <span className="text-[10px] text-gray-500 mt-1 font-mono">Yesterday, 06:12 PM</span>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Category 2: Events */}
              {activeModal === 'events' && (
                <div className="bg-[#1a1d26] p-4 rounded-xl border border-[#2b3140] flex flex-col gap-2">
                  <span className="text-xs font-bold text-amber-400">CFD Championship (Phase 9)</span>
                  <p className="text-xs text-gray-200">
                    DCA BTC, ETH, or XAUT to share 55,000 USDT promotion pool! Complete daily trading tasks to boost your ranking pool.
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">Expires in 3 Days</span>
                </div>
              )}

              {/* Category 3: Rewards & Coupon */}
              {activeModal === 'rewards' && (
                <div className="bg-[#19241b] p-4 rounded-xl border border-[#28422d] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#aeff00]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>$50 USDT Coupon Received!</span>
                  </div>
                  <p className="text-xs text-gray-200">
                    🎉 Congratulations! You have received a $50 USDT Trading Fee Rebate Coupon & P2P Deposit Reward.
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono">Claimable at Rewards & Task Center</span>
                </div>
              )}

              {/* Category 4: Account */}
              {activeModal === 'account' && (
                <div className="bg-[#1a1d26] p-4 rounded-xl border border-[#2b3140] flex flex-col gap-2">
                  <span className="text-xs font-bold text-purple-400">Security Alert: New IP Login</span>
                  <p className="text-xs text-gray-200">
                    A new login attempt was detected for your account from IP address 185.220.101.5 (Dhaka, Bangladesh).
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">If this wasn't you, change password immediately.</span>
                </div>
              )}

              {/* Category 5: Support */}
              {activeModal === 'support' && (
                <div className="flex flex-col gap-2">
                  {supportTickets.length > 0 ? (
                    supportTickets.map(t => (
                      <div key={t.id} className="bg-[#1a1d26] p-3.5 rounded-xl border border-[#2b3140] flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                          <span>#{t.ticket_code}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">Your query: {t.message}</p>
                        {t.reply ? (
                          <div className="bg-[#1e2e21] p-2.5 rounded-lg border border-[#294d2f] mt-1">
                            <span className="text-[10px] font-bold text-[#aeff00] block mb-0.5">Agent Reply:</span>
                            <p className="text-xs text-white">{t.reply}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold">⏳ Waiting for agent reply...</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 p-4 text-center">No active support tickets found.</div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Action Button */}
            <div className="p-3.5 bg-[#181a22] border-t border-[#232834]">
              {activeModal === 'rewards' && (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    router.push('/cuponcenter');
                  }}
                  className="w-full py-2.5 bg-[#aeff00] hover:bg-[#9ee000] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Claim Coupon & Go to Task Center</span>
                </button>
              )}

              {activeModal === 'support' && (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    router.push('/support');
                  }}
                  className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Open Live Support Chat</span>
                </button>
              )}

              {activeModal === 'events' && (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    router.push('/home');
                  }}
                  className="w-full py-2.5 bg-[#f39c12] hover:bg-[#e67e22] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>View Campaign & Events</span>
                </button>
              )}

              {activeModal === 'account' && (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    router.push('/satting');
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>
              )}

              {activeModal === 'system' && (
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 bg-[#232730] hover:bg-[#2e3340] text-gray-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close Details
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <NotificationsPageContent />
    </Suspense>
  );
}
