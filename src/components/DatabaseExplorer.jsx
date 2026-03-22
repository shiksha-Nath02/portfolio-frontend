import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

// --- COMPONENTS ---

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    primary: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    unique: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    nullable: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    default: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    type: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    relation: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    db: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  };

  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md border ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

const FieldRow = ({ field }) => (
  <tr className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
    <td className="py-2.5 px-4 whitespace-nowrap text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
      {field.name}
    </td>
    <td className="py-2.5 px-4 whitespace-nowrap text-sm font-mono">
      <Badge variant="type">{field.type}</Badge>
    </td>
    <td className="py-2.5 px-4 flex flex-wrap gap-1.5 items-center min-w-[200px]">
      {field.primary && <Badge variant="primary">PK</Badge>}
      {field.unique && <Badge variant="unique">Unique</Badge>}
      {field.nullable ? <Badge variant="nullable">Nullable</Badge> : <Badge variant="default">Required</Badge>}
      {field.default && (
        <span className="ml-1 text-[11px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
          = {field.default}
        </span>
      )}
    </td>
  </tr>
);

const FieldsTable = ({ fields }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-700/60 bg-slate-800/30">
          <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">Name</th>
          <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">Type</th>
          <th className="py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attributes</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field, idx) => (
          <FieldRow key={idx} field={field} />
        ))}
      </tbody>
    </table>
  </div>
);

const RelationList = ({ relations }) => {
  if (!relations || relations.length === 0) return null;

  return (
    <div className="mt-auto border-t border-slate-700/60 bg-slate-900/50">
      <div className="px-4 py-3 flex items-center justify-between cursor-default">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Relations
        </h4>
        <span className="text-xs font-medium text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{relations.length}</span>
      </div>
      
      <ul className="px-4 pb-3 space-y-2">
        {relations.map((rel, idx) => (
          <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">{rel.field}</span>
              {rel.references && (
                <>
                  <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-xs font-mono text-indigo-300/80 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    {rel.references}
                  </span>
                </>
              )}
            </div>
            <div className="self-start sm:self-auto mt-2 sm:mt-0">
              <Badge variant="relation">{rel.type ? rel.type.replace(/-/g, ' ') : 'relation'}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TableCard = ({ table }) => (
  <div className="bg-[#111827] border border-slate-700/60 rounded-xl shadow-lg hover:shadow-xl hover:border-slate-600/80 transition-all flex flex-col h-full overflow-hidden group">
    <div className="p-4 border-b border-slate-700/60 flex justify-between items-start bg-slate-800/20 group-hover:bg-slate-800/40 transition-colors">
      <div>
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          {table.name}
        </h3>
        <span className="text-xs text-slate-500 font-medium">{table.fields?.length || 0} columns</span>
      </div>
    </div>
    
    <div className="flex-grow">
      <FieldsTable fields={table.fields || []} />
    </div>
    
    <RelationList relations={table.relations} />
  </div>
);

// --- NEW INTERACTIVE ER DIAGRAM GRAPH ---
const GraphView = ({ tables }) => {
  const [positions, setPositions] = useState({});
  const [dragInfo, setDragInfo] = useState({ isDragging: false, tableName: null, startX: 0, startY: 0, initialNodeX: 0, initialNodeY: 0 });

  // Initialize node positions in a simple staggered grid
  useEffect(() => {
    const newPos = {};
    tables.forEach((table, idx) => {
      newPos[table.name] = {
        x: 50 + (idx % 3) * 350,
        y: 50 + Math.floor(idx / 3) * 280
      };
    });
    setPositions(newPos);
  }, [tables]);

  const handleMouseDown = (e, tableName) => {
    e.preventDefault(); 
    setDragInfo({
      isDragging: true,
      tableName,
      startX: e.clientX,
      startY: e.clientY,
      initialNodeX: positions[tableName]?.x || 0,
      initialNodeY: positions[tableName]?.y || 0
    });
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.isDragging) return;
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    setPositions(prev => ({
      ...prev,
      [dragInfo.tableName]: {
        x: Math.max(0, dragInfo.initialNodeX + dx),
        y: Math.max(0, dragInfo.initialNodeY + dy)
      }
    }));
  };

  const handleMouseUp = () => {
    if (dragInfo.isDragging) {
      setDragInfo({ isDragging: false, tableName: null, startX: 0, startY: 0, initialNodeX: 0, initialNodeY: 0 });
    }
  };

  // Compile edges based on relations using canonical target
  const edges = [];

  tables.forEach(table => {
    if (!table.relations) return;

    table.relations.forEach(rel => {
      if (!rel || !rel.target) return;

      if (!positions[table.name] || !positions[rel.target]) return;

      edges.push({
        id: `${table.name}-${rel.target}-${rel.field}`,
        source: table.name,
        target: rel.target,
        type: rel.type
      });
    });
  });

  // Calculate dynamic canvas bounds based on node positions
  const positionValues = Object.values(positions);
  const maxNodeX = positionValues.length > 0 ? Math.max(...positionValues.map(p => p.x)) : 0;
  const maxNodeY = positionValues.length > 0 ? Math.max(...positionValues.map(p => p.y)) : 0;
  
  // Dynamic width/height: either 100% of parent, or large enough to fit the furthest node + padding
  const canvasWidth = `max(100%, ${maxNodeX + 400}px)`;
  const canvasHeight = `max(100%, ${maxNodeY + 500}px)`;

  return (
    <div className="bg-[#111827] border border-slate-700/60 rounded-xl overflow-hidden flex flex-col h-[700px] shadow-lg">
      <div className="p-3 border-b border-slate-700/60 bg-slate-800/40 flex justify-between items-center z-10">
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Interactive ER Canvas — Drag tables to arrange
        </span>
      </div>
      
      <div
        className="relative flex-grow overflow-auto cursor-grab active:cursor-grabbing bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:bg-slate-900/40 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute" 
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {/* Edges SVG Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" />
              </marker>
            </defs>
            {edges.map(edge => {
              const sourcePos = positions[edge.source];
              const targetPos = positions[edge.target];
              if (!sourcePos || !targetPos) return null;

              // Calculate rough center of the table components
              const startX = sourcePos.x + 140; 
              const startY = sourcePos.y + 40;  
              const endX = targetPos.x + 140;
              const endY = targetPos.y + 40;

              // Bezier curve to make edges look natural
              const controlPointX = (startX + endX) / 2;
              const pathD = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

              return (
                <path
                  key={edge.id}
                  d={pathD}
                  stroke="#818cf8"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={edge.type === 'one-to-many' ? "5,5" : "none"}
                  markerEnd="url(#arrowhead)"
                  className="opacity-60 transition-all"
                />
              );
            })}
          </svg>

          {/* Draggable Nodes Layer */}
          {tables.map(table => {
            const pos = positions[table.name];
            if (!pos) return null;

            return (
              <div
                key={table.name}
                style={{ left: pos.x, top: pos.y }}
                className="absolute w-[280px] bg-[#0f172a] border border-slate-600 shadow-xl rounded-lg flex flex-col z-10 transition-shadow hover:shadow-indigo-500/20"
                onMouseDown={(e) => handleMouseDown(e, table.name)}
              >
                <div className="p-3 border-b border-slate-700 bg-slate-800/80 rounded-t-lg cursor-move flex items-center justify-between group">
                  <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                     <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                     </svg>
                     {table.name}
                  </h4>
                  <Badge variant="db">{table.fields?.length || 0}</Badge>
                </div>
                <div className="p-0 flex flex-col text-xs max-h-[250px] overflow-y-auto">
                {(table.fields || []).map((f, idx) => (
                  <div
                    key={f.name || idx}
                    className={`flex justify-between items-center px-3 py-2 ${
                      idx !== table.fields.length - 1 ? "border-b border-slate-800/50" : ""
                    }`}
                  >
                    <span className="text-slate-300 font-medium">{f.name}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{f.type}</span>
                  </div>
                ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


const DatabaseHeader = ({ dbType, tableCount, viewMode, setViewMode }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800/80">
    <div className="flex items-center gap-3">
      <Badge variant="db">{dbType}</Badge>
      <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {tableCount} Tables
      </span>
    </div>
    
    <div className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700/60 shadow-inner">
      <button 
        onClick={() => setViewMode('card')} 
        className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
          viewMode === 'card' 
            ? 'bg-slate-700/80 text-white shadow-sm ring-1 ring-slate-600' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Cards
      </button>
      <button 
        onClick={() => setViewMode('er')} 
        className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
          viewMode === 'er' 
            ? 'bg-slate-700/80 text-white shadow-sm ring-1 ring-slate-600' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Graph
      </button>
    </div>
  </div>
);

const DatabaseViewer = ({ databaseData }) => {
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'er'
  const [searchQuery, setSearchQuery] = useState('');

  if (!databaseData || !databaseData.tables) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-6">
        <div className="text-center bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-slate-300">No Data Available</h3>
          <p className="text-slate-500 mt-2 text-sm">Please provide valid databaseData prop.</p>
        </div>
      </div>
    );
  }

  const filteredTables = databaseData.tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-300 p-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        <DatabaseHeader
          dbType={databaseData.databaseType}
          tableCount={databaseData.tables.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="mb-8 flex gap-4">
          <div className="relative flex-1 max-w-md group">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tables..."
              className="w-full bg-[#111827] border border-slate-700/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {viewMode === 'card' ? (
          filteredTables.length > 0 ? (
            /* Using flex-col to stack items vertically down */
            <div className="flex flex-col gap-6 items-stretch w-full">
              {filteredTables.map((table, idx) => (
                <TableCard key={idx} table={table} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500">No tables found matching "{searchQuery}"</p>
            </div>
          )
        ) : (
          /* Graph Mode Active */
          <GraphView tables={filteredTables} />
        )}
      </div>
    </div>
  );
};

// Main Export Component
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const fetchDatabase = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
  `https://raw.githubusercontent.com/shiksha-Nath02/${slug}/main/docs/database.json`,
  { signal }
); 
      if (!response.ok) {
        throw new Error(`Failed to load schema (HTTP ${response.status})`);
      }
      
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDatabase(controller.signal);
    
    return () => {
      controller.abort();
    };
  }, [slug]);

if (loading) return null;

if (error) return null;

if (!data || !data.tables || data.tables.length === 0) {
  return null;
}

return <DatabaseViewer databaseData={data} />;
}