"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HeroVault from '@/components/HeroVault';
import ActionPortals from '@/components/ActionPortals';
import PromoBanner from '@/components/PromoBanner';
import MarketMatrix from '@/components/MarketMatrix';
import AuthPortalModal from '@/components/AuthPortalModal';
import KycCampaignModal from '@/components/KycCampaignModal';

function HomeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const invCode = searchParams ? (searchParams.get('invCode') || searchParams.get('code') || searchParams.get('ref')) : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUp', 'true');
      if (invCode) {
        localStorage.setItem('pendingInvCode', invCode);
      }
    }
  }, [invCode]);

  const handleOpenAuth = () => {
    const savedCode = invCode || (typeof window !== 'undefined' ? localStorage.getItem('pendingInvCode') : null);
    if (savedCode) {
      router.push(`/auth?mode=register&invCode=${encodeURIComponent(savedCode)}`);
    } else {
      router.push('/auth?mode=register');
    }
  };

  const handleSelectPortal = (portalId) => {
    if (portalId === "p2p") router.push('/p2p');
    else if (portalId === "referral") router.push('/referral');
    else router.push('/markets');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto relative">
      {/* Main App Dashboard Content */}
      <main className="flex-1 flex flex-col gap-0.5 opacity-95">
        <HeroVault
          onOpenAuth={handleOpenAuth}
          onOpenTasks={() => {}}
        />
        <ActionPortals onSelectPortal={handleSelectPortal} />
        <PromoBanner />
        <MarketMatrix
          onSelectPair={() => router.push('/futures')}
          onOpenAuth={handleOpenAuth}
        />
      </main>

      {/* Auth Portal Modal */}
      <AuthPortalModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* KYC Campaign Modal Popup */}
      <KycCampaignModal />
    </div>
  );
}

export default function HomePageRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000]" />}>
      <HomeDashboardContent />
    </Suspense>
  );
}
