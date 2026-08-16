"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, ArrowLeftRight, FileText, Wallet } from 'lucide-react';

export default function BottomDock() {
  const pathname = usePathname();

  if (
    pathname === '/' ||
    pathname?.startsWith('/pokymaxstorapps') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/camaincenter') || 
    pathname?.startsWith('/referral') ||
    pathname?.startsWith('/kycverifyed') ||
    pathname?.startsWith('/terms') ||
    pathname?.startsWith('/trams') ||
    pathname?.startsWith('/privacy') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/p2p')
  ) {
    return null;
  }

  const NAV_ITEMS = [
    { id: "home", label: "Home", path: "/home", icon: Home },
    { id: "markets", label: "Markets", path: "/markets", icon: BarChart2 },
    { id: "trade", label: "Trade", path: "/trade", icon: ArrowLeftRight },
    { id: "futures", label: "Futures", path: "/futures", icon: FileText },
    { id: "wallets", label: "Wallets", path: "/assets", icon: Wallet }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto z-40 bg-[#000000] border-t border-[#141822] px-2 py-2">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/home' && (pathname === '/home' || pathname === '/')) || (item.path !== '/' && item.path !== '/home' && pathname?.startsWith(item.path));
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive ? 'text-white font-bold' : 'text-[#848e9c] hover:text-gray-200'
              }`}
            >
              <div className="p-1 rounded-full">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#848e9c]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-white font-semibold' : 'text-[#848e9c]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

