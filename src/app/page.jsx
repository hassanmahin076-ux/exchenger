"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LandingPage from '../components/LandingPage';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invCode = searchParams ? (searchParams.get('invCode') || searchParams.get('code') || searchParams.get('ref')) : null;
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        router.replace('/home');
        return;
      }
      if (invCode) {
        localStorage.setItem('pendingInvCode', invCode);
      }
    }
    setIsCheckingAuth(false);
  }, [invCode, router]);

  useEffect(() => {
    // Intercept back navigation when logged in
    const handlePageShow = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') {
        router.replace('/home');
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

  useEffect(() => {
    // If visitor enters via an invite link like http://localhost:3000/?invCode=PKMX839A, redirect to /home with invCode
    if (invCode) {
      router.replace(`/home?invCode=${encodeURIComponent(invCode)}`);
    }
  }, [invCode, router]);

  if (invCode || isCheckingAuth) {
    return null;
  }

  return <LandingPage />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0e11]" />}>
      <HomeContent />
    </Suspense>
  );
}
