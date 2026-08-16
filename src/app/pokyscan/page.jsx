"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Layers, 
  ArrowRight, 
  SlidersHorizontal, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Home,
  Wallet,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PokyscanPage() {
  const router = useRouter();

  // Live Block Height State
  const [blocks, setBlocks] = useState([
    { id: 116068510, secsAgo: 2, validator: 'Validator: Aoraki (Node-01)', txnsCount: 69, fee: '0.00088 BNB (≈$18.50 USDT)' },
    { id: 116068509, secsAgo: 3, validator: 'Validator: Aoraki (Node-04)', txnsCount: 86, fee: '0.00089 BNB (≈$17.80 USDT)' },
    { id: 116068508, secsAgo: 4, validator: 'Validator: Aoraki (Node-02)', txnsCount: 80, fee: '0.00129 BNB (≈$19.20 USDT)' },
    { id: 116068507, secsAgo: 4, validator: 'Validator: Aoraki (Node-07)', txnsCount: 63, fee: '0.00102 BNB (≈$17.50 USDT)' },
    { id: 116068506, secsAgo: 5, validator: 'Validator: Aoraki (Node-03)', txnsCount: 72, fee: '0.00113 BNB (≈$20.00 USDT)' }
  ]);

  // Live Transactions State (Withdrawals $17-$20 USD & Deposits)
  const [transactions, setTransactions] = useState([
    {
      txHash: '0xc4393ef767b9a21d8e0a12f38bc439',
      from: '0x5F76C7C9d0208d909',
      to: '0x48437A0ddfc85BB48',
      secsAgo: 2,
      type: 'Withdrawal',
      amount: '$18.50 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0xb57a9942fd16e02266f4b00502a0df',
      from: '0x71C7656EC7ab88b098',
      to: '0x0e09828668d149aCE9',
      secsAgo: 3,
      type: 'Withdrawal',
      amount: '$17.20 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0x992ef10842bc0019284fa2190184ce',
      from: '0xfa9555256758e0665',
      to: '0xc4072bc1Cb1C90872',
      secsAgo: 4,
      type: 'Withdrawal',
      amount: '$19.80 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0x883ca201948fe2019385bc7102948a',
      from: '0xbCF51704f62760d98',
      to: '0x38bdf821903847291',
      secsAgo: 5,
      type: 'Withdrawal',
      amount: '$20.00 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0x771bd93847a02938475a820193847b',
      from: '0x91823748271038472',
      to: '0x0e09828668d149aCE9',
      secsAgo: 6,
      type: 'Deposit',
      amount: '$50.00 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0x662ad83920194857201938475a2019',
      from: '0x38472019485720193',
      to: '0xfA9555256758E0665',
      secsAgo: 7,
      type: 'Deposit',
      amount: '$100.00 USDT',
      coin: 'USDT',
      status: 'Success'
    },
    {
      txHash: '0x551ac83920194857201938475a2019',
      from: '0x19283746501928374',
      to: '0xc4072bc1Cb1C90872',
      secsAgo: 9,
      type: 'Deposit',
      amount: '$25.00 USDT',
      coin: 'USDT',
      status: 'Success'
    }
  ]);

  // Live Auto-ticker to update timestamps and insert new transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(prev => prev.map(b => ({ ...b, secsAgo: b.secsAgo + 1 })));
      setTransactions(prev => prev.map(t => ({ ...t, secsAgo: t.secsAgo + 1 })));

      const randomWithdrawal = (17 + Math.random() * 3).toFixed(2); // $17.00 - $20.00
      const randomHex = Math.random().toString(16).substring(2, 10);

      const newTx = {
        txHash: `0x${randomHex}${Math.random().toString(16).substring(2, 12)}`,
        from: `0x${Math.random().toString(16).substring(2, 10)}...`,
        to: `0x${Math.random().toString(16).substring(2, 10)}...`,
        secsAgo: 1,
        type: Math.random() > 0.4 ? 'Withdrawal' : 'Deposit',
        amount: Math.random() > 0.4 ? `$${randomWithdrawal} USDT` : `$${(Math.floor(Math.random() * 8 + 2) * 10).toFixed(2)} USDT`,
        coin: 'USDT',
        status: 'Success'
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#f1f5f9] text-[#1e293b] flex flex-col mx-auto relative font-sans selection:bg-[#3b82f6] selection:text-white pb-20 overflow-x-hidden">
      
      {/* ---------------- 1. TOP HEADER (Dark Theme matching BscScan) ---------------- */}
      <div className="w-full bg-[#0f172a] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <button onClick={() => router.back()} className="p-1 hover:text-gray-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center font-black text-xs text-white">
            P
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">Pokyscan Explorer</span>
        </div>

        <div className="w-5 h-5" />
      </div>

      {/* Search Input Banner */}
      <div className="w-full bg-[#1e293b] p-3.5 text-white border-b border-[#334155]">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Address / Txn Hash / Block"
            className="w-full bg-[#0f172a] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#3b82f6]"
          />
        </div>
      </div>

      {/* Main Content Area - Full width inside 430px shell */}
      <div className="flex-1 w-full px-2.5 py-3 flex flex-col gap-3.5">

        {/* ---------------- 2. LATEST BLOCKS CARD (Matching Screenshot 100%) ---------------- */}
        <div className="w-full bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[#f1f5f9] flex items-center justify-between bg-white">
            <h2 className="font-extrabold text-sm text-[#0f172a] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#3b82f6]" />
              <span>Latest Blocks</span>
            </h2>
            <button className="px-2.5 py-1 rounded-lg border border-[#cbd5e1] text-[11px] font-semibold text-[#64748b] hover:bg-[#f8fafc] flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {blocks.map((b) => (
              <div key={b.id} className="p-3 flex flex-col gap-1 hover:bg-[#f8fafc] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer">
                    Block {b.id}
                  </span>
                  <span className="text-[11px] text-[#64748b] font-medium">{b.secsAgo} secs ago</span>
                </div>

                <div className="text-[11px] text-[#64748b]">
                  Validated By <span className="text-[#2563eb] font-semibold">{b.validator}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#0f172a] font-semibold">
                    {b.txnsCount} txns <span className="text-[#64748b] font-normal">in 0 secs</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#f1f5f9] border border-[#e2e8f0] text-[#334155] px-2 py-0.5 rounded-md">
                    {b.fee}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-[#f8fafc] border-t border-[#f1f5f9] text-center">
            <button className="text-xs font-extrabold text-[#64748b] hover:text-[#0f172a] flex items-center justify-center gap-1 w-full">
              <span>VIEW ALL BLOCKS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ---------------- 3. LATEST TRANSACTIONS CARD (Matching Screenshot 100%) ---------------- */}
        <div className="w-full bg-white border border-[#cbd5e1] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-[#f1f5f9] flex items-center justify-between bg-white">
            <h2 className="font-extrabold text-sm text-[#0f172a] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#16a34a]" />
              <span>Latest Transactions</span>
            </h2>
            <button className="px-2.5 py-1 rounded-lg border border-[#cbd5e1] text-[11px] font-semibold text-[#64748b] hover:bg-[#f8fafc] flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {transactions.map((tx, idx) => (
              <div key={`${tx.txHash}-${idx}`} className="p-3 flex flex-col gap-1.5 hover:bg-[#f8fafc] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer font-mono">
                      TX# {tx.txHash.substring(0, 14)}...
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-0.5 ${
                      tx.type === 'Withdrawal' 
                        ? 'bg-[#ef4444]/10 text-[#dc2626] border border-[#fca5a5]' 
                        : 'bg-[#22c55e]/10 text-[#16a34a] border border-[#86efac]'
                    }`}>
                      {tx.type === 'Withdrawal' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownLeft className="w-2.5 h-2.5" />}
                      {tx.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748b] font-medium">{tx.secsAgo} secs ago</span>
                </div>

                <div className="text-[11px] text-[#64748b] font-mono flex flex-col gap-0.5">
                  <div>From <span className="text-[#2563eb]">{tx.from}</span></div>
                  <div>To <span className="text-[#2563eb]">{tx.to}</span></div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#16a34a] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                    Confirmed
                  </span>
                  <span className="text-xs font-mono font-extrabold bg-[#f1f5f9] border border-[#cbd5e1] text-[#0f172a] px-2.5 py-1 rounded-lg">
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-[#f8fafc] border-t border-[#f1f5f9] text-center">
            <button className="text-xs font-extrabold text-[#64748b] hover:text-[#0f172a] flex items-center justify-center gap-1 w-full">
              <span>VIEW ALL TRANSACTIONS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ---------------- 4. BOTTOM NAVIGATION BAR ---------------- */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0a0c10]/95 backdrop-blur-md border-t border-[#1c2230] px-3 py-2 flex items-center justify-between z-40 text-[10px] text-gray-400 font-medium">
        <button onClick={() => router.push('/home')} className="flex flex-col items-center gap-1 hover:text-white">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button onClick={() => router.push('/markets')} className="flex flex-col items-center gap-1 hover:text-white">
          <TrendingUp className="w-5 h-5" />
          <span>Markets</span>
        </button>

        <button onClick={() => router.push('/convert')} className="flex flex-col items-center gap-1 hover:text-white">
          <RefreshCw className="w-5 h-5" />
          <span>Trade</span>
        </button>

        <button onClick={() => router.push('/futures')} className="flex flex-col items-center gap-1 hover:text-white">
          <Layers className="w-5 h-5" />
          <span>Futures</span>
        </button>

        <button onClick={() => router.push('/assets')} className="flex flex-col items-center gap-1 hover:text-white">
          <Wallet className="w-5 h-5" />
          <span>Assets</span>
        </button>
      </div>

    </div>
  );
}
