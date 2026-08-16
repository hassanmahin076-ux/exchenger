"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Globe, Power, Send, Headphones, Bot, CheckCircle, Clock, Loader2, Sparkles, Trash2 } from 'lucide-react';

export default function SupportChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello there! I'm Bybot, how can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [step, setStep] = useState('email');
  const [userEmail, setUserEmail] = useState('');
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showHistory]);

  // Load initial user email from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setUserEmail(savedEmail);
        setStep('issue');
      }
    }
  }, []);

  // Fetch and reconstruct chat history by Email from PostgreSQL
  const fetchAndRestoreChat = async (email) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/support/tickets?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.tickets) {
        setUserTickets(data.tickets);

        // Reconstruct chronological conversation history (oldest first)
        const sortedTickets = [...data.tickets].reverse();
        const restored = [];

        // Base bot welcome
        restored.push({
          id: 'welcome-1',
          sender: 'bot',
          text: "Hello there! I'm Bybot, how can I assist you today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        sortedTickets.forEach((t) => {
          const timeStr = t.created_at ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          
          // User message
          restored.push({
            id: `user-tck-${t.id}`,
            sender: 'user',
            text: t.message,
            time: timeStr
          });

          // Agent reply if present
          if (t.reply) {
            const replyTimeStr = t.updated_at ? new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timeStr;
            restored.push({
              id: `agent-tck-${t.id}`,
              sender: 'agent',
              ticketCode: t.ticket_code,
              text: t.reply,
              time: replyTimeStr
            });
          }
        });

        setMessages(restored);
      }
    } catch (e) {
      console.warn('Error fetching support tickets:', e);
    }
  };

  useEffect(() => {
    if (userEmail && isOpen) {
      fetchAndRestoreChat(userEmail);
      const interval = setInterval(() => fetchAndRestoreChat(userEmail), 4000);
      return () => clearInterval(interval);
    }
  }, [userEmail, isOpen]);

  if (!isOpen) return null;

  // Handle Power Button (Clear & Delete DB + Chat History)
  const handleClearChatAndDatabase = async () => {
    if (!userEmail) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: "Hello there! I'm Bybot, how can I assist you today?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setToastMsg('Chat window cleared.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete all chat history and support tickets for ${userEmail}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/support/tickets?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUserTickets([]);
        setMessages([
          {
            id: 'welcome-1',
            sender: 'bot',
            text: "Hello there! I'm Bybot, how can I assist you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: 'clear-msg',
            sender: 'bot',
            text: `🧹 All chat history and support tickets for ${userEmail} have been deleted from the database.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setToastMsg('Chat history & database tickets deleted successfully!');
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  // Send User Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputText('');

    // Step 1: Collecting Email if not logged in
    if (step === 'email' && !userEmail) {
      if (!text.includes('@')) {
        setMessages(prev => [
          ...prev,
          { id: Date.now(), sender: 'user', text, time: timeStr },
          { id: Date.now() + 1, sender: 'bot', text: 'Invalid email format. Please enter a valid email address.', time: timeStr }
        ]);
        return;
      }
      setUserEmail(text);
      setStep('issue');
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text, time: timeStr },
        { id: Date.now() + 1, sender: 'bot', text: `Email confirmed (${text}). Now please describe your issue or question below.`, time: timeStr }
      ]);
      fetchAndRestoreChat(text);
      return;
    }

    // Step 2: Sending Problem / Query Ticket to PostgreSQL
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text, time: timeStr }
    ]);

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, subject: 'Live Customer Support', message: text })
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.ticket) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 2,
            sender: 'bot',
            text: `✅ Ticket #${data.ticket.ticket_code} created! Our support agent will review and reply here.`,
            time: timeStr
          }
        ]);
        fetchAndRestoreChat(userEmail);
      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 2, sender: 'bot', text: `Error submitting ticket: ${data.error || 'Please try again.'}`, time: timeStr }
        ]);
      }
    } catch (err) {
      setIsSubmitting(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, sender: 'bot', text: 'Network error submitting support ticket.', time: timeStr }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex justify-center animate-fadeIn">
      {/* Constrained Mobile Container */}
      <div className="w-full max-w-[430px] h-full bg-[#000000] border-x border-[#1e2329] text-white flex flex-col relative font-sans">

        {/* 1. Header matching Image 3 */}
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-[#181a20] bg-[#000000] select-none shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>24/7 Dedicated Support</span>
              </h2>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#aeff00] transition-colors cursor-pointer"
              >
                <Clock className="w-3 h-3" />
                <span>{showHistory ? 'Hide History' : 'View Chat History'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <button className="p-1 hover:text-white transition-colors cursor-pointer" title="Language">
              <Globe className="w-5 h-5" />
            </button>
            
            {/* Power Button: Clears Chat Window & Deletes Database History for Email */}
            <button 
              onClick={handleClearChatAndDatabase} 
              className="p-1 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear & Delete Chat History from Database"
            >
              <Power className="w-5 h-5 text-gray-400 hover:text-red-400" />
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-[#181a20] border border-[#aeff00]/40 text-[#aeff00] text-xs px-3 py-2 text-center font-semibold">
            {toastMsg}
          </div>
        )}

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
          
          {/* History Drawer */}
          {showHistory && (
            <div className="bg-[#12141a] border border-[#2b2f36] rounded-xl p-3 mb-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#aeff00]" />
                  <span>Your Saved Support Tickets</span>
                </h4>
                <button
                  onClick={handleClearChatAndDatabase}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete All</span>
                </button>
              </div>

              {userTickets.length === 0 ? (
                <p className="text-[11px] text-gray-400">No previous tickets found.</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {userTickets.map(t => (
                    <div key={t.id} className="bg-[#1a1d24] p-2.5 rounded-lg border border-[#262a35] text-xs">
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1">
                        <span>#{t.ticket_code}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-gray-200 text-xs mb-1 font-sans">{t.message}</p>
                      {t.reply && (
                        <div className="bg-[#242834] p-2 rounded border border-[#343a4c] mt-1.5">
                          <span className="text-[10px] text-[#aeff00] font-bold block mb-0.5">Agent Reply:</span>
                          <p className="text-white text-xs">{t.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main Messages Stream */}
          {messages.map((msg) => {
            if (msg.sender === 'agent') {
              return (
                <div key={msg.id} className="flex items-start gap-2.5 max-w-[85%] animate-fadeIn">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-[#aeff00] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Headphones className="w-4 h-4 text-black" />
                  </div>
                  <div className="flex flex-col">
                    <div className="p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed bg-[#1b231c] border border-[#29422e] text-white rounded-tl-none shadow-md">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#0ecb81] font-bold mb-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Official Agent Reply ({msg.ticketCode ? `#${msg.ticketCode}` : 'Support'})</span>
                      </div>
                      <p className="text-gray-100 whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 text-left">{msg.time || 'Agent'}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#1e232a] border border-[#343b46] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-[#aeff00]" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className="flex flex-col">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-[#aeff00] text-black font-medium rounded-tr-none'
                        : 'bg-[#181a20] text-gray-200 border border-[#2b2f36] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center gap-2 text-xs text-gray-400 italic bg-[#181a20] p-3 rounded-xl border border-[#2b2f36] w-fit">
              <Loader2 className="w-4 h-4 text-[#aeff00] animate-spin" />
              <span>Submitting message to agent...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 2. Bottom Input Bar matching Image 3 */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#000000] border-t border-[#181a20] flex items-center gap-2 select-none shrink-0">
          <input
            type="text"
            placeholder="Drop your question(s) here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#181a20] border border-[#2b2f36] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-[#aeff00] transition-colors"
          />

          {/* Yellow/Orange Send Circle Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="w-11 h-11 rounded-full bg-[#f39c12] hover:bg-[#e67e22] text-black flex items-center justify-center transition-all active:scale-95 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            title="Send Message"
          >
            <Send className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
