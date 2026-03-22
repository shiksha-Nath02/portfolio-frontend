import React from 'react';
import { Github, Database, ArrowRight, Activity, GitCommit, FileCode2, Coffee, Layers } from 'lucide-react';

export const EngineSection = () => {
  return (
    <section id="engine" className="relative z-10 py-24 border-y border-white/5 bg-slate-900/20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="animate-spin-slow">⚙️</span> The Engine Behind This Portfolio
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            This portfolio is not static. It automatically pulls architecture, documentation, and metadata directly from my GitHub repositories. <strong className="text-emerald-400">Documentation that writes itself.</strong>
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 font-mono text-sm">
          {/* Flow Block 1 */}
          <div className="p-6 bg-slate-900 border border-white/10 rounded-xl text-center w-full md:w-48 relative group hover:border-emerald-500/50 transition-colors">
            <Github className="w-8 h-8 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" />
            <p className="text-slate-300">GitHub Repo</p>
          </div>
          
          <ArrowRight className="text-emerald-500/50 hidden md:block" />
          <ArrowRight className="text-emerald-500/50 md:hidden rotate-90" />

          {/* Flow Block 2 */}
          <div className="p-6 bg-slate-900 border border-white/10 rounded-xl text-center w-full md:w-48 relative group hover:border-cyan-500/50 transition-colors">
            <FileCode2 className="w-8 h-8 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" />
            <p className="text-slate-300">Architecture Scanner</p>
          </div>

          <ArrowRight className="text-cyan-500/50 hidden md:block" />
          <ArrowRight className="text-cyan-500/50 md:hidden rotate-90" />

          {/* Flow Block 3 */}
          <div className="p-6 bg-slate-900 border border-white/10 rounded-xl text-center w-full md:w-48 relative group hover:border-indigo-500/50 transition-colors">
            <Activity className="w-8 h-8 mx-auto mb-3 text-slate-400 group-hover:text-white transition-colors" />
            <p className="text-slate-300">Portfolio Sync</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SystemThinkingSection = () => {
  return (
    <section className="relative z-10 py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold text-white mb-8">How I Think About Systems</h3>
        <p className="text-xl text-slate-400 mb-12 italic">
          "I don't just build features. I design systems that survive scale."
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {['Predictable APIs', 'Scalable Databases', 'Observable Services', 'Maintainable Architecture'].map((item, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-lg border-l-2 border-l-emerald-500">
              <span className="text-emerald-400 font-mono text-xs mb-2 block">0{i+1}</span>
              <p className="text-slate-200 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StatsPanel = () => {
  return (
    <section className="relative z-10 py-12 mb-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="p-8 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <h4 className="text-sm font-mono text-emerald-400 mb-6 uppercase tracking-wider">System Telemetry</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2"><Layers size={16}/> Projects Indexed</div>
              <div className="text-3xl font-bold text-white">7</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2"><Database size={16}/> Architecture Scanned</div>
              <div className="text-3xl font-bold text-white">12</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2"><GitCommit size={16}/> Commits Analyzed</div>
              <div className="text-3xl font-bold text-white">1,432</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2"><Coffee size={16}/> Coffee Consumed</div>
              <div className="text-3xl font-bold text-white">Too Much</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};