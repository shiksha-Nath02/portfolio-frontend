import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';

// --- 1. INTRO POPUP (Portfolio Breaker) ---
export const IntroPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('shiksha_intro_seen');
    if (!hasSeenIntro) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = (action) => {
    setIsVisible(false);
    sessionStorage.setItem('shiksha_intro_seen', 'true');
    if (action === 'explore') {
      setTimeout(() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl relative">
        <div className="space-y-6 text-center">
          <p className="text-xl font-medium text-white">Wait...</p>
          <p className="text-slate-300">Do you think this is just another portfolio?</p>
          <p className="text-slate-400 text-sm italic">Yeah… I thought so.</p>
          <p className="text-emerald-400 font-semibold text-lg">Let’s break that assumption.</p>
          
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => closePopup('explore')}
              className="w-full py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Show me something interesting
            </button>
            <button 
              onClick={() => closePopup('skip')}
              className="w-full py-3 bg-transparent text-slate-400 hover:text-white transition-colors text-sm"
            >
              I'll just scroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. TERMINAL EASTER EGG ---
export const TerminalModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    "ShikshaOS v1.0.0 (tty1)",
    "Type 'help' to see available commands."
  ]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let res = `> ${input}\n`;
      
      switch (cmd) {
        case 'whoami': res += "Shiksha Nath. System architect disguised as a full-stack dev."; break;
        case 'skills': res += "React, Node, Postgres, Docker, System Design, Finding missing semicolons."; break;
        case 'clear': setOutput([]); setInput(''); return;
        case 'help': res += "Commands: whoami, skills, engine, clear"; break;
        case 'engine': res += "Running architecture sync... [OK]\nData fetched from GitHub... [OK]"; break;
        case '': res = "> \n"; break;
        default: res += `command not found: ${cmd}`;
      }

      setOutput(prev => [...prev, res]);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#1e1e1e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-sm h-[400px]">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-2 text-slate-400 text-xs">shiksha@engine:~</span>
          </div>
          <TerminalIcon size={14} className="text-slate-400" />
        </div>
        {/* Terminal Body */}
        <div className="p-4 flex-1 overflow-y-auto text-emerald-400 bg-[#1e1e1e]" onClick={() => inputRef.current?.focus()}>
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
          ))}
          <div className="flex">
            <span className="text-emerald-400 mr-2">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent outline-none text-emerald-400 caret-emerald-400"
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. FLOATING SCROLL MESSAGES ---
export const FloatingMessage = ({ id, message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sessionStorage.getItem(`hint_${id}`)) {
          setIsVisible(true);
          sessionStorage.setItem(`hint_${id}`, 'true');
          setTimeout(() => setIsVisible(false), 5000); // Hide after 5 seconds
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={ref} className="absolute left-0 right-0 pointer-events-none flex justify-end px-10">
      <div 
        className={`transition-all duration-700 max-w-xs p-4 bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md rounded-xl text-slate-300 shadow-xl ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <p className="text-xs font-mono text-emerald-400 mb-1">👀 System Hint</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};