"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown, 
  XCircle, 
  CheckCircle2, 
  Sparkles,
  X,
  Check,
  Search,
  Calendar as CalendarIcon,
  Plus,
  User,
  Clock
} from 'lucide-react';

const ALL_COUNTRIES = [
  { name: "Timor-Leste", code: "tl" },
  { name: "Tokelau", code: "tk" },
  { name: "Tajikistan", code: "tj" },
  { name: "Thailand", code: "th" },
  { name: "Togo", code: "tg" },
  { name: "French Southern and Antarctic Lands", code: "tf" },
  { name: "Guyana", code: "gy" },
  { name: "Chad", code: "td" },
  { name: "Turks and Caicos Islands", code: "tc" },
  { name: "Bangladesh", code: "bd" },
  { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Canada", code: "ca" },
  { name: "Australia", code: "au" },
  { name: "Germany", code: "de" },
  { name: "United Arab Emirates", code: "ae" },
  { name: "India", code: "in" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "Singapore", code: "sg" },
  { name: "Malaysia", code: "my" },
  { name: "Japan", code: "jp" },
  { name: "South Korea", code: "kr" },
  { name: "France", code: "fr" },
  { name: "Italy", code: "it" },
  { name: "Brazil", code: "br" }
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEARS_LIST = Array.from({ length: 65 }, (_, i) => 2026 - i);

export default function KycVerifiedPage() {
  const router = useRouter();
  
  // Step state: 
  // 1 = Overview (Image 1)
  // 2 = Enter information Form (Image 2)
  // 3 = Upload images (Image 3)
  // 4 = Under Review Screen (3rd Image matching)
  const [step, setStep] = useState(1);
  const [kycStatus, setKycStatus] = useState("unverified");

  // Form State for Step 2
  const [country, setCountry] = useState("Bangladesh");
  const [documentType, setDocumentType] = useState("ID card");
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  // Upload Images State for Step 3
  const [frontImage, setFrontImage] = useState(null);
  const [rearImage, setRearImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frontInputRef = useRef(null);
  const rearInputRef = useRef(null);

  // Modal States
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false);
  const [showPrepareDocsModal, setShowPrepareDocsModal] = useState(false);
  const [showSubmittedSuccessModal, setShowSubmittedSuccessModal] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");

  // Interactive Calendar State
  const [calYear, setCalYear] = useState(2000);
  const [calMonth, setCalMonth] = useState(7); // 7 = August
  const [calDay, setCalDay] = useState(15);
  const [showYearGrid, setShowYearGrid] = useState(false);

  const [frontBase64, setFrontBase64] = useState(null);
  const [rearBase64, setRearBase64] = useState(null);

  // Helper to convert File to Base64
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // Check saved & database KYC status on mount
  useEffect(() => {
    const savedKyc = localStorage.getItem('kycStatus');
    const savedUid = localStorage.getItem('userUid');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedKyc === 'pending' || savedKyc === 'under_review' || savedKyc === 'verified') {
      setKycStatus(savedKyc);
      setStep(4);
    }

    if (savedUid || savedEmail) {
      fetch(`/api/kyc/status?uid=${encodeURIComponent(savedUid || '')}&email=${encodeURIComponent(savedEmail || '')}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.kycStatus) {
            const statusLower = data.kycStatus.toLowerCase();
            localStorage.setItem('kycStatus', statusLower);
            setKycStatus(statusLower);
            if (statusLower === 'pending' || statusLower === 'under_review' || statusLower === 'verified') {
              setStep(4);
            }
          }
        })
        .catch(err => console.warn('Could not fetch KYC status from server:', err));
    }
  }, []);

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const isFormValid = idNumber.trim() !== "" && firstName.trim() !== "" && lastName.trim() !== "" && dob.trim() !== "";

  // Step 2 Form submission -> Opens 2nd Image Modal ("Prepare Your Identification Documents")
  const handleStep2Next = (e) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setShowPrepareDocsModal(true);
  };

  // Prepare Docs Modal "Verify now" -> Go to Step 3 ("Upload images" screen matching 3rd Image)
  const handleProceedToUpload = () => {
    setShowPrepareDocsModal(false);
    setStep(3);
  };

  // Image Upload Handlers
  const handleFrontFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontImage(URL.createObjectURL(file));
      try {
        const base64 = await fileToBase64(file);
        setFrontBase64(base64);
      } catch (err) {
        console.error('Base64 error:', err);
      }
    } else {
      setFrontImage("uploaded");
    }
  };

  const handleRearFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRearImage(URL.createObjectURL(file));
      try {
        const base64 = await fileToBase64(file);
        setRearBase64(base64);
      } catch (err) {
        console.error('Base64 error:', err);
      }
    } else {
      setRearImage("uploaded");
    }
  };

  // Step 3 Upload Submit (2/2) -> Submits to PostgreSQL API
  const handleUploadSubmit = async () => {
    setIsSubmitting(true);
    try {
      const savedUid = localStorage.getItem('userUid');
      const savedEmail = localStorage.getItem('userEmail');

      const payload = {
        userUid: savedUid,
        userEmail: savedEmail,
        firstName,
        lastName,
        country,
        documentType,
        idNumber,
        dob,
        frontImage: frontBase64,
        rearImage: rearBase64,
      };

      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        localStorage.setItem('kycStatus', 'pending');
        localStorage.setItem('kycSubmitted', 'true');
        setKycStatus('pending');
        setShowSubmittedSuccessModal(true);
      } else {
        alert(data.error || 'Failed to submit KYC. Please try again.');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setIsSubmitting(false);
      alert('Network error submitting KYC application. Please try again.');
    }
  };

  // Calendar Helper Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOffset = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleConfirmCalendar = () => {
    const monthStr = MONTH_NAMES[calMonth].substring(0, 3);
    setDob(`${monthStr} ${calDay}, ${calYear}`);
    setShowDobModal(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans w-full pb-12 select-none">
      
      {/* Dynamic Header Bar */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#141822] w-full">
        <button
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else if (step === 3) {
              setStep(2);
            } else {
              if (typeof window !== 'undefined') {
                window.location.href = '/profile';
              } else {
                router.push('/profile');
              }
            }
          }}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors -ml-1 cursor-pointer"
          title="Back to Profile"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight text-center">
          {step === 1 
            ? "Identity Verification" 
            : step === 2 
            ? "Enter information" 
            : step === 3 
            ? "Upload images" 
            : "Identity Verification"}
        </h1>

        <div className="w-8" />
      </header>

      {/* Main Content Area */}
      <div className="px-4 pt-4 flex flex-col flex-1 w-full max-w-[430px] mx-auto">

        {/* STEP 1: Overview Screen matching 1st Image */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center gap-5 pt-2 pb-6">
            
            {/* Logo Image from /public/kyc_image_1.png */}
            <div className="relative my-2 flex items-center justify-center group">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <img 
                src="/kyc_image_1.png" 
                alt="KYC Logo" 
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain drop-shadow-[0_12px_24px_rgba(255,255,255,0.25)] transition-transform hover:scale-105" 
              />
            </div>

            {/* Title, Instant $2 Bonus Callout & Description */}
            <div className="flex flex-col gap-2 items-center">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Verify Your Identity
              </h2>

              {/* Instant $2 Token Bonus Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#aeff00]/10 border border-[#aeff00]/40 text-[#aeff00] px-3.5 py-1 rounded-full text-xs font-bold my-0.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Instant $2 Token & Spot Rewards</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto px-2">
                Complete identity verification to claim an instant $2 USDT token reward, unlock spot trading privileges, keep your account secure, and enjoy full platform services with ease.
              </p>
            </div>

            {/* Account Benefits Card Table */}
            <div className="w-full bg-[#181a20] border border-[#262a36] rounded-2xl p-3.5 flex flex-col gap-3 shadow-xl my-1 overflow-hidden">
              <div className="grid grid-cols-12 text-xs font-bold text-white pb-2.5 border-b border-[#292e3d]">
                <div className="col-span-5 text-left text-white tracking-tight truncate pr-0.5">Account Benefits</div>
                <div className="col-span-4 text-center text-white truncate">Current</div>
                <div className="col-span-3 text-right text-white truncate">After</div>
              </div>

              {/* Row 1: Crypto Withdrawal */}
              <div className="grid grid-cols-12 items-center text-[11px] sm:text-xs py-0.5">
                <div className="col-span-5 text-left text-gray-300 font-normal truncate pr-0.5">
                  Crypto Withdrawal
                </div>
                <div className="col-span-4 text-center text-gray-300 font-medium text-[10px] sm:text-[11px] truncate">
                  500,000 USDT
                </div>
                <div className="col-span-3 text-right font-semibold text-[#00c076] text-[10px] sm:text-[11px] truncate">
                  2,000,000 USDT
                </div>
              </div>

              {/* Row 2: Fiat Deposit */}
              <div className="grid grid-cols-12 items-center text-[11px] sm:text-xs py-0.5">
                <div className="col-span-5 text-left text-gray-300 font-normal truncate pr-0.5">
                  Fiat Deposit
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#2d323e] border border-gray-600/40 flex items-center justify-center text-gray-400">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-end">
                  <div className="w-4 h-4 rounded-full bg-[#00c076] flex items-center justify-center text-black shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Row 3: Fiat Withdrawal */}
              <div className="grid grid-cols-12 items-center text-[11px] sm:text-xs py-0.5">
                <div className="col-span-5 text-left text-gray-300 font-normal truncate pr-0.5">
                  Fiat Withdrawal
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#2d323e] border border-gray-600/40 flex items-center justify-center text-gray-400">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-end">
                  <div className="w-4 h-4 rounded-full bg-[#00c076] flex items-center justify-center text-black shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="w-full flex flex-col gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-full bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg"
              >
                <span>Verify Now</span>
              </button>

              <button
                onClick={() => {}}
                className="text-xs text-gray-400 hover:text-white transition-colors text-center py-1 cursor-pointer"
              >
                Institutional Verification
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Enter Information Form */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="flex flex-col gap-4 py-2">
            
            {/* Top Blue Notice Alert */}
            <div className="w-full bg-[#00274c] border border-[#004b93]/40 rounded-[8px] p-3.5 text-xs text-[#0a84e6] font-medium leading-snug">
              *Make sure that the information entered matches the documents to be uploaded, otherwise they will be rejected.
            </div>

            {/* Field 1: Country / Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                Country / Region
              </label>
              <div 
                onClick={() => setShowCountryModal(true)}
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm text-white flex items-center justify-between cursor-pointer hover:border-gray-600 transition-colors"
              >
                <span className="font-normal">{country}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Field 2: Document type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                Document type
              </label>
              <div 
                onClick={() => setShowDocModal(true)}
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm text-white flex items-center justify-between cursor-pointer hover:border-gray-600 transition-colors"
              >
                <span className={documentType ? "text-white font-normal" : "text-[#555d6e]"}>
                  {documentType || "Select your document type"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Field 3: ID Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter your ID number"
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm text-white placeholder-[#555d6e] focus:outline-none focus:border-[#aeff00] transition-colors"
                required
              />
            </div>

            {/* Field 4: First name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm text-white placeholder-[#555d6e] focus:outline-none focus:border-[#aeff00] transition-colors"
                required
              />
            </div>

            {/* Field 5: Last name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm text-white placeholder-[#555d6e] focus:outline-none focus:border-[#aeff00] transition-colors"
                required
              />
            </div>

            {/* Field 6: Date of birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-gray-200 font-medium">
                Date of birth
              </label>
              <div 
                onClick={() => setShowDobModal(true)}
                className="w-full bg-[#13151b] border border-[#202330] rounded-[7px] px-3.5 py-3 text-xs sm:text-sm flex items-center justify-between cursor-pointer hover:border-gray-600 transition-colors"
              >
                <span className={dob ? "text-white font-normal" : "text-[#555d6e]"}>
                  {dob || "Select your date of birth"}
                </span>
                <CalendarIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Submit Button (Next 1/2) */}
            <div className="mt-4 pb-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isFormValid 
                    ? "bg-[#aeff00] hover:bg-[#9ef000] text-black active:scale-[0.98] cursor-pointer shadow-lg font-extrabold" 
                    : "bg-[#222531] text-[#555d70] cursor-not-allowed font-semibold"
                }`}
              >
                <span>Next (1/2)</span>
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Upload Images */}
        {step === 3 && (
          <div className="flex flex-col gap-4 py-2">
            
            {/* Top Blue Notice Alert */}
            <div className="w-full bg-[#00274c] border border-[#004b93]/40 rounded-[8px] p-3.5 text-xs text-[#0a84e6] font-medium leading-relaxed">
              *Please upload a clear photo ID, must be able to read the ID number and name.
              <br />
              Only PNG, JPEG, JPEG formats are supported, and each size is limited to 5M.
            </div>

            {/* Hidden File Inputs */}
            <input 
              type="file" 
              ref={frontInputRef} 
              onChange={handleFrontFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={rearInputRef} 
              onChange={handleRearFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Upload Box 1: Front side of ID */}
            <div 
              onClick={() => frontInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#232838] hover:border-[#aeff00]/60 bg-[#12141c] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
            >
              {frontImage && frontImage !== "uploaded" ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/20">
                  <img src={frontImage} alt="Front ID" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00c076]" />
                    <span>Front ID Loaded</span>
                  </div>
                </div>
              ) : frontImage === "uploaded" ? (
                <div className="flex flex-col items-center gap-2 text-[#00c076]">
                  <CheckCircle2 className="w-10 h-10" />
                  <span className="text-xs font-bold text-white">Front ID Uploaded</span>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full bg-[#1e2330] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Upload front side of the ID
                  </span>
                </>
              )}
            </div>

            {/* Upload Box 2: Rear side of ID */}
            <div 
              onClick={() => rearInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#232838] hover:border-[#aeff00]/60 bg-[#12141c] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
            >
              {rearImage && rearImage !== "uploaded" ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/20">
                  <img src={rearImage} alt="Rear ID" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00c076]" />
                    <span>Rear ID Loaded</span>
                  </div>
                </div>
              ) : rearImage === "uploaded" ? (
                <div className="flex flex-col items-center gap-2 text-[#00c076]">
                  <CheckCircle2 className="w-10 h-10" />
                  <span className="text-xs font-bold text-white">Rear ID Uploaded</span>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full bg-[#1e2330] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Upload the rear side of the ID
                  </span>
                </>
              )}
            </div>

            {/* Submit (2/2) Button */}
            <div className="mt-6 pb-4">
              <button
                onClick={() => {
                  if (!frontImage) setFrontImage("uploaded");
                  if (!rearImage) setRearImage("uploaded");
                  handleUploadSubmit();
                }}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit (2/2)</span>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Under Review Screen 100% matching 3rd Image */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-5 pt-3 pb-6 my-auto">
            
            {/* Under Review Logo Image from /public/kyc_ending_photo.png (Prominent & Larger) */}
            <div className="relative my-2 flex items-center justify-center group">
              <div className="absolute inset-0 bg-[#0a84e6]/15 rounded-full blur-3xl pointer-events-none" />
              <img 
                src="/kyc_ending_photo.png" 
                alt="Under Review Logo" 
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain drop-shadow-[0_12px_24px_rgba(10,132,230,0.3)] transition-transform hover:scale-105" 
              />
            </div>

            {/* Title & Description matching Verified / Under Review */}
            <div className="flex flex-col gap-1.5">
              {kycStatus === 'verified' || kycStatus === 'Verified' ? (
                <>
                  <h2 className="text-xl font-bold text-[#0ecb81] tracking-wide flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#0ecb81]" />
                    <span>Identity Verified</span>
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto px-2">
                    Your KYC identity verification has been approved! You now have full access to exchange features and $2.10 USDT reward has been credited to your account.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#0a84e6] tracking-wide">
                    Under review
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto px-2">
                    Your verification has been submitted and is under review. Please wait for the result.
                  </p>
                </>
              )}
            </div>

            {/* Account Benefits Card Table matching 3rd Image */}
            <div className="w-full bg-[#181a20] border border-[#262a36] rounded-2xl p-4 flex flex-col gap-4 shadow-xl my-1">
              <div className="grid grid-cols-12 text-sm font-semibold text-white pb-3 border-b border-[#292e3d]">
                <div className="col-span-5 text-left text-white tracking-tight">Account Benefits</div>
                <div className="col-span-4 text-center text-white">Current</div>
                <div className="col-span-3 text-right pr-0.5 text-white">After</div>
              </div>

              {/* Row 1: Crypto Withdrawal */}
              <div className="grid grid-cols-12 items-center text-xs sm:text-sm py-1">
                <div className="col-span-5 text-left text-gray-300 font-normal truncate pr-1">
                  Crypto Withdrawal
                </div>
                <div className="col-span-4 text-center text-gray-300 font-medium text-[11px] sm:text-xs">
                  500,000 USDT
                </div>
                <div className="col-span-3 text-right font-semibold text-[#00c076] text-[11px] sm:text-xs pr-0.5">
                  2,000,000 USDT
                </div>
              </div>

              {/* Row 2: Fiat Deposit */}
              <div className="grid grid-cols-12 items-center text-xs sm:text-sm py-1">
                <div className="col-span-5 text-left text-gray-300 font-normal">
                  Fiat Deposit
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#2d323e] border border-gray-600/40 flex items-center justify-center text-gray-400">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-end pr-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#00c076] flex items-center justify-center text-black shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Row 3: Fiat Withdrawal */}
              <div className="grid grid-cols-12 items-center text-xs sm:text-sm py-1">
                <div className="col-span-5 text-left text-gray-300 font-normal">
                  Fiat Withdrawal
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#2d323e] border border-gray-600/40 flex items-center justify-center text-gray-400">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-end pr-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#00c076] flex items-center justify-center text-black shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Step 4 */}
            <div className="w-full flex flex-col gap-3 mt-4">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/profile';
                  } else {
                    router.push('/profile');
                  }
                }}
                className="w-full py-3.5 rounded-full bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm flex items-center justify-center cursor-pointer shadow-lg active:scale-[0.98] transition-all"
              >
                <span>Back to Profile</span>
              </button>

              <button
                disabled
                className="w-full py-3 rounded-full bg-[#232734] text-gray-500 font-bold text-xs flex items-center justify-center cursor-not-allowed border border-[#2c3142]/50"
              >
                <span>Under review</span>
              </button>

              <button
                onClick={() => {}}
                className="text-xs text-gray-400 hover:text-white transition-colors text-center py-1 cursor-pointer"
              >
                Institutional Verification
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL 1: Country / Region Selector */}
      {/* ========================================== */}
      {showCountryModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[430px] bg-[#14161d] border-t border-[#232732] rounded-t-3xl p-4 flex flex-col max-h-[85vh] shadow-2xl animate-slideUp"
          >
            <div className="w-10 h-1 bg-gray-600/80 rounded-full mx-auto mb-3" />
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 text-left">
              Select country/region
            </h2>
            <div className="relative mb-3">
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#1b1e27] border border-[#262a37] rounded-full pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#aeff00]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col pr-1 my-1">
              {filteredCountries.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCountry(c.name);
                    setShowCountryModal(false);
                  }}
                  className="flex items-center gap-3.5 py-3 px-1 text-left text-xs sm:text-sm font-medium text-white hover:bg-[#1b1e27] transition-colors group"
                >
                  <div className="w-6 h-4 sm:w-7 sm:h-4.5 rounded-[2px] overflow-hidden bg-gray-800 flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
                    <img 
                      src={`https://flagcdn.com/w80/${c.code}.png`} 
                      alt={c.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="flex-1 text-gray-100 font-medium group-hover:text-white transition-colors">{c.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCountryModal(false)}
              className="w-full py-3 mt-3 bg-[#202430] hover:bg-[#282d3c] text-white font-medium text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: Document Type Selector */}
      {/* ========================================== */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[430px] bg-[#14161d] border-t border-[#232732] rounded-t-3xl p-5 flex flex-col gap-3 shadow-2xl animate-slideUp"
          >
            <div className="w-10 h-1 bg-gray-600/80 rounded-full mx-auto mb-1" />
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 text-left">
              Document type
            </h2>
            <div className="flex flex-col gap-4 py-1">
              {[
                { label: "ID card", val: "ID card" },
                { label: "Driver's license", val: "Driver's license" },
                { label: "Passport", val: "Passport" },
                { label: "Others", val: "Others" }
              ].map((doc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDocumentType(doc.val);
                    setShowDocModal(false);
                  }}
                  className="text-left text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  {doc.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDocModal(false)}
              className="w-full py-3 mt-4 bg-[#202430] hover:bg-[#282d3c] text-white font-medium text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: Interactive Calendar Date Picker  */}
      {/* ========================================== */}
      {showDobModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[430px] bg-[#14161d] border border-[#232732] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 shadow-2xl animate-slideUp"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#232732]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg bg-[#1e222e] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowYearGrid(!showYearGrid)}
                  className="flex items-center gap-1 text-sm font-bold text-white bg-[#1e222e] px-3 py-1.5 rounded-lg hover:bg-[#272d3e] transition-colors"
                >
                  <span>{MONTH_NAMES[calMonth]} {calYear}</span>
                  <ChevronDown className="w-4 h-4 text-[#aeff00]" />
                </button>

                <button 
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg bg-[#1e222e] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => setShowDobModal(false)}
                className="w-8 h-8 rounded-full bg-[#1e222e] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showYearGrid ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400 font-semibold text-center mb-1">Select Birth Year</p>
                <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {YEARS_LIST.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setCalYear(y);
                        setShowYearGrid(false);
                      }}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        calYear === y 
                          ? "bg-[#aeff00] text-black font-extrabold" 
                          : "bg-[#1d212c] text-gray-200 hover:bg-[#282e3e]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-7 text-center">
                  {WEEKDAYS.map((w, idx) => (
                    <span key={idx} className="text-xs font-bold text-gray-400 py-1">
                      {w}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: getFirstDayOffset(calYear, calMonth) }).map((_, idx) => (
                    <div key={`offset-${idx}`} className="h-9" />
                  ))}

                  {Array.from({ length: getDaysInMonth(calYear, calMonth) }, (_, i) => i + 1).map((day) => {
                    const isSelected = calDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setCalDay(day)}
                        className={`h-9 w-9 mx-auto rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-[#aeff00] text-black font-extrabold shadow-md scale-105"
                            : "text-white hover:bg-[#202534] active:scale-95"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-[#232732]">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-gray-400">Selected Date:</span>
                <span className="text-[#aeff00] font-bold">
                  {MONTH_NAMES[calMonth]} {calDay}, {calYear}
                </span>
              </div>

              <button
                onClick={handleConfirmCalendar}
                className="w-full py-3.5 bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm rounded-full transition-all shadow-lg active:scale-[0.98] mt-1"
              >
                Confirm Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: Prepare Your Identification Documents */}
      {/* ========================================================= */}
      {showPrepareDocsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[430px] bg-[#14161d] border-t border-[#232732] rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-slideUp"
          >
            <div className="w-10 h-1 bg-gray-600/80 rounded-full mx-auto mb-1" />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-semibold tracking-wide">
                Identity Verification
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Prepare Your Identification Documents
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                Please ensure that the image you take is clear and that all information on the document is fully visible.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 my-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-20 bg-[#1e2330] border-2 border-white rounded-xl flex flex-col p-2.5 justify-between shadow-lg relative">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-white">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="w-12 h-1.5 bg-white rounded-full" />
                      <div className="w-8 h-1 bg-white/60 rounded-full" />
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/40 rounded-full" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00c076] fill-[#00c076]/20" />
                  <span>Standard template</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-full h-16 bg-[#1a1d26] border border-gray-700/50 rounded-lg p-1.5 opacity-50 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-6 h-6 bg-[#14161d] -rotate-45 translate-x-3 -translate-y-3" />
                    <div className="flex gap-1 items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-500/50" />
                      <div className="w-8 h-1 bg-gray-500/50 rounded" />
                    </div>
                    <div className="w-full h-1 bg-gray-500/40 rounded" />
                  </div>
                  <XCircle className="w-4 h-4 text-[#ff3b30]" />
                  <span className="text-[10px] text-gray-400 font-medium leading-tight">
                    Missing border
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-full h-16 bg-[#1a1d26] border border-gray-700/50 rounded-lg p-1.5 opacity-40 blur-[1.5px] flex flex-col justify-between">
                    <div className="flex gap-1 items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-500/50" />
                      <div className="w-8 h-1 bg-gray-500/50 rounded" />
                    </div>
                    <div className="w-full h-1 bg-gray-500/40 rounded" />
                  </div>
                  <XCircle className="w-4 h-4 text-[#ff3b30]" />
                  <span className="text-[10px] text-gray-400 font-medium leading-tight">
                    Blurred photos
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-full h-16 bg-[#1a1d26] border border-gray-700/50 rounded-lg p-1.5 opacity-50 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                    <div className="flex gap-1 items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-500/50" />
                      <div className="w-8 h-1 bg-gray-500/50 rounded" />
                    </div>
                    <div className="w-full h-1 bg-gray-500/40 rounded" />
                  </div>
                  <XCircle className="w-4 h-4 text-[#ff3b30]" />
                  <span className="text-[10px] text-gray-400 font-medium leading-tight">
                    Reflected or obscured
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToUpload}
              className="w-full py-3.5 bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm rounded-full transition-all shadow-lg active:scale-[0.98] mt-2"
            >
              Verify now
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: Verification Application Submitted (2nd Image) */}
      {/* ========================================================= */}
      {showSubmittedSuccessModal && (
        <div 
          onClick={() => {
            setShowSubmittedSuccessModal(false);
            setStep(4);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-[340px] bg-[#14161d] border border-[#232732] rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-2xl animate-scaleUp"
          >
            {/* Confetti Party Popper Graphic matching 2nd Image */}
            <div className="relative w-24 h-24 my-1 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#aeff00]/10 rounded-full blur-xl pointer-events-none" />
              <svg className="w-20 h-20 drop-shadow-lg" viewBox="0 0 100 100" fill="none">
                <path d="M25 75 L55 35 L70 50 Z" fill="url(#popperGrad)" stroke="#88d800" strokeWidth="1.5" />
                <path d="M50 35 C45 20, 60 15, 55 5" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M60 40 C75 30, 70 15, 85 20" stroke="#aeff00" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M40 45 C30 30, 20 20, 35 10" stroke="#00c076" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="35" cy="40" r="3.5" fill="#facc15" />
                <circle cx="75" cy="45" r="4" fill="#ff453a" />
                <circle cx="60" cy="22" r="3" fill="#f87171" />
                <circle cx="45" cy="20" r="2.5" fill="#38bdf8" />
                <defs>
                  <linearGradient id="popperGrad" x1="25" y1="75" x2="70" y2="35" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#70c000" />
                    <stop offset="100%" stopColor="#aeff00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Title & Subtitle matching 2nd Image */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white leading-snug">
                Verification application submitted
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed px-1">
                The process will be completed within 3 working days, please wait patiently.
              </p>
            </div>

            {/* Action Button: Got it */}
            <button
              onClick={() => {
                setShowSubmittedSuccessModal(false);
                setStep(4);
              }}
              className="w-full py-3.5 bg-[#aeff00] hover:bg-[#9ef000] text-black font-extrabold text-sm rounded-full transition-all shadow-lg active:scale-[0.98] mt-1"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
