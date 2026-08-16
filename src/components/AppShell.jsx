"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BottomDock from './BottomDock';
import AuthPortalModal from './AuthPortalModal';
import TaskCenterModal from './TaskCenterModal';
import DevicePreviewFrame from './DevicePreviewFrame';
import BinanceNotificationToast from './BinanceNotificationToast';
import { GoogleOAuthProvider } from './GoogleOAuthProvider';
import { INITIAL_USER } from '../utils/mockData';

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);

  // Ping visitor analytics on app mount
  React.useEffect(() => {
    try {
      const hasVisitedSession = sessionStorage.getItem('pkmx_visited');
      const isNewVisit = !hasVisitedSession;
      if (isNewVisit) {
        sessionStorage.setItem('pkmx_visited', 'true');
      }

      fetch('/api/analytics/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isNewVisit,
          userUid: user?.uid || null,
          userEmail: user?.email || null
        })
      }).catch(() => {});
    } catch (_) {}
  }, []);

  // Render top Navbar exclusively on the home page /home
  const showNavbar = pathname === '/home';

  return (
    <GoogleOAuthProvider>
      <DevicePreviewFrame>
        {/* Global Binance Push Notification Banner Toast */}
        <BinanceNotificationToast />

        {/* Top Navbar Header - Only on /home */}
        {showNavbar && (
          <Navbar
            onOpenAuth={() => router.push('/auth?mode=register')}
            user={user}
          />
        )}

        {/* Main Content Area */}
        <main className={`px-0 py-0 flex-1 flex flex-col gap-2 ${pathname?.startsWith('/p2p') ? 'pb-0' : 'pb-20'}`}>
          {children}
        </main>

        {/* Bottom Navigation Dock */}
        <BottomDock />

        {/* Interactive Modals */}
        <AuthPortalModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <TaskCenterModal isOpen={isTasksOpen} onClose={() => setIsTasksOpen(false)} />
      </DevicePreviewFrame>
    </GoogleOAuthProvider>
  );
}
