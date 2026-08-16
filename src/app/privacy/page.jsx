"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans max-w-[430px] mx-auto relative pb-12">
      {/* Top Header with Back Button */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#181a20]">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-bold text-white tracking-tight">
          Pokymax Privacy Policy
        </h1>
        <div className="w-8" />
      </header>

      {/* Pure Text Content (No Boxes / Background Cards) */}
      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        {/* Section 1 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            1. Information We Collect
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Pokymax collects account information (such as email address or mobile number), device identifiers, IP addresses, and transaction metadata strictly necessary for secure account management and exchange operations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            2. How Data is Used
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your data is used to provide crypto trading, process transactions, protect against unauthorized access, fulfill regulatory requirements (such as KYC/AML verification), and improve user experience.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            3. Data Protection & Encryption
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            We utilize enterprise-grade encryption (TLS/AES-256), multi-signature cold storage protection, and biometric passkeys to safeguard your information and assets against loss or compromise.
          </p>
        </section>
      </main>
    </div>
  );
}
