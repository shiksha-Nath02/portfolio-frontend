import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Github, 
  Linkedin, 
  Code, 
  Server, 
  Database, 
  Terminal as TerminalIcon, 
  Cpu, 
  ExternalLink, 
  Mail, 
  ChevronDown,
  Layers,
  GraduationCap,
  Briefcase,
  Users,
  Rocket,
  X,
  Activity,
  Phone,
  Maximize,
  FileText
} from 'lucide-react';

import { fetchProjectIndex } from "../engine/contentFetcher";

// 2. Developer Mode Context
const DevModeContext = createContext();
const DevModeProvider = ({ children }) => {
  const [devMode, setDevMode] = useState(true);
  const toggleDevMode = () => setDevMode(!devMode);
  return (
    <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};
const useDevMode = () => useContext(DevModeContext);

// 3. Terminal Modal Component
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
// 4. Engine Section Component
const EngineSection = () => (
  <section id="engine" className="relative z-10 py-24 max-w-6xl mx-auto border-b border-white/5">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
        <Cpu className="text-emerald-400" /> Documentation Engine Architecture
      </h3>
      <p className="text-slate-400">AST parsing and automated system documentation generation.</p>
    </div>
    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto text-center font-mono text-sm text-slate-300">
      <p>[ ENGINE DIAGRAM STANDBY ]</p>
      <p className="mt-2 opacity-50">Requires sky-doc-engine binary to render full graph.</p>
    </div>
  </section>
);
// --- END MOCKED DEPENDENCIES ---


// --- CSS Styles for Animations ---
const styles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

// --- Utility Components ---

// 1. FadeIn Component
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, margin: '50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. Aurora Background
const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950 pointer-events-none">
      <style>{styles}</style>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};

// 3. Navigation Bar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { devMode, toggleDevMode } = useDevMode();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
          <span className="text-emerald-400">&lt;</span>
          Shiksha
          <span className="text-emerald-400">/&gt;</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {['About', 'Tech', 'Projects'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-emerald-400 transition-colors"
            >
              {item}
            </button>
          ))}
          
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Contact
          </button>
          
          <a 
            href="https://drive.google.com/drive/u/0/folders/1VH4hLWzTpATspoIRrnA2yRhTLEHXl77u"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <FileText size={14} /> Resume
          </a>
          
          <button 
            onClick={toggleDevMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all duration-300 ${
              devMode 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse' 
                : 'border-white/10 hover:border-white/30 hover:shadow-[0_0_8px_rgba(255,255,255,0.05)] text-slate-300'
            }`}
          >
            <TerminalIcon size={14} /> {devMode ? 'Dev Mode: ON' : 'Dev Mode: OFF'}
          </button>
        </div>
      </div>
    </nav>
  );
};

// 4. Social Icon Button
const SocialButton = ({ icon: Icon, href, label }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:text-white hover:bg-white/10 hover:border-emerald-500/50 hover:-translate-y-1 hover:scale-110 transition-all group relative duration-300"
    aria-label={label}
  >
    <Icon size={20} />
    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">
      {label}
    </span>
  </a>
);

// 5. Tech Badge
const TechBadge = ({ name, icon: Icon }) => (
  <div 
    className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-full text-slate-300 text-sm cursor-default hover:text-white hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.1)]"
  >
    {Icon && <Icon size={14} className="text-emerald-400" />}
    {name}
  </div>
);

// 6. Dramatic Hover Reveal Component
const HoverReveal = ({ text, hiddenText, link, linkHref, isTitle = false }) => {
  const href = linkHref || (link ? link.replace('GET ', '') : null);
  const Wrapper = href ? 'a' : 'span';
  const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`relative inline-block group ${href ? 'cursor-pointer' : 'cursor-default'} ${
        isTitle ? '' : 'text-emerald-400 font-medium border-b border-emerald-500/30 hover:border-emerald-400'
      } transition-colors`}
    >
      {text}
      <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[280px] p-4 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none z-[100] shadow-[0_0_30px_rgba(16,185,129,0.15)] text-left flex flex-col gap-2 ${
        isTitle ? 'font-sans text-base font-normal tracking-normal leading-normal text-slate-200' : 'text-sm text-slate-200'
      }`}>
        <span>{hiddenText}</span>
        {link && (
          <span className="mt-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 break-all flex items-center gap-1.5">
            <ExternalLink size={12} /> {link}
          </span>
        )}
        {isTitle && (
          <span className="text-[10px] font-mono text-slate-500 italic">// intentional easter egg</span>
        )}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-emerald-500/50"></span>
      </span>
    </Wrapper>
  );
};

// 7. Typewriter Text Component
const TypewriterText = ({ text, speed = 30, delay = 0, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (delay > 0) {
      timer = setTimeout(() => setStarted(true), delay);
    } else {
      setStarted(true);
    }
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    setDisplayed(""); 
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return <span className={className}>{displayed}</span>;
};

// 8. Splash Overlay Component 
const GameModeSplash = ({ onEnter, onExit }) => {
  const [showBtns, setShowBtns] = useState(false);
  
  useEffect(() => {
    // Show buttons after typing animation finishes (~3.5 seconds)
    const timer = setTimeout(() => setShowBtns(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-md">
      <div className="font-mono text-center w-[92%] max-w-2xl mx-auto p-6 sm:p-10 bg-slate-900/40 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
        {/* Gaming UI Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

        <div className="text-emerald-400 text-base sm:text-xl md:text-2xl font-bold mb-4 min-h-[1.75rem] leading-tight">
          <TypewriterText text="> SYSTEM DETECTED: NEW USER" speed={40} delay={300} />
        </div>

        <div className="text-slate-300 text-sm sm:text-base md:text-lg flex flex-col items-center justify-center space-y-2 min-h-[4rem]">
          <TypewriterText text="Thinking it's just another portfolio?" speed={30} delay={1500} />
          <div className="text-white font-bold">
            <TypewriterText text="Wanna dive into it?" speed={30} delay={2800} />
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-8 transition-all duration-700 ${showBtns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button onClick={onEnter} className="px-5 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/20 hover:scale-105 transition-all text-xs tracking-widest font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            [ ENTER SYSTEM ]
          </button>
          <button onClick={onExit} className="px-5 py-3 bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-xs tracking-widest">
            [ EXIT TO NORMAL VIEW ]
          </button>
        </div>
      </div>
    </div>
  );
};

// 9. Cinematic Storytelling Module (Replaces grid/compact cards)
const CinematicModule = ({ index, videoId, title, main, hook, command, dropdownItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const ref = useRef(null);
  
  // Alternating layout logic (even = left, odd = right)
  const isEven = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.2 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Video Expansion Modal */}
      {isVideoExpanded && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setIsVideoExpanded(false)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVideoExpanded(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-900/80 hover:bg-emerald-500 text-slate-300 hover:text-white rounded-full transition-colors border border-white/10"
              title="Close expanded video"
            >
              <X size={20} />
            </button>
            <video
              className="w-full h-full absolute inset-0 object-cover"
              src={videoId}
              controls
              autoPlay
              loop
            />
          </div>
        </div>
      )}

      <div ref={ref} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Video Column (45%) */}
        <div className="w-full md:w-[45%] xl:w-[45%] shrink-0 aspect-video rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative bg-black/80 group">
          <div className="absolute inset-0 border border-white/5 rounded-xl z-10 pointer-events-none group-hover:border-emerald-500/50 transition-colors duration-500" />
          
          {/* Maximize Icon Button overlay */}
          <button 
            onClick={() => setIsVideoExpanded(true)}
            className="absolute top-3 right-3 z-20 p-2 bg-slate-900/80 text-emerald-400 hover:text-white hover:bg-emerald-500 border border-emerald-500/30 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
            title="Expand Video"
          >
            <Maximize size={16} />
          </button>

          {inView ? (
            <video
              className="w-full h-full absolute inset-0 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              src={videoId}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/30 text-xs tracking-widest uppercase font-mono">
              <Activity className="animate-pulse mb-2" size={20} />
              [ AWAKENING SYSTEM ]
            </div>
          )}
        </div>
        
        {/* Text Column (55%) */}
        <div className="w-full flex-1 flex flex-col justify-center space-y-5">
          <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <TerminalIcon size={14} /> {title}
          </h4>
          
          <p className="text-base md:text-lg text-slate-300 font-medium">
            {main}
          </p>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase leading-tight whitespace-pre-line tracking-tight">
            {hook}
          </h2>
          
          {/* Dropdown UI */}
          <div className="mt-6 border border-white/10 rounded-lg overflow-hidden bg-slate-900/40 w-full max-w-lg font-mono">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-slate-400 hover:text-emerald-300 hover:bg-white/5 transition-colors text-xs uppercase tracking-wider"
            >
              <span className="flex items-center gap-2">&gt; Inspect Module</span>
              <ChevronDown size={14} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4 border-t border-white/5 space-y-2 bg-slate-950 text-xs">
                {command && (
                  <div className="text-emerald-400 mb-3 pb-2 border-b border-emerald-500/20 font-bold truncate">
                    $ {command}
                  </div>
                )}
                <ul className="space-y-2.5">
                  {dropdownItems.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-slate-300 leading-relaxed">
                      <span className="text-emerald-500/50 shrink-0">|</span> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

// 10. Section Component
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`relative z-10 py-24 max-w-6xl mx-auto ${className}`}>
    {children}
  </section>
);


// --- Main App Content Component ---
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [projects, setProjects] = useState([]);
  const { devMode } = useDevMode();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Subtitle Rotation Logic
  const subtitles = ["Full Stack Developer.", "Backend Enjoyer.", "API Architect.", "Bug Creator.", "Bug Destroyer."];
  const [subtitleIdx, setSubtitleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIdx(prev => (prev + 1) % subtitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(
      "%c👀 Hey there, curious developer.\n\n%cSince you're here...\nThis portfolio auto-fetches project\ndocumentation and architecture from GitHub.\n\nPretty neat, right?\n\n– Shiksha", 
      "color: #34d399; font-size: 16px; font-weight: bold;", 
      "color: #94a3b8; font-size: 14px;"
    );
  }, []);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjectIndex();
        setProjects(data.projects);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    loadProjects();
  }, []);

  // Updated Cinematic System Modules Data
  const systemModules = [
    {
      videoId: "/part1.mp4",
      title: "MODULE 1 — AUTO SYNC",
      main: "Add “portfolio” to your repo → it appears instantly.",
      hook: "NO FORMS. NO MANUAL UPDATES.",
      command: "",
      dropdownItems: ["Portfolio scans GitHub repos", "Filters based on metadata keyword", "Fetches structured docs from repo", "Dynamically renders UI"]
    },
    {
      videoId: "/part2.mp4",
      title: "MODULE 2 — DEV MODE",
      main: "Dev Mode ON — welcome developers.",
      hook: "LET’S DIVE INTO THE SYSTEM ARCHITECTURE.",
      command: "",
      dropdownItems: ["architecture.json → system structure", "api.json → endpoints", "database.json → schema", "timeline.json → project evolution", "markdown → overview, challenges, lessons"]
    },
    {
      videoId: "/part3.mp4",
      title: "MODULE 3 — INIT",
      main: "Start with nothing → get a documentation system.",
      hook: "But I never wrote this manually...\nSo how did it get here?",
      command: "sky-doc-engine init",
      dropdownItems: ["Creates /docs folder", "Sets JSON + markdown files", "Installs Git pre-commit hook", "Prepares auto documentation system"]
    },
    {
      videoId: "/part4.mp4",
      title: "MODULE 4 — ENGINE",
      main: "Your code gets analyzed — not described.",
      hook: "AST-POWERED ANALYSIS.",
      command: "sky-doc-engine generate --all",
      dropdownItems: ["Uses AST parsing", "Detects APIs (Express)", "Detects architecture layers", "Parses DB schemas (Prisma/Mongoose/SQL)", "Outputs structured JSON"]
    },
    {
      videoId: "/part5.mp4",
      title: "MODULE 5 — EVOLUTION",
      main: "Every commit updates your project story.",
      hook: "YOUR CODE WRITES ITS OWN HISTORY.",
      command: "",
      dropdownItems: ["Git pre-commit hook triggers:", "sky-doc-engine generate --all", "sky-doc-engine timeline", "Timeline reads commit messages", "Updates timeline.json automatically"]
    }
  ];

  // Tech Stack Data
  const techCategories = [
    { title: "Languages", icon: Code, items: ["C++", "JavaScript", "HTML/CSS", "MySQL"] },
    { title: "Core CS", icon: Cpu, items: ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "DBMS", "OOPS"] },
    { title: "Frameworks", icon: Layers, items: ["Express.js", "React.js", "NestJS"] },
    { title: "Tools", icon: TerminalIcon, items: ["Git", "GitHub", "VS Code", "MATLAB", "LaTeX", "Arduino IDE"] },
    { title: "Advanced", icon: Server, items: ["WebSockets (WS/WSS)", "REST APIs", "HTTPS", "System Design"] },
    { title: "Currently Learning", icon: Rocket, items: ["FreeSWITCH (telephony)", "AWS", "Docker"] }
  ];

  // Experience Data
  const experienceItems = [
    {
      icon: Briefcase,
      title: "Avataar Skincare",
      sub: ["Built dietician consultation system", "APIs + structured diet plans", "User progress tracking"]
    },
    {
      icon: Activity,
      title: "Dietician System (Highlight)",
      sub: ["Personalized plans", "Feedback loop system", "Data-driven tracking"]
    },
    {
      icon: Phone,
      title: "In-house Telephony",
      sub: ["Built using FreeSWITCH", "Handles IVR, call routing", "Backend with Node/Express"]
    }
  ];

  const handleEnterSystem = () => {
    setShowSplash(false);
    setTimeout(() => {
      document.getElementById('working-engine').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100 overflow-x-hidden">
      {showSplash && <GameModeSplash onEnter={handleEnterSystem} onExit={() => setShowSplash(false)} />}
      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <AuroraBackground />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">
        
        {/* HERO SECTION */}
        <Section id="home" className="min-h-screen flex flex-col justify-center pt-32 relative">
          
          <div className="max-w-4xl">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to Opportunities
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                <HoverReveal
                  text="Shiksha Nath"
                  hiddenText="Identity verified. Fetching live raw user telemetry data..."
                  link="GET https://api.github.com/users/shiksha-Nath02"
                  linkHref="https://github.com/shiksha-Nath02"
                  isTitle
                />
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              <h2 className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 mb-8 h-12 md:h-16 relative">
                {subtitles.map((text, i) => (
                  <span 
                    key={text} 
                    className={`absolute top-0 left-0 transition-all duration-500 ${
                      i === subtitleIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    {text}
                  </span>
                ))}
              </h2>
            </FadeIn>

            <FadeIn delay={300}>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
                Building <HoverReveal text="production-grade systems" hiddenText="Architecting for massive scale, not just for localhost." /> solving real-world problems with scalable backend architecture. I turn complex logic into <HoverReveal text="smooth digital experiences" hiddenText="Zero layout shifts. Sub-100ms API responses. Perfect UX." />.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-wrap gap-4 mb-12">
                <button 
                  onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  View Projects
                </button>
                <button 
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-lg hover:bg-white/10 hover:border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Contact Me
                </button>
                <a 
                  href="https://drive.google.com/drive/u/0/folders/1VH4hLWzTpATspoIRrnA2yRhTLEHXl77u"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/50 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                >
                  <FileText size={18} /> Resume
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="flex gap-4">
                <SocialButton icon={Github} href="https://github.com/shiksha-Nath02" label="GitHub" />
                <SocialButton icon={Linkedin} href="https://www.linkedin.com/in/shiksha-nath-0614751b0/" label="LinkedIn" />
                <SocialButton icon={Code} href="https://leetcode.com/u/shiksha_nath/" label="LeetCode" />
              </div>
            </FadeIn>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 hidden md:block animate-bounce">
            <ChevronDown size={32} />
          </div>
        </Section>


        {/* THE ENGINE SECTION (Cinematic Storytelling Layout) */}
        <Section id="working-engine" className="py-24 border-y border-emerald-500/10 bg-slate-950/50 relative z-10 font-sans">
          <FadeIn>
            <div className="mb-20 border-l-2 border-emerald-500 pl-4 max-w-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                ⚙️ The Engine Behind This Portfolio
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                This portfolio is not static. It automatically pulls architecture, documentation, and metadata directly from my GitHub repositories.
                <br/>
                <span className="text-emerald-400 mt-4 inline-block bg-emerald-500/10 px-3 py-1.5 w-fit border border-emerald-500/30 font-mono text-sm tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  &gt; Documentation that writes itself_
                </span>
              </p>
            </div>
          </FadeIn>

          {/* Cinematic Vertical Stack layout with alternating modules */}
          <div className="flex flex-col space-y-32">
            {systemModules.map((module, idx) => (
              <FadeIn key={idx} delay={idx * 50}>
                <CinematicModule index={idx} {...module} />
              </FadeIn>
            ))}
          </div>

          {/* Final Cinematic Statement */}
          <FadeIn delay={200}>
            <div className="mt-40 text-center border-t border-emerald-500/10 pt-20">
              <p className="text-xs md:text-sm font-mono text-slate-600 uppercase tracking-widest leading-relaxed">
                This is not a portfolio.<br />
                <span className="text-emerald-500/40 inline-block mt-1">
                  It’s a system that documents itself.
                </span>
              </p>
            </div>
          </FadeIn>
        </Section>


        {/* ABOUT SECTION */}
        <Section id="about">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: About Me, Terminal Button, Upcoming Systems */}
            <FadeIn delay={0} className="space-y-10">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users className="text-emerald-400" /> About Me
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                  <p>
                    I am a passionate Full Stack Developer with a deep love for <HoverReveal text="backend systems" hiddenText="I optimize SQL queries for fun. Unapologetic database nerd." /> and complex architectural logic. While I enjoy crafting beautiful UIs, my true strength lies in what happens under the hood—<HoverReveal text="optimizing databases" hiddenText="Indexes, caching strategies, and connection pooling are my love languages." />, structuring APIs, and ensuring scalability.
                  </p>
                  <p>
                    Currently pursuing my <strong className="text-white">B.Tech at NSUT, Delhi (2022–2026)</strong>, I build highly concurrent systems like <HoverReveal text="echoVerse" hiddenText="A scalable backend environment built to handle heavy traffic." link="https://github.com/shiksha-Nath02/echoVerse" /> that are shipped to production environments.
                  </p>
                  <p>
                    During my internship at <strong className="text-emerald-400">Avataar Skincare</strong>, I worked on building internal product systems including a dietician consultation platform.
                  </p>
                  
                </div>

                <button 
                  onClick={() => setIsTerminalOpen(true)}
                  className="mt-8 text-sm font-mono flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-500/10 border border-emerald-400/60 text-emerald-300 rounded-lg shadow-[0_0_18px_rgba(16,185,129,0.45)] hover:bg-emerald-500/20 hover:shadow-[0_0_25px_rgba(16,185,129,0.65)] transition-all duration-300 w-fit"
                >
                  <TerminalIcon size={16} /> Open Terminal {">_"}
                </button>
              </div>

              {/* Upcoming Systems Section */}
              <div>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  Upcoming Systems
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex gap-4">
                    <Server className="text-emerald-400 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-slate-300">
                      An in-house cloud telephony platform being built for Avataar to replace third-party services.  
                      The system handles call routing, IVR logic, and internal telephony workflows.
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex gap-4">
                    <Database className="text-emerald-400 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-slate-300">
                      A School Management System for St. RLD Public School, designed to handle attendance, academic tracking, and administrative workflows.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Column: Experience Cards (Reusing existing design paradigm) */}
            <div className="grid gap-4 mt-12 lg:mt-0">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Briefcase className="text-emerald-400" /> Experience Highlights
              </h3>
              
              {experienceItems.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 100}>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors flex items-start gap-4 group">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0 mt-0.5">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                      <ul className="space-y-1.5">
                        {item.sub.map((point, i) => (
                          <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-500/50 mt-0.5">-</span> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              ))}

              <FadeIn delay={400} className="mt-4">
                 <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors flex items-center gap-4 group">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">B.Tech 2022–2026</h4>
                      <p className="text-sm text-slate-400">Netaji Subhas University of Technology</p>
                    </div>
                  </div>
              </FadeIn>
            </div>
            
          </div>
        </Section>

        {/* TECH STACK SECTION (Categorized Extension) */}
        <Section id="tech">
          <FadeIn>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Layers className="text-emerald-400" /> Tech Stack
              </h3>
              <p className="text-slate-400">The arsenal I use to build robust applications.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techCategories.map((category, idx) => (
              <FadeIn key={category.title} delay={idx * 100}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-white/10 transition-all h-full group">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <category.icon className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map(item => (
                      <span key={item} className="px-3 py-1.5 bg-slate-950/50 border border-white/10 rounded-md text-slate-300 text-sm hover:text-white hover:border-emerald-500/50 transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* PROJECT SECTION */}
        <Section id="projects" className="relative">
          <FadeIn>
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Briefcase className="text-emerald-400" /> Featured Projects
              </h3>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <FadeIn key={project.slug} delay={idx * 100}>
                  <div 
                    onClick={() => {
                      if (!devMode) {
                        if (project.liveUrl) {
                          window.open(project.liveUrl, '_blank');
                        } else {
                          window.open(`/project/${project.slug}`, '_blank');
                        }
                      }
                    }}
                    className={`group relative bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300 ${!devMode ? 'cursor-pointer' : ''}`}
                  >
                    <div className="h-40 bg-gradient-to-r from-emerald-900/40 via-slate-900 to-indigo-900/40 flex items-center justify-center">
                      <h4 className="text-xl font-mono text-emerald-200/60">
                        {project.slug}
                      </h4>
                    </div>

                    <div className="p-6 relative">
                      {devMode && (
                        <div className="absolute top-4 right-4 text-xs font-mono text-emerald-400 text-right bg-slate-950/90 p-2 rounded border border-emerald-500/30 z-10 shadow-lg">
                          <p>Data: Extracted</p>
                          <p>Arch: Scanned</p>
                        </div>
                      )}

                      <h4 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                        {project.title}
                      </h4>

                      <p className="text-slate-300 mb-4">
                        {project.tagline}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 
                          Docs Synced
                        </span>
                        
                        <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-full capitalize">
                          {project.status || 'Active'}
                        </span>

                        {devMode && (
                          <span className="text-xs px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full">
                            Repo Linked
                          </span>
                        )}
                      </div>

                      {devMode && (
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5 animate-in fade-in duration-300">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (project.liveUrl) window.open(project.liveUrl, '_blank'); 
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-white/5 hover:border-white/10 rounded font-mono text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!project.liveUrl}
                          >
                            <ExternalLink size={14} /> Open Live App
                          </button>
                          
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (project.repoUrl) window.open(project.repoUrl, '_blank'); 
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-white/5 hover:border-white/10 rounded font-mono text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!project.repoUrl}
                          >
                            <Github size={14} /> View Repo
                          </button>
                          
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              window.open(`/project/${project.slug}`, '_blank'); 
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded font-mono text-xs transition-colors"
                          >
                            <TerminalIcon size={14} /> Explore Architecture
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </Section>

        {/* FOOTER & CONTACT */}
        <Section id="contact" className="py-20 text-center border-t border-white/5">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-transparent to-emerald-900/10 border border-white/5">
            <h3 className="text-3xl font-bold text-white mb-6">Let's Build Something Great</h3>
            <p className="text-slate-400 mb-8">
              I'm always open to discussing backend architecture, new projects, or creative opportunities.
            </p>
            
            <a 
              href="https://mail.google.com/mail/?view=cm&to=shiksha.nath.ug22@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 mb-12"
            >
              <Mail size={18} /> Send me an email
            </a>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Shiksha Nath. All rights reserved.
              </div>
              <div className="flex gap-6 text-slate-400">
                <a href="https://github.com/shiksha-Nath02" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/shiksha-nath-0614751b0/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
                <a href="https://leetcode.com/u/shiksha_nath/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">LeetCode</a>
              </div>
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}

// Ensure the App is wrapped with the DevModeProvider for Context API tracking
export default function App() {
  return (
    <DevModeProvider>
      <AppContent />
    </DevModeProvider>
  );
}