import React, { useState } from "react";
import { ChevronDown, Code } from "lucide-react";

// ============================================================================
// EMBEDDED CSS (Replaces "../styles/apiExplorer.css")
// ============================================================================
const styles = `
  .api-explorer {
    --bg-base: transparent;
    --bg-card: rgba(15, 23, 42, 0.4);
    --bg-hover: rgba(30, 41, 59, 0.8);
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    
    --color-get: #10b981;
    --bg-get: rgba(16, 185, 129, 0.15);
    --border-get: rgba(16, 185, 129, 0.3);
    
    --color-post: #3b82f6;
    --bg-post: rgba(59, 130, 246, 0.15);
    --border-post: rgba(59, 130, 246, 0.3);
    
    --color-put: #f59e0b;
    --bg-put: rgba(245, 158, 11, 0.15);
    --border-put: rgba(245, 158, 11, 0.3);
    
    --color-delete: #ef4444;
    --bg-delete: rgba(239, 68, 68, 0.15);
    --border-delete: rgba(239, 68, 68, 0.3);

    font-family: system-ui, -apple-system, sans-serif;
    color: var(--text-primary);
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Masonry Layout for Groups */
  .api-groups-container {
    column-count: 1;
    column-gap: 2rem;
  }

  @media (min-width: 800px) {
    .api-groups-container {
      column-count: 2;
    }
  }

  .api-base-url {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    color: var(--text-secondary);
    backdrop-filter: blur(8px);
  }

  .api-base-url span {
    color: var(--text-primary);
    font-weight: 500;
  }

  .api-group {
    break-inside: avoid;
    page-break-inside: avoid;
    display: block;
    width: 100%;
    margin-bottom: 2rem;
    transform: translateZ(0); /* Fixes rendering glitches in some browsers during column break */
  }

  .api-group-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Sleek Section Dividers instead of large bulky headers */
  .api-group-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .api-group-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
  }

  .api-endpoint {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }

  .api-endpoint:hover {
    border-color: var(--border-hover);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .api-endpoint:focus-within {
    border-color: var(--text-muted);
  }

  .api-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    user-select: none;
  }

  .api-header:hover, .api-header:focus {
    background-color: var(--bg-hover);
    outline: none;
  }

  .api-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* Upgraded Badges */
  .api-method {
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: 0.375rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 3.5rem;
    text-align: center;
    border: 1px solid transparent;
  }

  .method-get { background-color: var(--bg-get); color: var(--color-get); border-color: var(--border-get); }
  .method-post { background-color: var(--bg-post); color: var(--color-post); border-color: var(--border-post); }
  .method-put { background-color: var(--bg-put); color: var(--color-put); border-color: var(--border-put); }
  .method-delete { background-color: var(--bg-delete); color: var(--color-delete); border-color: var(--border-delete); }
  .method-default { background-color: var(--text-muted); color: #fff; }

  .api-path {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .api-icon {
    color: var(--text-muted);
    transition: transform 0.3s ease;
  }
  
  .api-icon.open {
    transform: rotate(180deg);
  }

  .api-details {
    padding: 1.5rem 1.25rem;
    border-top: 1px solid var(--border-color);
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .api-summary {
    color: var(--text-primary);
    line-height: 1.5;
    margin: 0;
  }

  .api-section-title {
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
  }

  .api-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .api-table th {
    color: var(--text-muted);
    font-weight: 500;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .api-table td {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .api-table tr:last-child td {
    border-bottom: none;
    padding-bottom: 0;
  }

  .api-response-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .api-status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: var(--bg-get);
    color: var(--color-get);
  }
`;

// ============================================================================
// API EXPLORER COMPONENT
// ============================================================================
export const ApiExplorer = ({ api }) => {
  const [openEndpoint, setOpenEndpoint] = useState(null);

  if (!api?.endpoints?.length) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
          No endpoints available.
        </div>
      </>
    );
  }

  // 🔹 Group endpoints by first path segment safely
  const grouped = api.endpoints.reduce((acc, endpoint) => {
    // Filter out empty segments (e.g., if path starts with "/")
    const segments = endpoint.path.split("/").filter(Boolean);
    const segment = segments.length > 0 ? segments[0] : "root";
    
    if (!acc[segment]) acc[segment] = [];
    acc[segment].push(endpoint);
    return acc;
  }, {});

  const toggle = (key) => {
    setOpenEndpoint(openEndpoint === key ? null : key);
  };

  const handleKeyDown = (e, key) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(key);
    }
  };

  const getMethodClass = (method) => {
    switch (method?.toUpperCase()) {
      case "GET": return "method-get";
      case "POST": return "method-post";
      case "PUT": return "method-put";
      case "DELETE": return "method-delete";
      default: return "method-default";
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="api-explorer">
        {api.meta?.basePath && (
          <div className="api-base-url">
            <Code size={18} />
            Base URL: <span>{api.meta.basePath}</span>
          </div>
        )}

        <div className="api-groups-container">
          {Object.entries(grouped).map(([group, endpoints]) => (
            <section key={group} className="api-group">
              <h3 className="api-group-title">{group}</h3>

              <div className="api-group-list">
                {endpoints.map((endpoint) => {
                  const key = `${endpoint.method}-${endpoint.path}`;
                  const isOpen = openEndpoint === key;

                  return (
                    <article key={key} className="api-endpoint">
                      {/* HEADER */}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        onClick={() => toggle(key)}
                        onKeyDown={(e) => handleKeyDown(e, key)}
                        className="api-header"
                      >
                        <div className="api-header-left">
                          <span className={`api-method ${getMethodClass(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <span className="api-path">{endpoint.path}</span>
                        </div>

                        <ChevronDown
                          size={18}
                          className={`api-icon ${isOpen ? "open" : ""}`}
                        />
                      </div>

                      {/* DROPDOWN CONTENT */}
                      {isOpen && (
                        <div className="api-details">
                          {endpoint.summary && (
                            <p className="api-summary">{endpoint.summary}</p>
                          )}

                          {/* PARAMETERS */}
                          {endpoint.parameters?.length > 0 && (
                            <div>
                              <h4 className="api-section-title">Parameters</h4>
                              <table className="api-table">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>In</th>
                                    <th>Type</th>
                                    <th>Required</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param) => (
                                    <tr key={param.name}>
                                      <td><strong>{param.name}</strong></td>
                                      <td>{param.in}</td>
                                      <td><code style={{ fontSize: '0.8em', padding: '0.2em 0.4em', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}>{param.type}</code></td>
                                      <td>{param.required ? "Yes" : "No"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* REQUEST BODY */}
                          {endpoint.requestBody?.fields?.length > 0 && (
                            <div>
                              <h4 className="api-section-title">Request Body</h4>
                              <table className="api-table">
                                <thead>
                                  <tr>
                                    <th>Field</th>
                                    <th>Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.requestBody.fields.map((field) => (
                                    <tr key={field.name}>
                                      <td><strong>{field.name}</strong></td>
                                      <td><code style={{ fontSize: '0.8em', padding: '0.2em 0.4em', background: 'rgba(255,255,255,0.1)', borderRadius: '4px'}}>{field.type}</code></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* RESPONSES */}
                          {endpoint.responses?.length > 0 && (
                            <div>
                              <h4 className="api-section-title">Responses</h4>
                              <div>
                                {endpoint.responses.map((res) => (
                                  <div key={res.status} className="api-response-item">
                                    <span className="api-status-badge">
                                      {res.status}
                                    </span>
                                    <span>{res.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

// Canvas requires a default App component
export default function App(props) {
  return (
    <div className="min-h-screen bg-slate-900 pt-8">
      <ApiExplorer {...props} />
    </div>
  );
}