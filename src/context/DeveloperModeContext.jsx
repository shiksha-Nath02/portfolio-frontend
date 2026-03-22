import React, { createContext, useContext, useState, useRef } from 'react';

const DevModeContext = createContext();

export const useDevMode = () => useContext(DevModeContext);

export const DevModeProvider = ({ children }) => {
  const [devMode, setDevMode] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const timerRef = useRef(null); // Reference to hold our timeout

  const toggleDevMode = () => {
    // Calculate new state outside of the setter to keep the setter pure
    const newMode = !devMode;
    setDevMode(newMode);
    
    // Trigger side effects outside the setter
    if (newMode) {
      showToast("Developer Mode Activated. Extra nerdiness unlocked.");
    } else {
      showToast("Developer Mode Deactivated.");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    
    // Clear the previous timeout so they don't overlap if clicked quickly
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Start a fresh timeout
    timerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
      {children}
      {/* Global Dev Mode Toast */}
      <div 
        className={`fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-900 border border-emerald-500/50 text-emerald-400 text-sm font-mono rounded shadow-[0_0_15px_rgba(52,211,153,0.2)] transition-all duration-500 transform ${
          toastMessage ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        {'>'} {toastMessage} <span className="animate-pulse">_</span>
      </div>
    </DevModeContext.Provider>
  );
};