"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  X, 
  Gift, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Tag,
  Coins,
  Inbox
} from 'lucide-react';

export default function MyRewardsPage() {
  const router = useRouter();

  const [kycStatus, setKycStatus] = useState("unverified");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isKycClaimed, setIsKycClaimed] = useState(false);
  const [isCouponClaimed, setIsCouponClaimed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKyc = localStorage.getItem('kycStatus') || "unverified";
      setKycStatus(savedKyc);

      const applied = localStorage.getItem('taskCouponApplied') === 'true';
      setIsCouponApplied(applied);

      const kycClaimed = localStorage.getItem('taskKycClaimed') === 'true';
      setIsKycClaimed(kycClaimed);

      const couponClaimed = localStorage.getItem('taskCouponClaimed') === 'true';
      setIsCouponClaimed(couponClaimed);
    }
  }, []);

  // Construct dynamic rewards list based on state
  const rewardsList = [];

  // 1. KYC Task Reward
  if (kycStatus === 'pending' || kycStatus === 'under_review' || isKycClaimed || kycStatus === 'verified' || kycStatus === 'approved') {
    const isPending = kycStatus === 'pending' || kycStatus === 'under_review';
    rewardsList.push({
      id: 'kyc-reward',
      title: 'KYC Bonus 2.1 USDT',
      amount: '2.1',
      unit: 'USDT',
      status: isKycClaimed ? 'claimed' : (isPending ? 'pending' : 'claimable'),
      badgeText: isKycClaimed ? 'Claimed ✓' : (isPending ? '2.1$ Pending' : 'Claimable'),
      taskType: 'Identity Verification Task',
      rewardType: 'Spot',
      note: 'Complete identity verification to receive $2.1 instant spot reward.'
    });
  }

  // 2. Deposit 10 USDT & Fast 10$ Spot Trade Reward
  rewardsList.push({
    id: 'spot-trade-reward',
    title: 'Deposit 10 USDT & Fast 10$ Spot Trade',
    amount: '4',
    unit: 'USDT',
    status: 'pending',
    badgeText: '4$ Pending',
    taskType: 'Deposit & Trade Task',
    rewardType: 'Spot',
    note: 'Deposit min 10 USDT & trade 10$ in Spot to activate $4 instant spot withdraw balance.'
  });

  // Filter rewards list by active tab
  const filteredRewards = rewardsList.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'claimed') return item.status === 'claimed';
    return true;
  });

  const pendingCount = rewardsList.filter(r => r.status === 'pending').length;
  const claimedCount = rewardsList.filter(r => r.status === 'claimed').length;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-16 select-none relative">
      
      {/* Header Bar matching Campaign Center */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#141822] w-full">
        
        {/* Left: Back Arrow to Campaign Center */}
        <button
          onClick={() => router.push('/camaincenter')}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Campaign Center"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Center Title */}
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight text-center">
          My Rewards
        </h1>

        {/* Right: Pill Button with ... and X */}
        <div className="flex items-center bg-[#1e222d] border border-[#2b303f] rounded-full px-2.5 py-1 gap-2">
          <button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-3.5 bg-gray-600/60" />
          <button 
            onClick={() => router.push('/camaincenter')}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main My Rewards Container */}
      <div className="px-4 pt-4 flex flex-col gap-4 w-full max-w-[430px] mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#14161d] border border-[#222633] p-1 rounded-full text-xs font-bold">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center ${
              activeTab === "all" ? "bg-[#252a38] text-white shadow-md" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            All Rewards ({rewardsList.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center ${
              activeTab === "pending" ? "bg-[#252a38] text-white shadow-md" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("claimed")}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer text-center ${
              activeTab === "claimed" ? "bg-[#252a38] text-white shadow-md" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Claimed ({claimedCount})
          </button>
        </div>

        {/* Rewards List */}
        <div className="flex flex-col gap-3 mt-1">
          {filteredRewards.length > 0 ? (
            filteredRewards.map((reward) => (
              <div 
                key={reward.id} 
                className="relative bg-[#16171b] border border-[#24262d] hover:border-[#353a47] rounded-[24px] p-5 flex flex-col gap-3.5 shadow-xl transition-all"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Badge Icon */}
                    <div className="relative bg-gradient-to-r from-[#97f252] via-[#85e640] to-[#55c826] text-[#0d2e02] px-3 py-2 rounded-2xl flex flex-col items-center justify-center font-black shadow-md flex-shrink-0">
                      <span className="text-base leading-none">{reward.amount}</span>
                      <span className="text-[9px] mt-0.5 tracking-tight font-extrabold">{reward.unit}</span>
                    </div>

                    <div>
                      <h3 className="text-white font-bold text-base tracking-tight">{reward.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{reward.taskType}</p>
                    </div>
                  </div>

                  {/* Dynamic Status Pill (Static, no blinking animation) */}
                  {reward.status === 'pending' ? (
                    <span className="bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>{reward.badgeText}</span>
                    </span>
                  ) : reward.status === 'claimed' ? (
                    <span className="bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>Claimed ✓</span>
                    </span>
                  ) : (
                    <span className="bg-[#85e640]/20 border border-[#85e640]/40 text-[#85e640] text-xs font-black px-3 py-1 rounded-full flex-shrink-0">
                      Claimable
                    </span>
                  )}
                </div>

                {/* Info Metadata Box */}
                <div className="bg-[#101217] border border-[#1f222b] rounded-xl p-3 flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-400">Task Type:</span>
                    <span className="font-bold text-white">{reward.taskType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-[#85e640]" />
                    <span className="text-gray-400">Reward Type:</span>
                    <span className="font-extrabold text-[#85e640] bg-[#85e640]/10 px-2 py-0.5 rounded border border-[#85e640]/20">
                      {reward.rewardType}
                    </span>
                  </div>
                </div>

                {/* Additional Note */}
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  {reward.note}
                </p>

              </div>
            ))
          ) : (
            /* Empty State */
            <div className="bg-[#16171b] border border-[#24262d] rounded-[24px] p-8 flex flex-col items-center justify-center text-center gap-3 shadow-xl my-4 select-none">
              <div className="w-16 h-16 rounded-full bg-[#202430] border border-[#2e3447] flex items-center justify-center text-gray-400 mb-1">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-extrabold text-base">No Rewards Found</h3>
              <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed">
                You have no active or pending rewards in this category yet.
              </p>
              <button
                onClick={() => router.push('/camaincenter')}
                className="mt-2 bg-[#85e640] hover:bg-[#76d335] text-[#0c2e02] font-black text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to Campaign Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
