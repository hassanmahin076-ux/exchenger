"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function KycCampaignModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has done KYC
    const savedKycStatus = localStorage.getItem('kycStatus');
    const isKycSubmitted = localStorage.getItem('kycSubmitted') === 'true';

    const hasDoneKyc = 
      isKycSubmitted || 
      savedKycStatus === 'pending' || 
      savedKycStatus === 'under_review' || 
      savedKycStatus === 'verified' ||
      savedKycStatus === 'Verified';

    // Check if popup was already dismissed in this session
    const isDismissed = sessionStorage.getItem('kycCampaignPopupDismissed') === 'true';

    if (hasDoneKyc && !isDismissed) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-close after 40 seconds (40000ms) if not clicked
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 40000);

    return () => clearTimeout(autoCloseTimer);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kycCampaignPopupDismissed', 'true');
    }
  };

  const handleImageClick = () => {
    handleClose();
    router.push('/camaincenter');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Phone-width overlay container matching site mobile border */}
      <div className="w-full max-w-[430px] h-full flex flex-col items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto relative animate-fadeIn border-x border-[#1a1f2c] shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        
        {/* Overlay Backdrop Click inside phone frame */}
        <div 
          className="absolute inset-0" 
          onClick={handleClose} 
        />

        {/* Modal Container */}
        <div className="relative z-10 flex flex-col items-center max-w-[310px] sm:max-w-[340px] w-full animate-scaleUp">
          
          {/* Banner Picture - Clickable to /camaincenter */}
          <div 
            onClick={handleImageClick}
            className="w-full relative rounded-3xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
          >
            <img 
              src="/kyc_campaign_popup.png" 
              alt="KYC Campaign Banner" 
              className="w-full h-auto object-contain rounded-3xl"
            />
          </div>

          {/* Close Button Below Picture */}
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/40 flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
