import React, { useState, useEffect } from 'react';
import { Terminal, X, Minimize2, Maximize2, Play, FastForward, RotateCcw } from 'lucide-react';
import { useDevMode } from '../context/DeveloperModeContext';

// --- Typewriter Component ---
const AgentMessage = ({ lines, onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  useEffect(() => {
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
  }, [lines]);

  useEffect(() => {
    if (currentLineIdx >= lines.length) {
      if (onComplete) onComplete();
      return;
    }

    const currentLineText = lines[currentLineIdx];

    if (currentCharIdx < currentLineText.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIdx] === undefined) newLines[currentLineIdx] = '';
          newLines[currentLineIdx] += currentLineText[currentCharIdx];
          return newLines;
        });
        setCurrentCharIdx(prev => prev + 1);
      }, 30); // Typing speed
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIdx(prev => prev + 1);
        setCurrentCharIdx(0);
      }, 500); // Delay between lines
      return () => clearTimeout(timer);
    }
  }, [currentLineIdx, currentCharIdx, lines, onComplete]);

  return (
    <div className="font-mono text-sm text-emerald-400">
      {displayedLines.map((line, i) => (
        <div key={i} className="min-h-[1.25rem] mb-1">{line}</div>
      ))}
      {currentLineIdx < lines.length && (
        <span className="animate-pulse bg-emerald-400 w-2 h-4 inline-block align-middle ml-1" />
      )}
    </div>
  );
};

// --- Main Agent Component ---
const TOUR_STEPS = [
  {
    id: 'intro',
    lines: [
      "System initialized...",
      "Scanning visitor...",
      "",
      "Hello there.",
      "You might think this is just another portfolio.",
      "It's not.",
      "",
      "This portfolio documents my systems automatically.",
      "Projects explain themselves.",
      "Architecture diagrams generate themselves.",
      "",
      "Let me show you."
    ],
    action: 'Start Tour',
    icon: Play,
    target: null
  },
  {
    id: 'engine',
    lines: [
      "First, the engine.",
      "",
      "This portfolio is not static.",
      "It scans my GitHub repositories,",
      "extracts architecture,",
      "and generates documentation automatically."
    ],
    action: 'Next: Projects',
    icon: FastForward,
    target: 'engine'
  },
  {
    id: 'projects',
    lines: [
      "Now the interesting part.",
      "",
      "These projects are not manually written.",
      "They are generated from the repositories themselves."
    ],
    action: 'Next: Telemetry',
    icon: FastForward,
    target: 'projects'
  },
  {
    id: 'telemetry',
    lines: [
      "Every system produces signals.",
      "This portfolio does too.",
      "",
      "Coffee consumed is dangerously high."
    ],
    action: 'Finish Tour',
    icon: Terminal,
    target: 'telemetry'
  },
  {
    id: 'done',
    lines: [
      "Tour complete.",
      "You can now explore the system freely.",
      "",
      "Or open developer mode to inspect the architecture."
    ],
    action: 'Replay Tour',
    icon: RotateCcw,
    target: null
  }
];

export default function PortfolioAgent() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const { devMode } = useDevMode();
  const [overrideMessage, setOverrideMessage] = useState(null);

  // Handle Developer Mode Override
  useEffect(() => {
    if (devMode) {
      setIsMinimized(false);
      setIsTyping(true);
      setOverrideMessage([
        "Developer mode detected.",
        "Extra system signals enabled.",
        "Bypassing standard protocols..."
      ]);
      
      const timer = setTimeout(() => {
        setOverrideMessage(null);
        setIsTyping(false); // Restore standard UI
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [devMode]);

  const handleNext = () => {
    const nextStep = step + 1;
    if (nextStep < TOUR_STEPS.length) {
      setStep(nextStep);
      setIsTyping(true);
      
      const targetId = TOUR_STEPS[nextStep].target;
      if (targetId) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a temporary glow to the highlighted section
        const el = document.getElementById(targetId);
        if (el) {
          el.classList.add('shadow-[0_0_50px_rgba(16,185,129,0.3)]', 'rounded-3xl', 'transition-shadow', 'duration-1000');
          setTimeout(() => el.classList.remove('shadow-[0_0_50px_rgba(16,185,129,0.3)]'), 3000);
        }
      }
    } else {
      setStep(0); // Replay
      setIsTyping(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    setStep(TOUR_STEPS.length - 1);
    setIsTyping(true);
  };

  // Render Minimized State
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3px-4 py-3 bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 hover:border-emerald-400 transition-all group"
      >
        <div className="relative">
          <Terminal size={18} className="text-emerald-400" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">
          System Guide
        </span>
      </button>
    );
  }

  const currentStepData = TOUR_STEPS[step];
  const ActionIcon = currentStepData.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[340px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
      
      {/* Agent Header */}
      <div className="bg-slate-950/50 px-4 py-3 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider">
            SYSTEM_AGENT
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <button onClick={() => setIsMinimized(true)} className="hover:text-emerald-400 transition-colors">
            <Minimize2 size={14} />
          </button>
          <button onClick={() => setIsMinimized(true)} className="hover:text-red-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Agent Body */}
      <div className="p-5">
        <div className="min-h-[120px] mb-4">
          <AgentMessage 
            lines={overrideMessage || currentStepData.lines} 
            onComplete={() => setIsTyping(false)} 
          />
        </div>

        {/* Action Buttons (Hide while typing or showing override message) */}
        {!isTyping && !overrideMessage && (
          <div className="flex flex-col gap-2 animate-in fade-in duration-500 pt-2 border-t border-white/5">
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 rounded-lg text-sm font-medium transition-all"
            >
              <ActionIcon size={16} />
              {currentStepData.action}
            </button>
            
            {step > 0 && step < TOUR_STEPS.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
              >
                Skip Tour
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}