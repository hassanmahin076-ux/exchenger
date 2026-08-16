"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Gift, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Clipboard,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CryptoBoxPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState('receive'); // 'send' or 'receive'

  // Code input & submission
  const [packetCode, setPacketCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History & User Claims State
  const [claimHistory, setClaimHistory] = useState([
    {
      id: 1,
      code: 'RED888',
      title: '恭喜发财，万事如意！',
      createdBy: '元元财经pro',
      amount: 0.0901926,
      claimedAt: '2026-08-15 00:28:56'
    },
    {
      id: 2,
      code: 'WELCOME2026',
      title: '红包有奖问答',
      createdBy: '三马哥',
      amount: 0.5000,
      claimedAt: '2026-08-10 21:15:27'
    }
  ]);

  // Modal / Toast States
  const [popupModal, setPopupModal] = useState({ show: false, message: '', type: 'error' });
  const [successRewardModal, setSuccessRewardModal] = useState(null);

  // Fetch real claim history from server
  const fetchClaimHistory = () => {
    const savedUid = typeof window !== 'undefined' ? localStorage.getItem('userUid') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

    if (savedUid || savedEmail) {
      fetch(`/api/user/cryptobox/history?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.history && data.history.length > 0) {
            setClaimHistory(data.history);
          }
        })
        .catch(err => console.error('Error fetching claim history:', err));
    }
  };

  useEffect(() => {
    fetchClaimHistory();
  }, []);

  // Handle Paste from Clipboard
  const handlePasteCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) setPacketCode(text.trim());
      }
    } catch (err) {
      console.log('Clipboard paste fallback:', err);
    }
  };

  // Show Toast/Modal Error
  const showErrorPopup = (msg) => {
    setPopupModal({ show: true, message: msg, type: 'error' });
  };

  // Execute Red Packet Claim
  const handleClaimRedPacket = async () => {
    if (!packetCode.trim()) {
      showErrorPopup('Please enter or paste a Red Packet code');
      return;
    }

    const savedUid = typeof window !== 'undefined' ? localStorage.getItem('userUid') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/cryptobox/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: savedUid,
          userEmail: savedEmail,
          code: packetCode.trim()
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessRewardModal({
          amount: data.amount,
          title: data.title || 'Red Packet Gift',
          code: data.code || packetCode.trim(),
          createdBy: data.createdBy || 'Admin'
        });

        setPacketCode('');
        fetchClaimHistory();

        // Dispatch balance update so user USDT balance updates everywhere
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('balanceUpdated'));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('notificationUpdated'));
        }
      } else {
        showErrorPopup(data.error || 'Failed to claim Red Packet');
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('Claim error:', err);
      showErrorPopup('Server error processing Red Packet claim');
    }
  };

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#0b0c0e] text-white flex flex-col mx-auto relative font-sans selection:bg-[#fcd535] selection:text-black overflow-x-hidden pb-12">
      
      {/* ---------------- 1. HEADER (Back Arrow, Title, History Icon) ---------------- */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between bg-[#0b0c0e] sticky top-0 z-20">
        <button 
          onClick={() => router.push('/home')}
          className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-extrabold text-white tracking-tight">Red Packet</h1>

        <button 
          onClick={() => {
            const el = document.getElementById('history-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
          title="Claim History"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 flex flex-col gap-5 pt-1">
        
        {/* ---------------- 2. SEND / RECEIVE PILLS ---------------- */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'send' 
                ? 'bg-[#252830] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Send
          </button>
          <button
            onClick={() => setActiveTab('receive')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'receive' 
                ? 'bg-[#252830] text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Receive
          </button>
        </div>

        {/* ---------------- 3. HERO ILLUSTRATION (Red Packet Box & Confetti) ---------------- */}
        <div className="relative w-full h-48 flex flex-col items-center justify-center overflow-hidden my-1">
          <img 
            src="/red_packet_gift.png" 
            alt="Red Packet Gift"
            className="w-48 h-auto object-contain max-h-44 drop-shadow-[0_0_20px_rgba(232,65,66,0.3)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* ---------------- 4. CLAIM INPUT SECTION ---------------- */}
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs text-gray-400 font-medium">
            Enter code to claim Red Packet
          </p>

          {/* Code Input Box with Inside Paste Button */}
          <div className="relative w-full bg-[#181a20] border border-[#2b2f36] focus-within:border-[#fcd535] rounded-2xl px-4 py-3.5 flex items-center justify-between transition-colors shadow-inner">
            <input
              type="text"
              placeholder="Enter red packet code"
              value={packetCode}
              onChange={(e) => setPacketCode(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 font-medium outline-none pr-16"
            />
            <button
              onClick={handlePasteCode}
              className="absolute right-3 px-3 py-1 bg-transparent hover:bg-[#252830] text-[#fcd535] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Paste
            </button>
          </div>

          {/* Main Claim Button */}
          <button
            disabled={isSubmitting}
            onClick={handleClaimRedPacket}
            className="w-full py-4 bg-gradient-to-r from-[#eab308] via-[#fcd535] to-[#ca8a04] hover:brightness-110 active:scale-[0.98] text-black font-extrabold text-sm rounded-2xl transition-all shadow-xl cursor-pointer text-center mt-1"
          >
            {isSubmitting ? 'Claiming...' : 'Claim'}
          </button>
        </div>

        {/* ---------------- 5. HISTORY SECTION ---------------- */}
        <div id="history-section" className="flex flex-col gap-3 pt-6 border-t border-[#1c1e24] mt-2">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">History</h3>
            <button 
              onClick={() => fetchClaimHistory()}
              className="text-xs text-[#fcd535] font-bold hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          {/* History Cards */}
          <div className="flex flex-col gap-2.5">
            {claimHistory.length === 0 ? (
              <div className="bg-[#141518] border border-[#24262b] rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-500 gap-2">
                <Gift className="w-8 h-8 text-gray-600" />
                <span className="text-xs">No Red Packets claimed yet</span>
              </div>
            ) : (
              claimHistory.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#121316] border border-[#22252c] rounded-2xl p-4 flex flex-col gap-2 shadow-md transition-all hover:border-[#323642]"
                >
                  {/* Top Line: Gift Icon & Greeting/Title */}
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎁</span>
                    <span className="font-bold text-xs text-white truncate max-w-[240px]">
                      {item.title}
                    </span>
                  </div>

                  {/* Sub details: Date, From sender & Claimed amount */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-[#1a1c22]">
                    <div className="flex flex-col gap-0.5 font-mono">
                      <span>{item.claimedAt ? new Date(item.claimedAt).toISOString().replace('T', ' ').substring(0, 19) : '2026-08-15 00:28:56'}</span>
                      <span className="text-gray-500 font-sans">Claim Progress</span>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-gray-400 font-sans">From <strong className="text-gray-200">{item.createdBy}</strong></span>
                      <span className="font-bold font-mono text-[#fcd535] text-xs">
                        +{parseFloat(item.amount).toFixed(4)} USDT
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* ---------------- 6. CUSTOM CENTER ERROR POPUP MODAL ---------------- */}
      {popupModal.show && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 pointer-events-auto"
          onClick={() => setPopupModal({ show: false, message: '', type: 'error' })}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[290px] bg-[#1a1c23] border border-[#2e3240] rounded-2xl p-4 flex flex-col items-center gap-3 text-center text-white shadow-2xl animate-in zoom-in-95 duration-200 border-t-2 border-t-[#fcd535]"
          >
            <div className="w-10 h-10 rounded-full bg-[#fcd535]/15 border border-[#fcd535]/40 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#fcd535]" />
            </div>
            <p className="text-xs font-bold text-gray-200 leading-snug px-1">
              {popupModal.message}
            </p>
            <button
              onClick={() => setPopupModal({ show: false, message: '', type: 'error' })}
              className="w-full py-2.5 bg-[#fcd535] hover:bg-[#ebd02c] active:scale-95 text-black font-extrabold text-xs rounded-xl transition-all shadow-md mt-1 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 7. CLAIM SUCCESS CELEBRATION MODAL ---------------- */}
      {successRewardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[320px] bg-gradient-to-b from-[#2a1315] to-[#121316] border border-[#ef4444]/40 rounded-3xl p-6 flex flex-col items-center text-center text-white shadow-2xl animate-in zoom-in duration-300 relative">
            <button 
              onClick={() => setSuccessRewardModal(null)}
              className="absolute top-3.5 right-3.5 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Gift Graphic */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ef4444] to-[#fbbf24] p-0.5 shadow-[0_0_30px_rgba(239,68,68,0.6)] my-2 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#1c1214] flex items-center justify-center p-2">
                <img 
                  src="/red_packet_gift.png" 
                  alt="Red Packet Gift"
                  className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(252,213,53,0.5)] animate-bounce"
                />
              </div>
            </div>

            <h3 className="font-extrabold text-lg text-white mt-1">Red Packet Claimed! 🎉</h3>
            <p className="text-xs text-gray-300 font-medium px-2 mt-1">{successRewardModal.title}</p>

            <div className="my-4 py-3 px-6 bg-[#16171a] border border-[#2b2e38] rounded-2xl flex flex-col items-center gap-1 font-mono shadow-inner">
              <span className="text-[11px] text-gray-400 font-sans">Received Amount</span>
              <span className="text-2xl font-black text-[#fcd535] tracking-tight">
                +${parseFloat(successRewardModal.amount).toFixed(4)} USDT
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              From <strong className="text-white">{successRewardModal.createdBy}</strong>
            </p>

            <button
              onClick={() => setSuccessRewardModal(null)}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#eab308] to-[#fcd535] hover:brightness-110 active:scale-95 text-black font-extrabold text-xs rounded-xl transition-all shadow-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
