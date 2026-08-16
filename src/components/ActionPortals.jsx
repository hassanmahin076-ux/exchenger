"use client";

import React from 'react';
import { 
  Users, 
  Gift, 
  UserPlus, 
  Ticket, 
  Headphones, 
  RefreshCw, 
  QrCode, 
  ShoppingBag, 
  Box, 
  Grid 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActionPortals({ onSelectPortal }) {
  const router = useRouter();

  // ROW 1: P2P | Reward Hub | Referral | Coupon | Support
  const ROW1_ITEMS = [
    { id: "p2p", label: "P2P", icon: Users, path: "/p2p" },
    { id: "reward", label: "Reward Hub", icon: Gift, badge: "HOT", path: "/cuponcenter" },
    { id: "referral", label: "Referral", icon: UserPlus, path: "/referral" },
    { id: "coupon", label: "Coupon", icon: Ticket, path: "/cuponcenter" },
    { id: "support", label: "Support", icon: Headphones, path: "/support" }
  ];

  // ROW 2: Convert | Pokyscan | Pokystore | Crypto Box | More (Profile)
  const ROW2_ITEMS = [
    { id: "convert", label: "Convert", icon: RefreshCw, path: "/trade" },
    { id: "pokyscan", label: "Pokyscan", icon: QrCode, path: "/pokyscan" },
    { id: "pokystore", label: "Pokystore", icon: ShoppingBag, path: "/pokymaxstorapps" },
    { id: "cryptobox", label: "Crypto Box", icon: Box, path: "/cryptobox" },
    { id: "more", label: "More", icon: Grid, path: "/profile" }
  ];

  const handleItemClick = (item) => {
    if (item.path) {
      router.push(item.path);
    } else if (onSelectPortal) {
      onSelectPortal(item.id);
    }
  };

  return (
    <section className="-mt-1.5 mb-2 px-2 flex flex-col gap-2">
      {/* Row 1 Action Buttons */}
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {ROW1_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-start group cursor-pointer"
            >
              {/* Icon Box */}
              <div className="relative w-12 h-12 rounded-2xl bg-[#181a20] group-hover:bg-[#252830] border border-[#2b2f36] flex items-center justify-center mb-1.5 transition-colors">
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1 bg-[#aeff00] text-black font-black text-[9px] px-1 py-0.2 rounded-md tracking-tighter shadow-sm">
                    {item.badge}
                  </span>
                )}
                <Icon className="w-5 h-5 text-gray-200 group-hover:text-[#aeff00] transition-colors" />
              </div>

              {/* Label */}
              <span className="text-[11px] text-gray-300 font-normal leading-tight max-w-[64px] truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Row 2 Action Buttons */}
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {ROW2_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-start group cursor-pointer"
            >
              {/* Icon Box */}
              <div className="relative w-12 h-12 rounded-2xl bg-[#181a20] group-hover:bg-[#252830] border border-[#2b2f36] flex items-center justify-center mb-1.5 transition-colors">
                <Icon className="w-5 h-5 text-gray-200 group-hover:text-[#aeff00] transition-colors" />
              </div>

              {/* Label */}
              <span className="text-[11px] text-gray-300 font-normal leading-tight max-w-[64px] truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
