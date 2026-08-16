"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Globe, 
  Power, 
  Headphones, 
  Bot, 
  ChevronRight, 
  FileText, 
  UserCheck, 
  Shield, 
  Mail, 
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import SupportChatModal from '@/components/SupportChatModal';

const FAQ_DATA = {
  "You might be looking for": [
    { q: "Everything You Need to Know for Safe P2P Trading", a: "Always ensure payment is confirmed in your bank/wallet before releasing crypto in P2P trading. Never accept third-party payments." },
    { q: "Why Haven't I Received my XRP, A, XLM Deposit?", a: "Deposits for XRP, XLM, or EOS require a mandatory Memo/Tag. If missing, please contact support with your TX Hash." },
    { q: "Check my Case Status", a: "You can track your active support tickets in real-time by tapping 'Start Asking' and clicking 'View Chat History'." },
    { q: "The Buyer Used a Third-Party Account for Payment", a: "Do not release crypto if buyer name doesn't match their verified payment account. Open an instant dispute." },
    { q: "Why Can't I Register on Exchanger?", a: "Ensure your email is typed correctly and password is at least 8 characters containing numbers and letters." },
    { q: "How to Find my Wallet Address", a: "Go to Wallets -> Deposit -> Select Coin (e.g. USDT) -> Select Network (e.g. TRC20/BEP20) to view address." }
  ],
  "Event & Bonus": [
    { q: "How to claim New User Welcome Bonus?", a: "Complete KYC level 1 verification to receive your $2.10 USDT welcome credit instantly!" },
    { q: "Where do I enter Referral Invitation Code?", a: "You can enter referral code during registration or in the Referral Event tab under Profile." }
  ],
  "Account & Identity Verification": [
    { q: "How long does KYC verification take?", a: "Identity verification is reviewed within 5-15 minutes by our automated compliance system." },
    { q: "What documents are accepted for KYC?", a: "We accept government-issued Passport, National ID card, or Driver's License." }
  ],
  "P2P Trading": [
    { q: "How to appeal a P2P trade dispute?", a: "Go to P2P Trading -> Orders -> Select Trade -> Tap 'Appeal' to notify customer support agents." },
    { q: "Are P2P trades escrow protected?", a: "Yes, 100% of seller funds are locked in secure escrow until the buyer completes payment." }
  ],
  "Trading": [
    { q: "What are the Spot and Futures trading fees?", a: "Standard spot trading fee is 0.1% maker/taker. VIP levels receive up to 50% discount." },
    { q: "How to set Take Profit / Stop Loss (TP/SL)?", a: "In Futures trade view, set TP/SL trigger price when opening a position or editing open orders." }
  ],
  "Deposit & Withdrawal": [
    { q: "What is the minimum deposit amount?", a: "Minimum deposit for USDT is 1 USDT. Deposits below minimum cannot be credited." },
    { q: "How long do withdrawals take to process?", a: "Withdrawals are processed automatically on-chain within 1-5 minutes." }
  ]
};

function SupportHubContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("You might be looking for");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const categories = Object.keys(FAQ_DATA);
  const currentFaqs = FAQ_DATA[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto relative border-x border-[#1e2329] shadow-2xl">
      
      {/* 1. Top Header matching Image 2 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#181a20] bg-[#000000] sticky top-0 z-40 select-none">
        <button 
          onClick={() => router.back()} 
          className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-gray-300">
          <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Language">
            <Globe className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push('/auth')} 
            className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer" 
            title="Log Out"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Bot Welcome Banner matching Image 2 */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3.5 bg-[#000000]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 via-[#aeff00] to-emerald-500 p-0.5 shadow-lg flex-shrink-0">
          <div className="w-full h-full rounded-full bg-[#14161a] flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#aeff00]" />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-extrabold text-white tracking-tight">
            24/7 Dedicated Support
          </h1>
          <p className="text-xs text-gray-400 truncate max-w-[280px]">
            Hello there! I'm Bybot, how can I assist you today?
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-3 flex flex-col gap-6 pb-24 overflow-y-auto no-scrollbar">

        {/* 3. FAQs Section matching Image 2 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">FAQs</h2>
            <button className="flex items-center gap-1 text-xs text-amber-400 font-bold hover:text-amber-300">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* FAQ Container with Left Categories & Right Questions */}
          <div className="bg-[#12141a] border border-[#232730] rounded-2xl overflow-hidden flex min-h-[300px] shadow-lg">
            
            {/* Left Category Tabs matching Image 2 */}
            <div className="w-[140px] bg-[#161820] border-r border-[#232730] flex flex-col shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    setExpandedFaq(null);
                  }}
                  className={`p-3 text-left text-[11px] font-medium leading-snug border-b border-[#232730]/60 transition-all ${
                    activeTab === cat 
                      ? 'bg-[#12141a] text-white font-bold border-l-2 border-l-[#aeff00]' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Question List matching Image 2 */}
            <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto no-scrollbar">
              {currentFaqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col border-b border-[#232730]/60 pb-2.5 last:border-b-0 cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-gray-200 hover:text-white leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5 transition-transform ${expandedFaq === idx ? 'rotate-180 text-[#aeff00]' : ''}`} />
                  </div>

                  {expandedFaq === idx && (
                    <div className="mt-2 text-[11px] text-gray-400 bg-[#1a1d26] p-2.5 rounded-lg border border-[#2b303e] animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. Self-Service Grid matching Image 2 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-white tracking-tight">Self-Service</h2>

          <div className="grid grid-cols-2 gap-3">
            
            {/* P2P Order Dispute */}
            <div 
              onClick={() => router.push('/p2p')}
              className="bg-[#12141a] border border-[#232730] hover:border-[#353b49] p-3.5 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1c202a] border border-[#2f3544] flex items-center justify-center mb-1 group-hover:border-[#aeff00] transition-colors">
                <FileText className="w-4 h-4 text-gray-300 group-hover:text-[#aeff00]" />
              </div>
              <h3 className="text-xs font-bold text-white">P2P Order Dispute</h3>
              <p className="text-[10px] text-gray-400 leading-tight">Dispute a P2P Order here</p>
            </div>

            {/* Update KYC */}
            <div 
              onClick={() => router.push('/kycverifyed')}
              className="bg-[#12141a] border border-[#232730] hover:border-[#353b49] p-3.5 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1c202a] border border-[#2f3544] flex items-center justify-center mb-1 group-hover:border-[#aeff00] transition-colors">
                <UserCheck className="w-4 h-4 text-gray-300 group-hover:text-[#aeff00]" />
              </div>
              <h3 className="text-xs font-bold text-white">Update KYC</h3>
              <p className="text-[10px] text-gray-400 leading-tight">Update your account KYC information</p>
            </div>

            {/* Security & Password */}
            <div 
              onClick={() => router.push('/satting')}
              className="bg-[#12141a] border border-[#232730] hover:border-[#353b49] p-3.5 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1c202a] border border-[#2f3544] flex items-center justify-center mb-1 group-hover:border-[#aeff00] transition-colors">
                <Shield className="w-4 h-4 text-gray-300 group-hover:text-[#aeff00]" />
              </div>
              <h3 className="text-xs font-bold text-white">Account Security</h3>
              <p className="text-[10px] text-gray-400 leading-tight">Manage passwords and 2FA settings</p>
            </div>

            {/* Live Chat Support */}
            <div 
              onClick={() => setIsChatOpen(true)}
              className="bg-[#12141a] border border-[#232730] hover:border-[#353b49] p-3.5 rounded-2xl flex flex-col gap-1.5 cursor-pointer transition-all active:scale-[0.98] group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1c202a] border border-[#2f3544] flex items-center justify-center mb-1 group-hover:border-[#aeff00] transition-colors">
                <Mail className="w-4 h-4 text-gray-300 group-hover:text-[#aeff00]" />
              </div>
              <h3 className="text-xs font-bold text-white">Ticket Support</h3>
              <p className="text-[10px] text-gray-400 leading-tight">Send instant ticket to live agent</p>
            </div>

          </div>
        </section>

      </main>

      {/* 5. Bottom Floating Action Button matching Image 2 */}
      <div className="fixed bottom-4 left-0 right-0 max-w-[430px] mx-auto px-4 z-30 pointer-events-none">
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full py-3.5 rounded-full bg-[#12141a]/95 hover:bg-[#1c202a] text-white border border-[#2f3544] font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl backdrop-blur-md pointer-events-auto cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-[#aeff00]" />
          <span>Start Asking</span>
        </button>
      </div>

      {/* Live Support Interactive Chat Modal matching Image 3 */}
      <SupportChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

    </div>
  );
}

export default function SupportHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <SupportHubContent />
    </Suspense>
  );
}
