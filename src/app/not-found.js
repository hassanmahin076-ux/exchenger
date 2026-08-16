"use client";

import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-extrabold text-white mb-2">404</h2>
      <p className="text-sm text-gray-400 mb-6">Page not found</p>
      <a
        href="/"
        className="px-6 py-2.5 rounded-full bg-[#38bdf8] text-black font-extrabold text-xs hover:bg-[#7dd3fc] transition-all"
      >
        Return Home
      </a>
    </div>
  );
}
