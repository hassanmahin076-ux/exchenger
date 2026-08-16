import './globals.css';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'Pokymax | Crypto Exchange',
  description: 'Pokymax cryptocurrency exchange, perpetual futures, APY liquidity vault, and trading matrix.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#f3f4f6] min-h-screen font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
