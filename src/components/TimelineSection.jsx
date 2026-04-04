import React from 'react';
import { Milestone, CheckCircle2, Clock } from 'lucide-react';

// Default mock data based on your payload (with a couple extra phases to demonstrate the scroll)
const DEMO_TIMELINE = {
  "meta": {
    "version": 1,
    "title": "Project Evolution"
  },
  "phases": [
    {
      "id": "phase-1",
      "title": "Landing Page",
      "description": "Built modern hero section and branding layout to establish the visual identity.",
      "date": "2026-01",
      "status": "completed",
      "tags": ["UI", "Branding"]
    },
    {
      "id": "phase-2",
      "title": "Routing Engine",
      "description": "Implemented multi-project dynamic routing for seamless navigation.",
      "date": "2026-02",
      "status": "completed",
      "tags": ["Routing", "React Router"]
    },
    {
      "id": "phase-3",
      "title": "API Integrations",
      "description": "Connected backend services to the client state management.",
      "date": "2026-03",
      "status": "completed",
      "tags": ["REST", "Axios", "Redux"]
    },
    {
      "id": "phase-4",
      "title": "Performance Tuning",
      "description": "Optimized bundle sizes and implemented lazy loading for heavy components.",
      "date": "2026-04",
      "status": "in-progress",
      "tags": ["Vite", "Optimization"]
    },
    {
      "id": "phase-5",
      "title": "Public Launch",
      "description": "Final QA, polishing, and production deployment.",
      "date": "2026-05",
      "status": "pending",
      "tags": ["Deployment", "Vercel"]
    }
  ]// me to tatti hu yay :)
};

// ============================================================================
// EMBEDDED CSS (for hiding the horizontal scrollbar)
// ============================================================================
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export const TimelineSection = ({ timeline = DEMO_TIMELINE }) => {
  if (!timeline?.phases?.length) return null;

  // Calculate progress line length based on completed statuses
  const completedCount = timeline.phases.filter(p => p.status === 'completed').length;
  const progressPercentage = timeline.phases.length > 1 
    ? (completedCount / (timeline.phases.length - 1)) * 100 
    : 100;

  return (
    <>
      <style>{styles}</style>
      
      <div className="w-full relative py-8">
        {/* Header Area */}
        <div className="mb-6 px-6 max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
              <Milestone className="w-7 h-7 text-teal-500" />
              {timeline.meta?.title || "Evolution Timeline"}
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">The journey and milestones of the project architecture.</p>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden px-4 py-2 relative">
          <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-slate-800/80 rounded-full" />
          <div
            className="absolute left-7 top-0 w-[2px] bg-gradient-to-b from-teal-600 to-teal-400 rounded-l-full transition-all duration-1000"
            style={{ height: `${progressPercentage}%` }}
          />
          <div className="space-y-4">
            {timeline.phases.map((phase) => {
              const isCompleted = phase.status === 'completed';
              const isCurrent = phase.status === 'in-progress';
              return (
                <div key={phase.id} className="relative pl-12">
                  <div className={`
                    absolute left-5 top-5 w-4 h-4 rounded-full border-[2.5px] -translate-x-1/2 shadow-[0_0_0_3px_rgba(15,23,42,1)]
                    ${isCompleted ? 'bg-teal-500 border-teal-200 shadow-[0_0_10px_rgba(20,184,166,0.4),0_0_0_3px_rgba(15,23,42,1)]' : isCurrent ? 'bg-slate-900 border-teal-400 animate-pulse' : 'bg-slate-900 border-slate-600'}
                  `} />
                  <TimelineCard phase={phase} isCompleted={isCompleted} isCurrent={isCurrent} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: Horizontal Scrollable Timeline */}
        <div className="hidden md:block w-full overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing pb-16 pt-16 px-6 lg:px-12">

          {/* Main Track with fixed height to accommodate cards above and below */}
          <div className="relative min-w-max flex items-center h-[560px]">
            
            {/* The Main Horizontal Axis (Centered Vertically) */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800/80 -translate-y-1/2 rounded-full z-0" />
            
            {/* The Active Progress Axis with Arrow */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-teal-600 to-teal-400 -translate-y-1/2 rounded-l-full transition-all duration-1000 ease-out z-0 flex items-center justify-end"
              style={{ width: `${progressPercentage}%` }}
            >
               {/* The Arrow Head */}
               <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-teal-400 absolute right-0 translate-x-full" />
            </div>

            {/* Timeline Nodes */}
            <div className="relative z-10 flex gap-2 md:gap-4">
              {timeline.phases.map((phase, idx) => {
                // One up, one down alternating logic
                const isTop = idx % 2 === 0; 
                const isCompleted = phase.status === 'completed';
                const isCurrent = phase.status === 'in-progress';
                
                return (
                  <div key={phase.id} className="relative group w-[160px] md:w-[200px] shrink-0 h-full">
                    
                    {/* The Node Dot on the Axis */}
                    <div className={`
                      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-4 h-4 rounded-full border-[2.5px] shadow-[0_0_0_4px_rgba(15,23,42,1)] transition-all duration-300
                      ${isCompleted 
                        ? 'bg-teal-500 border-teal-200 shadow-[0_0_12px_rgba(20,184,166,0.5),0_0_0_4px_rgba(15,23,42,1)]' 
                        : isCurrent 
                          ? 'bg-slate-900 border-teal-400 animate-pulse'
                          : 'bg-slate-900 border-slate-600'
                      }
                      group-hover:scale-125 group-hover:border-teal-300 group-hover:bg-teal-400
                    `} />

                    {isTop ? (
                      <>
                        {/* Vertical Connector Line going UP */}
                        <div 
                          className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[2px] h-8 transition-all duration-500 ease-out ${isCompleted ? 'bg-teal-500/50' : 'bg-slate-700/50'} group-hover:bg-teal-400`} 
                        />
                        {/* TOP CARD */}
                        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 mb-8 w-[260px] md:w-[280px] transition-all duration-500 ease-out group-hover:-translate-y-1 z-10">
                          <TimelineCard phase={phase} isCompleted={isCompleted} isCurrent={isCurrent} />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Vertical Connector Line going DOWN */}
                        <div 
                          className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[2px] h-8 transition-all duration-500 ease-out ${isCompleted ? 'bg-teal-500/50' : 'bg-slate-700/50'} group-hover:bg-teal-400`} 
                        />
                        {/* BOTTOM CARD */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-8 w-[260px] md:w-[280px] transition-all duration-500 ease-out group-hover:translate-y-1 z-10">
                          <TimelineCard phase={phase} isCompleted={isCompleted} isCurrent={isCurrent} />
                        </div>
                      </>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// SUB-COMPONENT: The Story Card
// ============================================================================
const TimelineCard = ({ phase, isCompleted, isCurrent }) => {
  return (
    <div className={`
      p-5 rounded-2xl backdrop-blur-md transition-all duration-300
      ${isCompleted 
        ? 'bg-slate-800/40 border border-slate-700/60 shadow-lg shadow-black/20' 
        : isCurrent
          ? 'bg-teal-900/10 border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.05)]'
          : 'bg-slate-900/40 border border-slate-800/80 grayscale-[0.5] opacity-60'
      }
      group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-teal-500/50 group-hover:bg-slate-800/80 group-hover:shadow-[0_8px_25px_rgb(20,184,166,0.12)]
    `}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-semibold tracking-widest text-teal-400 bg-teal-950/50 px-2.5 py-1 rounded border border-teal-900/50">
          {phase.date}
        </span>
        
        <div className="flex items-center gap-1.5">
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
          {isCurrent && <Clock className="w-3.5 h-3.5 text-amber-500" />}
          <span className={`text-[9px] font-bold tracking-wider uppercase ${isCompleted ? 'text-teal-500' : isCurrent ? 'text-amber-500' : 'text-slate-500'}`}>
            {phase.status}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-teal-300 transition-colors">
        {phase.title}
      </h3>
      
      <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[40px]">
        {phase.description}
      </p>
      
      {phase.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap pt-3 border-t border-slate-700/50">
          {phase.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-slate-950/50 text-slate-300 rounded border border-slate-800 group-hover:border-slate-600 transition-colors">
              <span className="text-teal-600 mr-1 opacity-70">#</span>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Default export wrapper for the Canvas preview
export default function App(props) {
  return (
    <div className="min-h-screen bg-[#0b1121] flex items-center justify-center font-sans">
      <TimelineSection {...props} />
    </div>
  );
}