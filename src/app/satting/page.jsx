"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Camera, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X, 
  LogOut,
  Sparkles
} from 'lucide-react';

const formatMaskedEmail = (rawEmail) => {
  if (!rawEmail) return "ala12**@gmail.com";
  const str = rawEmail.trim();
  if (!str.includes('@')) {
    if (str.length > 5) {
      return `${str.slice(0, 5)}**`;
    }
    return `${str}**`;
  }

  const [name, domain] = str.split('@');
  if (name.length <= 2) {
    return `${name}**@${domain}`;
  } else {
    return `${name.slice(0, 5)}**@${domain}`;
  }
};

export default function SattingPage() {
  const router = useRouter();
  const avatarInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [displayEmail, setDisplayEmail] = useState("ala12**@gmail.com");
  const [rawEmail, setRawEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [userUid, setUserUid] = useState("555345079");

  // Modal / Form state for Change Password
  const [showPassModal, setShowPassModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Modal / Form state for Edit Profile Name
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [inputName, setInputName] = useState("");

  // Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    const savedEmail = localStorage.getItem('userEmail');
    const savedUid = localStorage.getItem('userUid');
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedName = localStorage.getItem('userDisplayName');

    if (auth !== null) {
      setIsLoggedIn(auth === 'true');
    } else {
      setIsLoggedIn(false);
    }

    if (savedEmail) {
      setRawEmail(savedEmail);
      setDisplayEmail(formatMaskedEmail(savedEmail));
    }

    if (savedUid) {
      setUserUid(savedUid);
    }

    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }

    if (savedName) {
      setCustomName(savedName);
      setInputName(savedName);
    } else if (savedEmail) {
      const defaultName = savedEmail.split('@')[0];
      setCustomName(defaultName);
      setInputName(defaultName);
    }
  }, []);

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result;
        setUserAvatar(base64Image);
        localStorage.setItem('userAvatar', base64Image);
        setSuccessMsg("Profile picture updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Display Name Handler
  const handleSaveName = (e) => {
    e?.preventDefault();
    if (inputName.trim()) {
      setCustomName(inputName.trim());
      localStorage.setItem('userDisplayName', inputName.trim());
      setShowEditNameModal(false);
      setSuccessMsg("Display name updated!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Change Password Handler
  const handleChangePassword = (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!oldPass) {
      setErrorMsg("Please enter your current password.");
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    localStorage.setItem('userPassword', newPass);
    setShowPassModal(false);
    setSuccessMsg("Password updated successfully!");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userUid');
    localStorage.removeItem('userAvatarUrl');
    window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: false } }));
    setIsLoggedIn(false);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-12 select-none">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#141822] w-full">
        <button
          onClick={() => router.push('/profile')}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Profile"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight text-center">
          Settings
        </h1>

        <div className="w-8" />
      </header>

      {/* Main Settings Body */}
      <div className="px-4 pt-4 flex flex-col gap-4 w-full max-w-[430px] mx-auto">
        
        {/* Toast Alerts */}
        {successMsg && (
          <div className="w-full bg-[#00c076]/10 border border-[#00c076]/40 text-[#00c076] text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Hidden File Input for Avatar */}
        <input 
          type="file" 
          ref={avatarInputRef} 
          onChange={handleAvatarChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Profile Card Section */}
        <div className="w-full bg-[#13151c] border border-[#202432] rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3.5">
            {/* Avatar Photo with Upload Icon Overlay */}
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-14 h-14 rounded-full bg-[#84cc16] flex items-center justify-center overflow-hidden cursor-pointer group shadow-md border border-white/10"
              title="Click to Upload Profile Picture"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-9 h-9 text-[#161920]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {customName || displayEmail}
              </h2>
              <span className="text-xs text-gray-400 font-mono">UID: {userUid}</span>
            </div>
          </div>

          <button
            onClick={() => avatarInputRef.current?.click()}
            className="text-xs font-bold text-[#aeff00] hover:underline flex items-center gap-1 cursor-pointer bg-[#aeff00]/10 border border-[#aeff00]/30 px-3 py-1.5 rounded-full"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Pic</span>
          </button>
        </div>

        {/* Vertical List matching attached screenshot */}
        <div className="flex flex-col divide-y divide-[#181b22] border-t border-b border-[#181b22] w-full my-1">
          
          {/* Edit Display Name */}
          <button
            onClick={() => setShowEditNameModal(true)}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Edit Nickname / Name
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="font-semibold text-gray-300">{customName || "Set Name"}</span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </div>
          </button>

          {/* Change Password */}
          <button
            onClick={() => setShowPassModal(true)}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#aeff00]" />
              <span>Change Password</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Security</span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </div>
          </button>

          {/* Suggestions */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Suggestions
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          </button>

          {/* Product Changelog */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Product Changelog
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6] inline-block" title="New update" />
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </div>
          </button>

          {/* Customer Support */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Customer Support
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          </button>

          {/* Help Center */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Help Center
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          </button>

          {/* About Pokymax */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              About Pokymax
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          </button>

          {/* Select Server */}
          <button
            onClick={() => {}}
            className="py-3.5 flex items-center justify-between text-left group hover:bg-[#14161d] px-2 rounded-xl transition-colors w-full cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
              Select Server
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 font-medium">Auto Select</span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </div>
          </button>

        </div>

        {/* Log Out Action Button */}
        {isLoggedIn && (
          <div className="mt-4 w-full flex justify-center pb-6">
            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-2xl bg-[#2b1719] hover:bg-[#381c1f] border border-[#d32f2f]/40 text-[#ff5252] font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Edit Name / Nickname */}
      {/* ========================================================= */}
      {showEditNameModal && (
        <div 
          onClick={() => setShowEditNameModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] bg-[#14161d] border border-[#232732] rounded-3xl p-5 flex flex-col gap-4 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#232732]">
              <h3 className="text-base font-bold text-white">Edit Nickname</h3>
              <button 
                onClick={() => setShowEditNameModal(false)}
                className="w-7 h-7 rounded-full bg-[#1e222e] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveName} className="flex flex-col gap-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter new nickname"
                className="w-full bg-[#1b1e27] border border-[#262a37] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#aeff00]"
                required
              />

              <button
                type="submit"
                className="w-full py-3 bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              >
                Save Name
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Change Password */}
      {/* ========================================================= */}
      {showPassModal && (
        <div 
          onClick={() => setShowPassModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] bg-[#14161d] border border-[#232732] rounded-3xl p-5 flex flex-col gap-4 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#232732]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#aeff00]" />
                <h3 className="text-base font-bold text-white">Change Password</h3>
              </div>
              <button 
                onClick={() => setShowPassModal(false)}
                className="w-7 h-7 rounded-full bg-[#1e222e] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="w-full bg-[#ff3b30]/10 border border-[#ff3b30]/40 text-[#ff3b30] text-xs px-3 py-2 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-3.5">
              
              {/* Field 1: Current Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#1b1e27] border border-[#262a37] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#aeff00]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full bg-[#1b1e27] border border-[#262a37] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#aeff00]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 3: Confirm New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-300 font-medium">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#1b1e27] border border-[#262a37] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#aeff00]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-lg active:scale-[0.98] mt-2 cursor-pointer"
              >
                Update Password
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
