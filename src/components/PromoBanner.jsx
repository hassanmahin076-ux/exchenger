"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BANNERS = [
  {
    id: 1,
    image: "/Untitled_design.png",
    fallbackImage: "/home_banner.png",
    link: "/cuponcenter",
    title: "Special Promotion 1"
  },
  {
    id: 2,
    image: "/banner_2_promo.png",
    link: "/cuponcenter",
    title: "Special Promotion 2"
  }
];

export default function PromoBanner() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (BANNERS.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = BANNERS[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.link) {
      router.push(currentBanner.link);
    }
  };

  return (
    <div className="px-3 my-1.5 font-sans select-none">
      <div 
        onClick={handleBannerClick}
        className="w-full relative rounded-2xl overflow-hidden border border-[#2b303c] hover:border-[#3d4456] shadow-xl cursor-pointer group transition-all duration-300 active:scale-[0.99] bg-[#161821] h-[86px] sm:h-[94px] flex items-center justify-center"
      >
        {/* Banner Photo Images with Smooth Fade Transition */}
        {BANNERS.map((banner, idx) => (
          <img 
            key={banner.id}
            src={banner.image} 
            alt={banner.title}
            onError={(e) => {
              if (banner.fallbackImage && e.currentTarget.src !== window.location.origin + banner.fallbackImage) {
                e.currentTarget.src = banner.fallbackImage;
              }
            }}
            className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-500 ease-in-out group-hover:scale-[1.01] ${
              currentIndex === idx ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
            }`}
          />
        ))}

        {/* Top Right Counter Badge overlay (1/2 or 2/2) */}
        {BANNERS.length > 1 && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
              {currentIndex + 1}/{BANNERS.length}
            </div>
          </div>
        )}

        {/* Bottom Slide Indicators (Dots) */}
        {BANNERS.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-4 bg-[#aeff00]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




