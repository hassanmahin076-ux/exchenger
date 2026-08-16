"use client";

import React, { useState } from 'react';
import { X, Gift, CheckCircle, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { TASK_CENTER_REWARDS } from '../utils/mockData';

export default function TaskCenterModal({ isOpen, onClose }) {
  const [tasks, setTasks] = useState(TASK_CENTER_REWARDS);

  if (!isOpen) return null;

  const handleClaim = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Claimed" } : t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-[#131a2a] border border-[#1f2b45] rounded-2xl p-6 shadow-cardGlow max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8b98a5] hover:text-white bg-[#0b0f19] rounded-lg border border-[#1f2b45] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#1f2b45]">
          <div className="p-3 bg-[#FFD400]/10 border border-[#FFD400]/30 rounded-xl text-[#FFD400]">
            <Gift className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Quantum Reward Matrix</h3>
            <p className="text-xs text-[#8b98a5] font-mono">Complete Exchanger 3th tasks to claim up to 15,000 USDT</p>
          </div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#0b0f19] border border-[#1f2b45] rounded-xl p-4 flex items-center justify-between gap-3 hover:border-[#FFD400]/30 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs text-white">{task.title}</span>
                  <span className="bg-[#FFD400]/15 text-[#FFD400] font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                    {task.reward}
                  </span>
                </div>
                <p className="text-[11px] text-[#8b98a5] max-w-xs">{task.desc}</p>
              </div>

              {/* Status CTA */}
              <div>
                {task.status === "Claimable" ? (
                  <button
                    onClick={() => handleClaim(task.id)}
                    className="bg-[#FFD400] hover:bg-[#ffe033] text-[#0b0f19] font-extrabold text-xs px-3.5 py-2 rounded-lg shadow-cyberGlow transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claim</span>
                  </button>
                ) : task.status === "Claimed" ? (
                  <span className="flex items-center gap-1 text-[#10b981] font-mono text-xs font-bold bg-[#10b981]/15 px-2.5 py-1.5 rounded-lg border border-[#10b981]/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Claimed</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#8b98a5] font-mono text-xs bg-[#1f2b45] px-2.5 py-1.5 rounded-lg">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{task.status}</span>
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
