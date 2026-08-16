"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DevicePreviewFrame({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile', 'tablet', 'full'

  useEffect(() => {
    // Listen for custom dev mode screen mode changes
    const handleDeviceChange = (e) => {
      if (e.detail?.mode) {
        setDeviceMode(e.detail.mode);
      }
    };
    window.addEventListener('dev-screen-mode-change', handleDeviceChange);
    return () => window.removeEventListener('dev-screen-mode-change', handleDeviceChange);
  }, []);

  if (isAdmin || deviceMode === 'full') {
    return (
      <div className="min-h-screen bg-[#000000] text-white w-full font-sans selection:bg-[#aeff00] selection:text-black transition-all duration-300">
        {children}
      </div>
    );
  }

  const maxWidthClass = deviceMode === 'tablet' ? 'max-w-[768px]' : 'max-w-[430px]';

  return (
    <div className="min-h-screen bg-[#06080c] text-white flex justify-center selection:bg-[#aeff00] selection:text-black transition-all duration-300">
      {/* Dynamic Viewport Container */}
      <div className={`w-full ${maxWidthClass} min-h-screen bg-[#000000] border-x border-[#1a1f2c] shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col relative transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
