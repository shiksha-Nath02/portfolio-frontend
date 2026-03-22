import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { 
  Server, Database, Layers, Activity, Smartphone, Cpu, Box, 
  Cloud, Network, Zap, Clock, Search, HardDrive, LineChart 
} from "lucide-react";


// RESTORED: Map categories to dynamic icons and colors (Updated with your new categories)
const getCategoryConfig = (category) => {
  const normalized = category?.toLowerCase() || '';
  if (normalized.includes('client')) return { icon: Smartphone, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' };
  if (normalized.includes('delivery')) return { icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
  if (normalized.includes('gateway')) return { icon: Network, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' };
  if (normalized.includes('service')) return { icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' };
  if (normalized.includes('database')) return { icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
  if (normalized.includes('data') || normalized.includes('sync')) return { icon: Layers, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20' };
  if (normalized.includes('performance') || normalized.includes('cache')) return { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
  if (normalized.includes('async')) return { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
  if (normalized.includes('search')) return { icon: Search, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' };
  if (normalized.includes('storage')) return { icon: HardDrive, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' };
  if (normalized.includes('observability')) return { icon: LineChart, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' };
  // New specifically for Realtime/Streaming
  if (normalized.includes('realtime') || normalized.includes('streaming')) return { icon: Activity, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
  
  return { icon: Box, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' };
};

const ArchitectureExplorer = ({ architecture }) => {
  const containerRef = useRef(null);
  const [rects, setRects] = useState({});
  const [isRendered, setIsRendered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Safely extract nodes and edges
  const nodes = architecture?.nodes || [];
  const edges = architecture?.edges || [];

  // Function to measure the positions of all node cards relative to the container
  const updateLayout = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newRects = {};
    const elements = containerRef.current.querySelectorAll('[data-node-id]');
    
    elements.forEach(el => {
      const id = el.getAttribute('data-node-id');
      const rect = el.getBoundingClientRect();
      
      newRects[id] = {
        cx: (rect.left - containerRect.left) + rect.width / 2,
        cy: (rect.top - containerRect.top) + rect.height / 2,
        width: rect.width,
        height: rect.height
      };
    });

    setRects(newRects);
    setIsRendered(true);
  }, []);

  // Set up resize observer to keep lines attached when window resizes
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      // Small timeout to allow grid transitions to settle
      setTimeout(updateLayout, 50); 
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateLayout);
    updateLayout();
    
    // Fallback delayed update for font-loads
    const to = setTimeout(updateLayout, 200);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
      clearTimeout(to);
    };
  }, [updateLayout, nodes]);

  // Logic to determine if a node or edge should be dimmed based on current hover state
  const getConnections = (nodeId) => {
    if (!nodeId) return { nodes: new Set(), edges: new Set() };
    const connectedNodes = new Set([nodeId]);
    const connectedEdges = new Set();
    
    edges.forEach(edge => {
      if (edge.from === nodeId || edge.to === nodeId) {
        connectedNodes.add(edge.from);
        connectedNodes.add(edge.to);
        connectedEdges.add(edge.id);
      }
    });
    return { nodes: connectedNodes, edges: connectedEdges };
  };

  const activeConnections = getConnections(hoveredNode);

  if (!nodes.length) return null;

  return (
    <div 
      className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl overflow-hidden"
      ref={containerRef}
      onMouseLeave={() => setHoveredNode(null)}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* SVG Canvas for drawing connecting edges */}
      <svg 
        className={`absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`} 
      >
        {edges.map((edge) => {
          const from = rects[edge.from];
          const to = rects[edge.to];
          if (!from || !to) return null;

          const x1 = from.cx;
          const y1 = from.cy;
          const x2 = to.cx;
          const y2 = to.cy;

          // Standardize curvature for a multi-column layout
          const isHorizontal = Math.abs(x2 - x1) > Math.abs(y2 - y1);
          const curvature = 0.5; // Slightly deeper curve for wider gaps
          
          const cp1x = isHorizontal ? x1 + (x2 - x1) * curvature : x1;
          const cp1y = isHorizontal ? y1 : y1 + (y2 - y1) * curvature;
          const cp2x = isHorizontal ? x2 - (x2 - x1) * curvature : x2;
          const cp2y = isHorizontal ? y2 : y2 - (y2 - y1) * curvature;

          const pathD = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
          
          const isFaded = hoveredNode && !activeConnections.edges.has(edge.id);
          const isHighlighted = hoveredNode && activeConnections.edges.has(edge.id);

          return (
            <g 
              key={edge.id}
              className={`transition-all duration-300 ${isFaded ? 'opacity-10' : isHighlighted ? 'opacity-100' : 'opacity-50'}`}
            >
              {/* Background solid track line */}
              <path d={pathD} fill="none" stroke={isHighlighted ? "#14b8a6" : "#1e293b"} strokeWidth={isHighlighted ? "3" : "2"} />
              {/* Foreground animated flow line */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="2" 
                strokeDasharray="6 6" 
                className={isFaded ? 'hidden' : 'opacity-80'}
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="12" 
                  to="0" 
                  dur={isHighlighted ? "0.5s" : "1s"} 
                  repeatCount="indefinite" 
                />
              </path>
            </g>
          );
        })}
      </svg>

      {/* Edge Labels (Floating Data Flow markers) */}
      {isRendered && edges.map((edge) => {
        const from = rects[edge.from];
        const to = rects[edge.to];
        if (!from || !to) return null;

        const isFaded = hoveredNode && !activeConnections.edges.has(edge.id);
        const isHighlighted = hoveredNode && activeConnections.edges.has(edge.id);
        
        // Hide labels completely if we are hovering elsewhere, otherwise they clutter the screen
        if (hoveredNode && !isHighlighted) return null;

        // Approximate midpoint of the cubic bezier
        const midX = (from.cx + to.cx) / 2;
        const midY = (from.cy + to.cy) / 2;

        return (
          <div
            key={`label-${edge.id}`}
            className={`absolute z-20 px-2.5 py-1 bg-slate-900 border ${isHighlighted ? 'border-teal-500 text-teal-300 scale-110' : 'border-slate-700 text-slate-400 scale-100'} text-[10px] sm:text-[11px] font-mono rounded-full shadow-lg shadow-black/50 flex items-center gap-1.5 whitespace-nowrap transition-all duration-300`}
            style={{
              left: midX,
              top: midY,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Activity className="w-3 h-3" />
            {edge.label}
          </div>
        );
      })}

      {/* Grid of Nodes - upgraded to 3 columns for larger datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative z-10">
        {nodes.map((node) => {
          const { icon: Icon, color, bg, border } = getCategoryConfig(node.category);
          const isFaded = hoveredNode && !activeConnections.nodes.has(node.id);
          const isHighlighted = hoveredNode === node.id;
          
          return (
            <div 
              key={node.id} 
              data-node-id={node.id}
              className={`group flex transition-all duration-300 ${isFaded ? 'opacity-30 scale-95 grayscale' : 'opacity-100 scale-100'}`}
              onMouseEnter={() => setHoveredNode(node.id)}
            >
              {/* Opaque solid background so lines are hidden underneath */}
              <div className={`w-full bg-[#0f172a] p-5 rounded-xl border ${isHighlighted ? 'border-teal-500/50 shadow-teal-500/10' : 'border-slate-800'} shadow-xl shadow-black/40 hover:border-slate-600 transition-colors duration-300 cursor-crosshair`}>
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${bg} ${border} border`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    {node.label}
                  </h3>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-1 bg-slate-950/80 text-slate-400 rounded border border-slate-800/50">
                    {node.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[48px]">
                  {node.description}
                </p>
                
                {node.stack?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap pt-3 border-t border-slate-800/50">
                    {node.stack.map((tech) => (
                      <span key={tech} className="text-[10px] font-medium text-slate-300 bg-slate-800/50 px-1.5 py-0.5 rounded">
                        <span className="text-slate-500 mr-1 opacity-50">#</span>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Wrapper App
export default function App() {
  const [architecture, setArchitecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams(); // repo name from URL

  useEffect(() => {
    const fetchArchitecture = async () => {
      try {
        const res = await fetch(
           `https://raw.githubusercontent.com/shiksha-Nath02/${slug}/main/docs/architecture.json`
        );
        const data = await res.json();
        setArchitecture(data);
      } catch (err) {
        console.error("Failed to load architecture:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchitecture();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading architecture...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 flex flex-col items-center justify-center font-sans text-slate-200">
      <div className="w-full max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Microservices Architecture
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Hover over any component to highlight its specific data flows and dependencies.
          </p>
        </div>

        <ArchitectureExplorer architecture={architecture} />
      </div>
    </div>
  );
}