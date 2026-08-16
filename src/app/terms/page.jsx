"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
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
          Pokymax User Agreement
        </h1>
        <div className="w-8" />
      </header>

      {/* Pure Text Content (No Boxes / Background Cards) */}
      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        {/* Section 1 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            By registering, accessing, or using the Pokymax platform ("Pokymax", "Exchange", "we", "us"), you agree to be bound by this User Agreement. If you do not agree to these terms, please refrain from using our services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            2. Account Eligibility & Security
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Users must be at least 18 years old or of legal age in their jurisdiction. You are responsible for maintaining the confidentiality of your account credentials, passkeys, two-factor authentication (2FA), and security codes.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            3. Risk Disclosure & Trading
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Digital asset trading involves substantial risk of loss. Prices of cryptocurrencies are highly volatile. Leverage trading and perpetual futures carry heightened financial risk. You trade at your own risk and discretion on Pokymax.
          </p>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold text-[#aeff00]">
            4. Prohibited Activities
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Market manipulation, wash trading, fraudulent activity, unauthorized API scraping, and exploitation of platform vulnerabilities are strictly prohibited and will result in immediate account suspension.
          </p>
        </section>
      </main>
    </div>
  );
}
