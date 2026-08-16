"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/assets?action=deposit');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-[#aeff00] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-400">Loading Deposit Coin Selection...</span>
      </div>
    </div>
  );
}
