import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Activity, GitBranch, BookOpen, AlertTriangle, Lightbulb } from "lucide-react";
import { loadProjectContent } from "../engine/projectContentLoader";
import useScrollSpy from "../hooks/useScrollSpy";

import MarkdownRenderer from "../components/MarkdownRenderer";
import TimelineSection from "../components/TimelineSection";
import ArchitectureExplorer from "../components/ArchitectureExplorer";
import ApiExplorer from "../components/ApiExplorer";
import DatabaseExplorer from "../components/DatabaseExplorer";
import ProjectSidebar from "../components/ProjectSidebar";
import CollapsibleSection from "../components/CollapsibleSection";

// Reusable styled container for text-heavy sections
const StyledTextSection = ({ id, title, icon: Icon, children }) => (
  <div id={id} className="bg-slate-900/40 border border-white/10 border-l-2 border-l-emerald-500/40 rounded-lg p-4 pl-5 mb-4 max-w-3xl hover:border-white/20 hover:border-l-emerald-400 transition-all">
    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-emerald-400" />}
      {title}
    </h3>
    
    {/* Targeting markdown elements to enforce the dense system log styling. 
      H4 and Strong tags act like the "Problem" / "Solution" labels.
    */}
    <div className="space-y-2 text-sm text-slate-300 
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-1
      [&_h4]:text-sm [&_h4]:font-medium [&_h4]:text-emerald-400 [&_h4]:mt-3 [&_h4]:mb-1
      [&_strong]:text-emerald-400 [&_strong]:font-medium
      [&_p]:text-sm [&_p]:text-slate-300 [&_p]:leading-relaxed
      [&_ul]:space-y-1 [&_ul]:ml-2 [&_li]:relative [&_li]:pl-4 [&_li]:before:content-['>'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-emerald-500 [&_li]:before:font-mono">
      {children}
    </div>
  </div>
);

export default function ProjectPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      const data = await loadProjectContent(slug);
      setContent(data);
      setLoading(false);
    }
    fetchContent();
  }, [slug]);

  // Smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const sectionIds = useMemo(() => {
    if (!content) return [];
    const ids = [];

    if (content.markdown?.overview) ids.push("overview");
    if (content.markdown?.challenges) ids.push("challenges");
    if (content.markdown?.lessons) ids.push("lessons");
    if (content.json?.timeline?.phases?.length) ids.push("timeline");
    if (content.json?.architecture?.nodes?.length) ids.push("architecture");
    if (content.json?.api?.endpoints?.length) ids.push("api");
    if (content.json?.database?.tables?.length) ids.push("database");

    return ids;
  }, [content]);

  const activeSectionId = useScrollSpy(sectionIds);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
        <div className="text-sm font-mono tracking-wider text-emerald-400/80">
          Syncing documentation from source...
        </div>
      </div>
    );
  }

  // ⭐ Detect if project has no docs
  const noDocs =
    !content?.markdown?.overview &&
    !content?.json?.architecture &&
    !content?.json?.api &&
    !content?.json?.database;

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/10 text-slate-300 font-sans pb-32">
      <main className="max-w-screen-xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-4 border border-emerald-500/20">
            <GitBranch className="w-4 h-4" />
            Project Documentation
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </h1>

          <p className="text-lg text-slate-400">
            Dynamically rendered system specifications and architecture graphs.
          </p>
        </header>

        {/* If no docs exist */}
        {noDocs && (
          <div className="text-center text-slate-400 mt-12 max-w-3xl p-6 border border-white/10 rounded-lg bg-slate-900/40">
            Documentation not generated yet.

            <div className="mt-4 font-mono text-sm text-emerald-400 bg-black/50 p-4 rounded inline-block text-left">
              $ sky-doc-engine init  
              <br />
              $ sky-doc-engine generate --all
            </div>
          </div>
        )}

        {/* Docs viewer */}
        {!noDocs && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            <div className="flex-1 min-w-0 w-full">
              <div className="space-y-4">

                {content?.json?.timeline && (
                  <CollapsibleSection id="timeline" title="Evolution Timeline" defaultOpen>
                    <TimelineSection timeline={content.json.timeline} />
                  </CollapsibleSection>
                )}

                {content?.markdown?.overview && (
                  <StyledTextSection id="overview" title="System Overview" icon={BookOpen}>
                    <MarkdownRenderer content={content.markdown.overview} />
                  </StyledTextSection>
                )}

                {content?.json?.architecture && (
                  <CollapsibleSection id="architecture" title="System Architecture" defaultOpen>
                    <ArchitectureExplorer architecture={content.json.architecture} />
                  </CollapsibleSection>
                )}

                {content?.json?.api && (
                  <CollapsibleSection id="api" title="API Reference">
                    <ApiExplorer api={content.json.api} />
                  </CollapsibleSection>
                )}

                {content?.json?.database && (
                  <CollapsibleSection id="database" title="Database Schema">
                    <DatabaseExplorer database={content.json.database} />
                  </CollapsibleSection>
                )}

                {content?.markdown?.challenges && (
                  <StyledTextSection id="challenges" title="Engineering Challenges" icon={AlertTriangle}>
                    <MarkdownRenderer content={content.markdown.challenges} />
                  </StyledTextSection>
                )}

                {content?.markdown?.lessons && (
                  <StyledTextSection id="lessons" title="Lessons Learned" icon={Lightbulb}>
                    <MarkdownRenderer content={content.markdown.lessons} />
                  </StyledTextSection>
                )}

              </div>
            </div>

            <ProjectSidebar content={content} activeSectionId={activeSectionId} />

          </div>
        )}
      </main>
    </div>
  );
}