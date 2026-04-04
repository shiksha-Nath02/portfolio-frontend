import { Activity } from "lucide-react";

const ProjectSidebar = ({ content, activeSectionId }) => {
const sections = [];

if (content?.json?.timeline?.phases?.length) sections.push({ id: "timeline", label: "Timeline" });
if (content?.markdown?.overview) sections.push({ id: "overview", label: "Overview" });
if (content?.json?.architecture?.nodes?.length) sections.push({ id: "architecture", label: "Architecture" });
if (content?.json?.api?.endpoints?.length) sections.push({ id: "api", label: "API Reference" });
if (content?.json?.database?.tables?.length) sections.push({ id: "database", label: "Database Schema" });
if (content?.markdown?.challenges) sections.push({ id: "challenges", label: "Challenges" });
if (content?.markdown?.lessons) sections.push({ id: "lessons", label: "Lessons Learned" });

if (!sections.length) return null;

return (
<aside className="sticky top-24 w-64 hidden lg:block flex-shrink-0">
<div className="bg-slate-900/30 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-2xl">
<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
<Activity className="w-3 h-3 text-teal-500" /> On This Page
</h3>

    <ul className="space-y-1 relative border-l border-slate-800/60 ml-1.5 pl-4">
      {sections.map((section) => {
        const isActive = activeSectionId === section.id;

        return (
          <li key={section.id} className="relative">
            {isActive && (
              <span
                className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                style={{ animation: "slideIn 0.2s ease-out forwards" }}
              />
            )}
            <a
              href={`#${section.id}`}
              className={`
                block py-1.5 text-sm transition-all duration-200
                ${
                  isActive
                    ? "text-teal-400 font-medium translate-x-1"
                    : "text-slate-400 hover:text-slate-200 hover:translate-x-1"
                }
              `}
            >
              {section.label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>

  <style dangerouslySetInnerHTML={{
    __html: `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
      to { opacity: 1; transform: translateY(-50%) translateX(0); }
    }
  `
  }} />
</aside>


);
};

export default ProjectSidebar;
